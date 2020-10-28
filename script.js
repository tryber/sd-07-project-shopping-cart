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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
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

async function calcTotal() {
  const cartItems = document.querySelectorAll('.cart__item');
  let acc = 0;
  cartItems.forEach((item) => { acc += parseFloat(item.innerHTML.split(' | ')[2].split(' ')[1].replace('$', '')); });
  acc = parseFloat(acc.toFixed(2));
  const total = document.querySelector('.total-price');
  total.innerHTML = `${acc}`;
}

async function cartItemClickListener(event) {
  const cartItem = event.target;
  cartItem.parentElement.removeChild(cartItem);
  const cart = document.querySelector('.cart__items');
  localStorage.setItem('shoppingCart', cart.innerHTML);
  await calcTotal();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function appendItemToCart(object) {
  const cartItem = createCartItemElement(object);
  const cart = document.querySelector('.cart__items');
  cart.appendChild(cartItem);
  localStorage.setItem('shoppingCart', cart.innerHTML);
}

function handleProducts(products) {
  const items = document.querySelector('.items');
  items.innerHTML = '';
  products.forEach((product) => {
    const newItem = createProductItemElement(product);
    items.appendChild(newItem);
  });
}

function showAlert(message) {
  alert(message);
}

async function fetchData(endpoint, callback) {
  try {
    const response = await fetch(endpoint);
    const object = await response.json();

    if (object.error) {
      throw new Error(object.error);
    } else {
      callback(object);
    }
  } catch (error) {
    showAlert(error);
  }
}

async function addToCart(event) {
  const parentElement = event.target.parentElement;
  QUERY = getSkuFromProductItem(parentElement);
  const endpoint = `https://api.mercadolibre.com/items/${QUERY}`;
  await fetchData(endpoint, (object) => {
    appendItemToCart(object);
  });
  await calcTotal();
}


function createAddToCartEventListener() {
  const items = document.querySelectorAll('.item__add');
  items.forEach((button) => {
    button.addEventListener('click', addToCart);
  });
}

function loadLocalCart() {
  const cart = document.querySelector('.cart__items');
  cart.innerHTML = localStorage.getItem('shoppingCart');

  const cartItems = document.querySelectorAll('.cart__item');
  cartItems.forEach(item => item.addEventListener('click', cartItemClickListener));
}

function emptyCart() {
  const cart = document.querySelector('.cart__items');
  cart.innerHTML = '';
  localStorage.setItem('shoppingCart', '');
}

window.onload = async function onload() {
  const QUERY = 'computador';
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`;

  document.querySelector('.items').innerHTML = '<div class="loading">Carregando...</div>';
  await fetchData(endpoint, (object) => {
    handleProducts(object.results);
  });
  createAddToCartEventListener();
  loadLocalCart();
  document.querySelector('.empty-cart').addEventListener('click', emptyCart);
  await calcTotal();
};
