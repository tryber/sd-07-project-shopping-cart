function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function setLocal() {
  const cardItems = document.querySelector('.cart__items');
  // innerHTML TRANSFORMA O OBJETO  EM UM TEXTO.
  localStorage.setItem('items', cardItems.innerHTML);
  const price = document.querySelector('.total-price');
  localStorage.setItem('price', price.innerText);
}

function createLoading() {
  const container = document.querySelector('.container');
  const createLoad = createCustomElement('h1', 'loading', 'loading...');
  return container.appendChild(createLoad);
}

// criando um load para aparecer na requisições
function renderLoad() {
  // criado um variavel para armazenar a class '.loading'
  const loadCaptured = document.querySelector('.loading');
  // verificando e o load retorna alguma coisa.
  if (!loadCaptured) {
    return createLoading();
  }
  // caso se existe o load e retirado
  return loadCaptured.remove();
}

function totalPrice(id, bool = true) {
  renderLoad();
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then(objJson => objJson.json())
    .then((data) => {
      // chamando o valor do elemento
      const capTotalPrice = document.querySelector('.total-price');
      // conveter para numero
      const valuePrice = Number(Number(capTotalPrice.innerText).toFixed(2));
      // convertendo capTotalPrice em javascript
      // e somando o valor do html com o valor do id 'requisicao'
      if (bool) {
        capTotalPrice.innerText = valuePrice + data.price;
      } else {
        capTotalPrice.innerText = valuePrice - data.price;
      }
      renderLoad();
      setLocal();
    });
}

function cartItemClickListener(event) {
  totalPrice(event.target.id, false);
  // recuperando o filho
  const son = event.target;
  // recuperando o pai do filho
  const father = son.parentNode;
  // removendo o filho do pai
  father.removeChild(son);
  setLocal();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = sku;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// pega informaçao do produto do id do carrinho
const addCart = (id) => {
  renderLoad();
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then(objJson => objJson.json())
    .then((data) => {
      const cart = document.querySelector('.cart__items');
      const productCart = {
        sku: id,
        name: data.title,
        salePrice: data.price,
      };
      cart.appendChild(createCartItemElement(productCart));
      totalPrice(id);
      renderLoad();
    });
};

function getLocal() {
  // pega o  item do html
  const cardItems = document.querySelector('.cart__items');
  const total = document.querySelector('.total-price');
  // pegando o item no localStorage
  const localGetItem = localStorage.getItem('items');
  const localGetPrice = localStorage.getItem('price');

  // convertendo em interpretação de javascript
  cardItems.innerHTML = localGetItem;
  total.innerHTML = localGetPrice;

  // pegando o item individual
  const cardItem = document.querySelectorAll('.cart__item');
  cardItem.forEach(li => li.addEventListener('click', cartItemClickListener));
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const buttonCart = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  buttonCart.addEventListener('click', (event) => {
    // pega o pai do elemento
    const elementFather = event.target.parentElement;
    addCart(getSkuFromProductItem(elementFather));
  });
  section.appendChild(buttonCart);
  return section;
}

// criando um variavel com paramento para buscar o endereço do appi e transforma em json
const searchAppi = (element = '$QUERY') => {
  renderLoad();
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${element}&limit=6`)
    .then(objJson => objJson.json())
    .then((data) => {
      const elementSection = document.querySelector('.items');

      data.results.forEach((product) => {
        // renomeando o paramento para do createProductItemElement
        const { id: sku, title: name, thumbnail: image } = product;
        const productAppende = createProductItemElement({ sku, name, image });
        elementSection.appendChild(productAppende);
      });
      renderLoad();
    });
  // const objJson = await endpoint.json();
  // console.log(objJson.results);
  // return objJson.results ;
};

const cleanInput = () => {
  const clearAllButton = document.querySelector('.empty-cart');
  const prices = document.querySelector('.total-price');
  const ol = document.querySelector('.cart__items');
  clearAllButton.addEventListener('click', () => {
    ol.innerHTML = '';
    prices.innerHTML = '0';
    setLocal();
  });
};

window.onload = function onload() {
  searchAppi('computador');
  getLocal();
  cleanInput();
};
