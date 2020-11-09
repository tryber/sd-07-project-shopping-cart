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

function saveOnStorage() {
  localStorage.clear();
  const cart = document.querySelector('.cart__items');
  localStorage.setItem('cart', cart.innerHTML);
}

async function sumOfProducts() {
  const cart = document.querySelector('.cart__items').childNodes;
  let sum = 0;
  cart.forEach((product) => {
    const value = product.innerText.split('$');
    sum += parseFloat(value[1]);
  });
  const divPrice = document.querySelector('.total-price');
  divPrice.innerText = sum;
}

function cartItemClickListener(event) {
  const cart = document.querySelector('.cart__items');
  cart.removeChild(event.target);
  saveOnStorage();
  sumOfProducts();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addProductToCart(product) {
  const cart = document.querySelector('.cart__items');
  const loading = createCustomElement('p', 'loading', 'loading...');
  cart.appendChild(loading);
  const { id, title, price } = product;
  cart.removeChild(loading);
  cart.appendChild(createCartItemElement({
    name: title,
    salePrice: price,
    sku: id,
  }));
  saveOnStorage();
}

async function fetchById(productId) {
  try {
    const response = await fetch(`https://api.mercadolibre.com/items/${productId}`);
    const product = await response.json();
    return product;
  } catch (error) {
    return window.alert('Product not founded');
  }
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function recoverProduct(e) {
  const productId = getSkuFromProductItem(e.target.parentNode);
  const product = await fetchById(productId);
  addProductToCart(product);
  sumOfProducts();
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', recoverProduct);
  section.appendChild(button);
  return section;
}

function appendElementsToPage(elements) {
  const itemSection = document.querySelector('.items');
  elements.forEach((element) => {
    const { id, title, thumbnail } = element;
    itemSection.appendChild(createProductItemElement({
      sku: id,
      image: thumbnail,
      name: title,
    }));
  });
  sumOfProducts();
}

async function fetchItems(term) {
  try {
    const listOfProduct = document.querySelector('.cart');
    const loading = createCustomElement('p', 'loading', 'loading...');
    listOfProduct.appendChild(loading);
    const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${term}`);
    const items = await response.json().then(data => data.results);
    listOfProduct.removeChild(loading);
    appendElementsToPage(items);
  } catch (error) {
    window.alert(error);
  }
}

function loadProductsFromStorage() {
  const cart = document.querySelector('.cart__items');
  cart.innerHTML = localStorage.getItem('cart');
  sumOfProducts();
}

function clearCart() {
  localStorage.clear();
  const cart = document.querySelector('.cart__items');
  cart.innerHTML = '';
  sumOfProducts();
}

function createEventeButtonClear() {
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', clearCart);
}

window.onload = function onload() {
  loadProductsFromStorage();
  fetchItems('computador');
  createEventeButtonClear();
  sumOfProducts();
};
