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

function createLoad() {
  const cart = document.querySelector('.cart');
  const load = createCustomElement('p', 'loading', 'loading...');
  cart.appendChild(load);
}

function removeLoad() {
  const getLoad = document.querySelector('.loading');
  getLoad.remove();
}

function setLocalStorage() {
  const cartItems = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('shoppingCart', cartItems);
}

async function addPrices() {
  const totalPrice = document.querySelector('.total-price');
  const cartItems = document.querySelectorAll('.cart__item');
  let sum = 0;
  cartItems.forEach((item) => {
    price = parseFloat(item.innerText.split('$')[1]);
    sum += price;
  });
  totalPrice.innerText = sum;
}

async function cartItemClickListener(event) {
  await event.target.remove();
  setLocalStorage();
  await addPrices();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function productAPI(itemId) {
  const response = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
  const data = await response.json();
  const cartItems = document.querySelector('.cart__items');
  return cartItems.appendChild(createCartItemElement(data));
}

function addProductToCart(event) {
  const getItemId = event.target.parentNode.firstChild.innerText;
  return productAPI(getItemId);
}

async function addAndLoad() {
  await addProductToCart(event);
  setLocalStorage();
  addPrices();
}

function setButtonEvent() {
  const allButtons = document.querySelectorAll('.item__add');
  allButtons.forEach(button => button.addEventListener('click', addAndLoad));
}

function loadProducts(products) {
  const items = document.querySelector('.items');
  products.forEach((product) => {
    items.appendChild(createProductItemElement(product));
  });
}

async function productsAPI() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const data = await response.json();
  removeLoad();
  return loadProducts(data.results);
}

function loadLocalStorage() {
  const cartItems = document.querySelector('.cart__items');
  if (localStorage.shoppingCart) {
    cartItems.innerHTML = localStorage.getItem('shoppingCart');
    cartItems.querySelectorAll('.cart__item').forEach(item => item.addEventListener('click', cartItemClickListener));
  }
}

function removeItens() {
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerHTML = '';
  addPrices();
  localStorage.clear();
}

function clearAll() {
  const clearCart = document.querySelector('.empty-cart');
  clearCart.addEventListener('click', removeItens);
}

window.onload = async function onload() {
  createLoad();
  await productsAPI();
  setButtonEvent();
  loadLocalStorage();
  await addPrices();
  clearAll();
};
