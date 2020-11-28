const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';

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

function sum() {
  const storageValue = localStorage.getItem('cartItems');
  let separator = [];

  if (storageValue != null && storageValue !== '') {
    separator = storageValue.split('</li>');
  }

  let sumItens = 0;
  separator.forEach((element) => {
    if (element !== '') {
      const separatorPrice = parseFloat(element.split('$')[1]);
      sumItens += separatorPrice;
    }
  });
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerHTML = sumItens;
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

function saveOnLocalStorage() {
  const itemsOnCart = document.querySelector('.cart__items');
  localStorage.cartItems = itemsOnCart.innerHTML;
  sum();
}

function cartItemClickListener(event) {
  const cartItem = event.currentTarget;
  const cart = document.querySelector('.cart__items');
  cart.removeChild(cartItem);
  saveOnLocalStorage();
  sum();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  return li;
}

function addToCart(productID) {
  const cart = document.querySelector('.cart__items');

  fetch(`https://api.mercadolibre.com/items/${productID}`)
  .then(response => response.json())
  .then((response) => {
    const productToCart = createCartItemElement(response);
    cart.appendChild(productToCart);
    saveOnLocalStorage();
    sum();
  });
}

function itemToCartEventListener(event) {
  const buttonItem = event.querySelector('.item__add');
  const itemID = getSkuFromProductItem(event);

  buttonItem.addEventListener('click', function () { addToCart(itemID); });
  sum();
}

function loadMessage() {
  const items = document.querySelector('.items');
  const span = document.createElement('span');
  span.className = 'loading';
  span.innerText = 'Loading...';
  items.appendChild(span);
}

function fetchComputers() {
  const section = document.querySelector('.items');
  const message = document.querySelector('.loading');

  fetch(url)
  .then(response => response.json())
  .then(response => response.results)
  .then(arrayOfComputers => arrayOfComputers.forEach((computer) => {
    const product = createProductItemElement(computer);
    itemToCartEventListener(product);
    section.appendChild(product);
  }))
  .finally(() => section.removeChild(message));
}

function cleanCart() {
  const cart = document.querySelector('.cart__items');
  localStorage.cartItems = '';
  cart.innerHTML = '';
  sum();
}

window.onload = function onload() {
  loadMessage();
  fetchComputers();
  sum();
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', cleanCart);

  const valueStorage = localStorage.getItem('cartItems');
  document.querySelector('.cart__items').innerHTML = valueStorage;
};
