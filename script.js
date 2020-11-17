// função que soma os preços dos itens armazenados no local storage
function localStorageValues() {
  let sum = 0;
  for (let i = 0; i < localStorage.length; i += 1) {
    if (localStorage.length > 0) {
      const value = localStorage.getItem(localStorage.key(i));
      sum += parseFloat(value);
    }
  }
  return sum;
}

// função que adiciona o preço total dos produtos do carrinho
async function addTotalPrice() {
  const price = document.querySelector('.total-price');
  price.innerText = localStorageValues();
}

// salva os itens do carrinho no local storage
const localStorageContent = (key, value) => {
  localStorage.setItem(key, value);
};

function cartItemClickListener(event) {
  localStorage.removeItem(event.target.innerText);
  event.target.parentNode.removeChild(event.target);
  addTotalPrice();
}

/*
  função que carrega o local storage.
  Essa função vai recriar os items do carrinho que ficaram armazenados no local storage
*/
const loadLocalStorage = () => {
  const size = localStorage.length;
  const cart = document.querySelector('.cart__items');
  // para cada key do local storage, cria uma li e adiciona ela no carrinho
  for (let i = 0; i < size; i += 1) {
    const item = document.createElement('li');
    item.className = 'cart__item';
    item.innerText = localStorage.key(i);
    item.addEventListener('click', cartItemClickListener);
    cart.appendChild(item);
  }
};

// função do botão esvaziar carrinho
function emptyCart() {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    const cartItems = document.querySelector('.cart__items');
    // remover todos os itens do carrinho
    cartItems.innerHTML = '';
    // remove todos os itens do local storage
    localStorage.clear();
    // atualiza o preço total dos produtos
    addTotalPrice();
  });
}

// função que cria a imagem de um produto
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// função que cria um elemento HTML
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// pega o ID do produto
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// cria o item no carrinho de compras
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // dá ao item a função de remover do carrinho ao clicar nele
  li.addEventListener('click', cartItemClickListener);
  return li;
}

/* função que faz a requisição para a API com informações de um produto pelo seu ID
e adiciona-o ao carrinho */
const fetchAddToCart = (id) => {
  // requisição para a API com as informações de um produto pelo seu ID
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  fetch(endpoint)
    // converte a resposta em javascript
    .then(response => response.json()
      .then((data) => {
        const cartItems = document.querySelector('.cart__items');
        // objeto com ID, nome e preço do produto
        const productCartInfo = {
          sku: data.id,
          name: data.title,
          salePrice: data.price,
        };
        // adiciona as informações do produto que foi adicionado ao carrinho
        const item = createCartItemElement(productCartInfo);
        cartItems.appendChild(item);
        localStorageContent(item.innerText, productCartInfo.salePrice);
        addTotalPrice();
      }),
    );
};

// cria o elemento com as informaçõe do produto (id, nome e imagem)
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  // exibe na página as informações dos produtos
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  // cria o botão e o evento ao clicar no botão 'adicionar ao carrinho!'
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', async (event) => {
    const parentElement = await event.target.parentElement;
    await fetchAddToCart(getSkuFromProductItem(parentElement));
  });
  section.appendChild(button);
  return section;
}

// remove o loading
function removeLoading() {
  const loading = document.querySelector('.loading');
  loading.remove();
}

// função carrega lista de produtos
const loadProductList = () => {
  // faz requisição para a API pelo termo 'computador'
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(endpoint)
    // resposta da API convertida em javascript
    .then(response => response.json())
    // dados dos produtos requisitados (array de produtos)
    .then((data) => {
      const items = document.querySelector('.items');
      // remove o loading quando retonar a resposta da API
      removeLoading();
      /* para cada produto do array, cria um elemento com as informações
      daquele produto (código, nome e imagem)e lança-o como filho da section items */
      data.results.forEach((productInfo) => {
        const { id: sku, title: name, thumbnail: image } = productInfo;
        const product = createProductItemElement({ sku, name, image });
        items.appendChild(product);
      });
    });
};

// funções ao carregar a página
window.onload = async function onload() {
  await loadProductList();
  loadLocalStorage();
  await addTotalPrice();
  emptyCart();
};
