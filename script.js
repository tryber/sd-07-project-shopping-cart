function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

async function queryProductPrice(sku) {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    const results = data.results;
    const product = results.find(result => result.id === sku);
    return product.price;
  } catch (error) {
    window.alert(error);
  }
  return null;
}

async function updateTotalPrice() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    const results = data.results;
    const cartItems = document.querySelectorAll('.cart__item');
    const cartIds = Array.from(cartItems).map(item => item.id);
    const totalPrice = await cartIds.map(id =>
      results.find(result => result.id === id)).map(product =>
      product.price).reduce((acc, curr) => acc + curr, 0);
    const totalPriceDiv = document.querySelector('.total-price');
    totalPriceDiv.innerHTML = totalPrice;
  } catch (error) {
    window.alert(error);
  }
  return null;
}


async function saveCart() {
  const cart = await document.querySelector('.cart__items');
  localStorage.setItem('cart__items', cart.innerHTML);
}

function cartItemClickListener(event) {
  event.target.remove();
  updateTotalPrice();
  saveCart();
}

function loadCart() {
  if (localStorage.length > 0) {
    const cart = document.querySelector('.cart__items');
    const items = localStorage.getItem('cart__items');
    cart.innerHTML = items;
    const cartItems = document.querySelectorAll('.cart__items li');
    cartItems.forEach((item) => {
      item.addEventListener('click', cartItemClickListener);
    });
  }
  return null;
}

const appendItems = (item, parentSelector) => {
  const parentElement = document.querySelector(`${parentSelector}`);
  parentElement.appendChild(item);
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function getNameFromProductItem(item) {
  return item.querySelector('span.item__title').innerText;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.id = sku;
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function populateCart() {
  document.addEventListener('click', async function (event) {
    if (event.target.classList.contains('item__add')) {
      const item = event.target.parentElement;
      const sku = getSkuFromProductItem(item);
      const name = getNameFromProductItem(item);
      const salePrice = await queryProductPrice(sku);
      const cartItem = createCartItemElement({ sku, name, salePrice });
      appendItems(cartItem, '.cart__items');
      updateTotalPrice();
      saveCart();
    }
    return null;
  });
}

const createLoadingElement = (parentSelector) => {
  const loadingElement = createCustomElement('h1', 'loading', 'loading...');
  appendItems(loadingElement, `${parentSelector}`);
};

const removeLoadingElement = () => {
  const loadingElement = document.querySelector('.loading');
  loadingElement.remove();
};

const clearCart = () => {
  const cart = document.querySelector('.cart__items');
  cart.innerHTML = '';
  updateTotalPrice();
  localStorage.clear();
};

const queryComputersInMlApi = async () => {
  createLoadingElement('.container .items');
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    const results = data.results;
    removeLoadingElement();
    results.forEach((result) => {
      const { id, title, thumbnail } = result;
      const product = {
        sku: id,
        name: title,
        image: thumbnail,
      };
      const item = createProductItemElement(product);
      appendItems(item, '.container .items');
      updateTotalPrice();
    });
  } catch (error) {
    window.alert(error);
  }
};

window.onload = function onload() {
  queryComputersInMlApi();
  populateCart();
  loadCart();
  const btnClearCart = document.querySelector('.empty-cart');
  btnClearCart.addEventListener('click', clearCart);
};
