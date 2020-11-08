function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createLoading() {
  const section = document.querySelector('.items');
  const loadingItem = document.createElement('div');
  loadingItem.className = 'loading';
  loadingItem.innerText = 'Loading';
  section.appendChild(loadingItem);
}

function removeLoading() {
  const loadingElement = document.querySelector('.loading');
  loadingElement.remove();
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

async function updatePrice() {
  const array = await JSON.parse(localStorage.getItem('list'));
  let value = 0;
  array.forEach((li) => {
    value += parseFloat(li.split('$')[1]);
  });
  return value;
}

async function updateListPrice() {
  const totalPrice = document.querySelector('.total-price');
  const value = await updatePrice();
  totalPrice.innerHTML = value;
}

function addLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function arrayLocalStorage() {
  const array = [];
  const ol = document.querySelector('.cart__items');
  ol.childNodes.forEach(li => array.push(li.innerText));
  return array;
}

function cartItemClickListener(event) {
  const array = JSON.parse(localStorage.getItem('list'));
  array.forEach((li) => {
    if (event.target.innerText === li) {
      event.target.remove();
      localStorage.clear();
      addLocalStorage('list', arrayLocalStorage());
      updateListPrice();
    }
  });
}

function addLiCartItem(li) {
  const ol = document.querySelector('.cart__items');
  ol.appendChild(li);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  addLiCartItem(li);
  addLocalStorage('list', arrayLocalStorage());
  updateListPrice();
}

function updateListStorage() {
  const array = JSON.parse(localStorage.getItem('list'));
  if (array) {
    array.forEach((info) => {
      const li = document.createElement('li');
      li.className = 'cart__item';
      li.innerText = info;
      li.addEventListener('click', cartItemClickListener);
      addLiCartItem(li);
    });
    updateListPrice();
  }
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function fetchItemFromApi(event) {
  createLoading();
  const itemId = getSkuFromProductItem(event.target.parentNode);
  const endpoint = (`https://api.mercadolibre.com/items/${itemId}`);
  const response = await fetch(endpoint);
  const object = await response.json();
  removeLoading();
  return createCartItemElement(object);
}

function cleanList() {
  const sectionList = document.querySelector('.items');
  sectionList.innerHTML = '';
}

function createProductItemElement({ sku, name, image, salePrice }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('span', 'item__price', `R$ ${salePrice}`));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', fetchItemFromApi);
  section.appendChild(button);
  return section;
}

function iterateProduct(product) {
  const { id: sku, title: name, thumbnail: image, price: salePrice } = product;
  const avalibleProduct = { sku, name, image, salePrice };
  return avalibleProduct;
}

function loadItems(itens) {
  const itensList = itens;
  itensList.forEach((product) => {
    const item = iterateProduct(product);
    const listItens = document.querySelector('.items');
    listItens.appendChild(createProductItemElement(item));
  });
}

async function fetchProductsFromApi(currency = 'computador') {
  createLoading();
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${currency}`;
  const response = await fetch(endpoint);
  const object = await response.json();
  const itens = await object.results;
  removeLoading();
  return loadItems(itens);
}

function handlerSearchEvent() {
  const currency = document.querySelector('#search_item').value;
  cleanList();
  return fetchProductsFromApi(currency);
}

function setupEventHandlers() {
  const searchButton = document.querySelector('.search_button');
  searchButton.addEventListener('click', handlerSearchEvent);
  const input = document.querySelector('#search_item');
  input.addEventListener('keyup', handlerSearchEvent);
}

function clearItems() {
  const ol = document.querySelector('.cart__items');
  const strong = document.querySelector('.total-price');
  ol.innerHTML = '';
  strong.innerHTML = '';
  localStorage.clear();
}

function clearShoppingCar() {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', clearItems);
}

window.onload = function onload() {
  fetchProductsFromApi();
  setupEventHandlers();
  updateListStorage();
  clearShoppingCar();
};
