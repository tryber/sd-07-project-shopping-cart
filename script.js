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

const savedLocalStorage = () => {
  const ol = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('productsList', JSON.stringify(ol));
  const totalPrice = document.querySelector('.total-price').innerHTML;
  localStorage.setItem('totalPrice', JSON.stringify(totalPrice));
};

const sumPrices = async () => {
  const listOfLi = document.querySelectorAll('li');
  const arrayOfLi = Array.from(listOfLi);
  const spanTotalPrice = document.querySelector('.total-price');
  const sum = arrayOfLi.reduce((acc, curr) => {
    const value = curr.innerText; // <li>id,...</li>
    const divideLi = value.split('$');
    return acc + Number(divideLi[1]);
  }, 0);
  spanTotalPrice.innerText = sum;
  savedLocalStorage();
};

async function cartItemClickListener(event) {
  document.querySelector('.cart__items').removeChild(event.target);
  await sumPrices();
  savedLocalStorage();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// REQUISITO 2
function getSkuFromProductItem(item) {
  const getId = item.querySelector('span.item__sku').innerText; // retorna string(id)
  const endpoint = `https://api.mercadolibre.com/items/${getId}`;
  fetch(endpoint)
    .then(response => response.json())
    .then(async (data) => {
      // console.log(data)
      document.querySelector('.cart__items').appendChild(createCartItemElement(data));
      await sumPrices();
      savedLocalStorage();
    });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const returnButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  returnButton.addEventListener('click', (event) => {
    getSkuFromProductItem(event.target.parentNode); // buscar o id que é irmão do button
  });
  section.appendChild(returnButton);

  return section;
}

const loadingCartShopping = () => {
  let listOfProducts = localStorage.getItem('productsList');
  listOfProducts = JSON.parse(listOfProducts);
  const ol = document.querySelector('.cart__items');
  ol.innerHTML = listOfProducts;
  const listOfLi = document.querySelectorAll('li');
  listOfLi.forEach(li => li.addEventListener('click', cartItemClickListener));
  let totalPrice = localStorage.getItem('totalPrice');
  totalPrice = JSON.parse(totalPrice);
  const totalPriceOfCart = document.querySelector('.total-price');
  totalPriceOfCart.innerHTML = totalPrice;
};

const emptyCartShopping = () => {
  const button = document.querySelector('.empty-cart');
  const ol = document.querySelector('.cart__items');
  button.addEventListener('click', async () => {
    ol.innerHTML = '';
    await sumPrices();
    savedLocalStorage();
  });
};

const clearMessageLoading = () => {
  const container = document.querySelector('.container');
  const arrayOfChildsContainer = container.children;
  container.removeChild(arrayOfChildsContainer[0]);
};

// REQUISITO 1
const loadProducts = () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(endpoint)
    .then(response => response.json())
    .then((objects) => {
      clearMessageLoading();
      const items = document.querySelector('.items');
      const productDetails = objects.results;
      productDetails.forEach((product) => {
        const { id: sku, title: name, thumbnail: image } = product; // renomeando a chave
        const item = createProductItemElement({ sku, name, image });
        items.appendChild(item);
      });
      loadingCartShopping();
      emptyCartShopping();
    });
};

window.onload = function onload() {
  loadProducts();
};
