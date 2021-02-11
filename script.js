// function from vanessaberdibi
// https://github.com/tryber/sd-07-project-shopping-cart/blob/vanessa-bidinotto-shopping-cart/script.js
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// function from vanessaberdibi
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// function from vanessaberdibi
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

function sumTotalPrice() {
  let sum = 0;
  document.querySelectorAll('.cart__item').forEach((item) => {
    sum += parseFloat(item.getAttribute('item-price'));
  });
  document.querySelector('.total-price').innerHTML = sum;
}

function cartItemClickListener(event) {
  event.target.parentNode.removeChild(event.target);
  sumTotalPrice();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // next line from vanessaberbidi
  li.setAttribute('item-price', salePrice);
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// fetches enpoint by clicked product id and and appends it to the cart section by
// calling a function that creates the cart items list
// if there's one item in the cart, it creates a paragraph by the end where we will write
// the total price of cart items
function getItemApiById(id) {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  return fetch(endpoint)
  .then(r => r.json())
  .then((item) => {
    const cart = document.querySelector('.cart__items');
    cart.appendChild(createCartItemElement(item));
    sumTotalPrice();
  });
}

function addToCartClickListener() {
  document.querySelectorAll('.item__add').forEach((item) => {
    item.addEventListener('click', ((event) => {
      getItemApiById(event.target.parentNode.firstChild.innerText);
    }));
  });
}

function showOnScreen(array) {
  const items = document.querySelector('.items');
  array.forEach(product => items.appendChild(createProductItemElement(product)));
  addToCartClickListener();
}

function getAPI() {
  document.querySelector('.loading').innerHTML = 'loading...';
  return fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(r => r.json())
  .then((item) => {
    showOnScreen(item.results);
    document.querySelector('.loading').remove();
  });
}

function clearCart() {
  document.querySelector('.cart__items').innerHTML = '';
  sumTotalPrice();
}

function emptyCartButton() {
  const emptyButton = document.querySelector('.empty-cart');
  emptyButton.addEventListener('click', clearCart);
}

window.onload = function onload() {
  getAPI();
  emptyCartButton();
};
