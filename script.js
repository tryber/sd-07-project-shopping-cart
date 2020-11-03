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

const addLoading = () => {
  document.querySelector('.cart__items')
    .appendChild(createCustomElement('h1', 'loading', 'loading...'));
};

const removeLoading = () => {
  document.querySelector('.loading').remove();
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function saveCart() {
  const cart = document.querySelector('.cart__items').outerHTML;
  localStorage.setItem('cart', cart);
}

function cartItemClickListener(event) {
  const cart = document.querySelector('.cart__items');
  cart.removeChild(event.target);
  saveCart();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchCart = (url) => {
  addLoading();
  fetch(url)
    .then(response => response.json())
    .then((product) => {
      document.querySelector('.cart__items').appendChild(createCartItemElement(product));
      removeLoading();
      saveCart();
    });
};

const addToCart = (id) => {
  const url = `https://api.mercadolibre.com/items/${id}`;
  fetchCart(url);
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  button.addEventListener('click', (event) => {
    addToCart(getSkuFromProductItem(event.target.parentNode));
  });
  section.appendChild(button);

  return section;
}

function removeAll() {
  const ol = document.querySelector('ol.cart__items');
  document.querySelectorAll('li.cart__item')
    .forEach(item => ol.removeChild(item));
  localStorage.clear();
}

function cleanCartButton() {
  const btnClean = document.querySelector('.empty-cart');
  btnClean.addEventListener('click', removeAll);
}

function fetchProdutcs() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  addLoading();
  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      const items = Object.entries(object.results);
      items.forEach(entry => document.querySelector('.items').appendChild(createProductItemElement(entry[1])));
      removeLoading();
    });
}

function loadCart() {
  const cart = localStorage.getItem('cart');
  if (cart != null) {
    const ol = document.querySelector('.cart__items');
    ol.outerHTML = cart;
  }
  const oldList = document.querySelectorAll('.cart__item');
  oldList.forEach(li => li.addEventListener('click', cartItemClickListener));
}

window.onload = function onload() {
  fetchProdutcs();
  loadCart();
  cleanCartButton();
};
