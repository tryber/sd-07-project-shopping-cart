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

const savingList = () => {
  const cartOl = document.querySelector('.cart__items');
  localStorage.setItem('savedOl', cartOl.innerHTML);
};

const sumLabel = () => {
  const cart = document.querySelector('.cart');
  return cart.appendChild(createCustomElement('div', 'label-total', 'Preço Total: $'));
};

const fieldSum = () => {
  const cart = document.querySelector('.cart');
  return cart.appendChild(createCustomElement('div', 'total-price', ''));
};

function sumItems() {
  const totalPrice = document.querySelector('.total-price');
  let sum = 0;
  const itemsList = document.querySelectorAll('li');
  itemsList.forEach((item) => {
    sum += Number(item.innerText.split('$')[1]);
  });
  totalPrice.innerText = sum;
}

const clearCart = () => {
  const clearButton = document.querySelector('.empty-cart');
  const cartOl = document.querySelector('.cart__items');
  clearButton.addEventListener('click', function () {
    cartOl.innerHTML = '';
    sumItems();
    savingList();
  });
};

const loadingMsg = () => {
  const sectionContainer = document.querySelector('.cart');
  sectionContainer.appendChild(createCustomElement('p', 'loading', 'loading...'));
};

const removeLoadingMsg = () => {
  const elementLoadingMsg = document.querySelector('.loading');
  elementLoadingMsg.remove();
};

function cartItemClickListener(event) {
  event.target.remove();
  sumItems();
  savingList();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addingToCart(product) {
  const API_URL = `https://api.mercadolibre.com/items/${product}`;
  loadingMsg();
  const cartOl = document.querySelector('.cart__items');
  fetch(API_URL)
  .then(response => response.json())
  .then((element) => {
    const { id: sku, title: name, price: salePrice } = element;
    cartOl.appendChild(createCartItemElement({ sku, name, salePrice }));
    savingList();
    removeLoadingMsg();
    sumItems();
  });
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
  const addItemButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  addItemButton.addEventListener('click', function (event) {
    const product = event.target.parentNode;
    getSkuFromProductItem(product);
    addingToCart(getSkuFromProductItem(product));
  });
  section.appendChild(addItemButton);
  return section;
}

const generateProducts = () => {
  // Abstração facilitada pelo colega Vitor Rodrigues
  const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  loadingMsg();
  const itemsSection = document.querySelector('.items');
  fetch(API_URL)
  .then(response => response.json())
  .then((item) => {
    item.results.forEach((product) => {
      const { id: sku, title: name, thumbnail: image } = product;
      const eachItem = createProductItemElement({ sku, name, image });
      itemsSection.appendChild(eachItem);
    });
    removeLoadingMsg();
    sumItems();
  });
};

const recoveredList = () => {
  const cartOl = document.querySelector('.cart__items');
  cartOl.innerHTML = localStorage.getItem('savedOl');

  const itemsLi = document.querySelectorAll('li');
  itemsLi.forEach(item => item.addEventListener('click', cartItemClickListener));
};

window.onload = function onload() {
  generateProducts();
  recoveredList();
  sumLabel();
  fieldSum();
  clearCart();
};
