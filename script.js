function saveToLocalStorage() {
  const cart = document.querySelector('.cart__items');
  localStorage.setItem('cartItems', cart.innerHTML);
}

function cartItemClickListener(event) {
  event.target.remove();
  saveToLocalStorage();
}

function loadFromLocalStorage() {
  const cart = document.querySelector('.cart__items');
  cart.innerHTML = localStorage.getItem('cartItems');
  const items = document.getElementsByClassName('cart__item');
  for (let index = 0; index < items.length; index += 1) {
    items[index].addEventListener('click', cartItemClickListener);
  }
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

async function fetchProductsFromApi() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const response = await fetch(endpoint);
  const object = await response.json();
  return object.results;
}

async function fetchItemForCart(itemID) {
  const endpoint = `https://api.mercadolibre.com/items/${itemID}`;
  const response = await fetch(endpoint);
  const object = await response.json();
  return object;
}

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

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  li.dataset.sku = sku;
  li.dataset.salePrice = salePrice;
  return li;
}

function handleProduct(product) {
  const { id: sku, title: name, thumbnail: image, price: salePrice } = product;
  const handledProduct = { sku, name, image, salePrice };
  return handledProduct;
}

async function addToCart() {
  const itemID = this.closest('.item').dataset.sku;
  const item = await fetchItemForCart(itemID);
  const handledItem = handleProduct(item);
  const cart = document.querySelector('.cart__items');
  cart.appendChild(createCartItemElement(handledItem));
  saveToLocalStorage();
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', addToCart);
  section.dataset.sku = sku;
  return section;
}

async function loadItems() {
  const fetchedProducts = await fetchProductsFromApi();
  fetchedProducts.forEach((product) => {
    const item = handleProduct(product);
    const listOfItems = document.querySelector('.items');
    listOfItems.appendChild(createProductItemElement(item));
  });
  await document.querySelector('.loading-box').remove();
}

function emptyCart() {
  const cartContent = document.querySelectorAll('.cart__item');
  cartContent.forEach(item => item.remove());
  saveToLocalStorage();
}

const buttonEmpty = document.querySelector('.empty-cart');
buttonEmpty.addEventListener('click', emptyCart);

window.onload = function onload() {
  loadItems();
  loadFromLocalStorage();
};
