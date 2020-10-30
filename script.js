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

function saveLocalStorage() {
  const searchOl = document.querySelector('.cart__items').outerHTML;
  localStorage.setItem('cart', searchOl);
}

async function sumPrice() {
  let sum = 0;
  const itemsPrice = document.querySelectorAll('.cart__item');
  const showPrice = document.querySelector('.total-price');
  itemsPrice.forEach((item) => {
    sum += parseFloat(item.innerText.split('$')[1]); // http://devfuria.com.br/javascript/split/
  });
  showPrice.innerText = sum;
  return showPrice;
}

function cartItemClickListener(event) {
  event.target.remove(); // https://www.w3schools.com/jsref/met_element_remove.asp
  saveLocalStorage();
  sumPrice();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  sumPrice(salePrice);
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText; // retorna o id do produto
}

async function showItemCart(id) {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  await fetch(endpoint)
  .then(response => response.json())
  .then((object) => {
    document.querySelector('ol').appendChild(createCartItemElement(object));
    saveLocalStorage(); // chamar função após resposta
    sumPrice();
  });
}

function clickButton() {
  const selectedItems = document.querySelectorAll('button.item__add');
  selectedItems.forEach(item => item.addEventListener('click', () => {
    showItemCart(getSkuFromProductItem(item.parentElement));
  }));
}

function showProductList(array) {
  document.querySelector('.loading').remove();
  const items = Object.entries(array);
  items.forEach(entry => document.querySelector('.items').appendChild(createProductItemElement(entry[1])));
}

async function productList() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  await fetch(endpoint)
    .then(response => response.json())
    .then(object => showProductList(object.results))
    .then(object => clickButton(object));
}

function cleanCart() {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    document.querySelector('.cart__items').innerText = '';
    saveLocalStorage();
    sumPrice();
  });
}

function loadLocalStorage() {
  if (localStorage.getItem('cart') !== null) {
    const searchOl = document.querySelector('.cart__items');
    searchOl.outerHTML = localStorage.getItem('cart');
    const searchItems = document.querySelectorAll('.cart__item');
    searchItems.forEach(item => item.addEventListener('click', cartItemClickListener));
  }
}


window.onload = function onload() {
  productList();
  cleanCart();
  loadLocalStorage();
  sumPrice();
};
