function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}
function updateLocalStorage() {
  const cartItemsContainer = document.querySelector('.cart__items');
  localStorage.setItem('cartItems', cartItemsContainer.innerHTML);
}
async function totalPrice() {
  const totalPriceContainer = document.querySelector('.total-price');
  const totalItemsInCart = document.querySelectorAll('.cart__item');
  let sum = 0;
  for (let index = 0; index < totalItemsInCart.length; index += 1) {
    const price = parseFloat(totalItemsInCart[index].dataset.price, 10);
    sum += price;
  }
  totalPriceContainer.innerText = sum;
}

function cartItemClickListener(event) {
  const cartItemsContainer = document.querySelector('.cart__items');
  cartItemsContainer.removeChild(event.currentTarget);
  totalPrice();
  updateLocalStorage();
}
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  li.dataset.price = salePrice;
  totalPrice();
  return li;
}
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
function fetchingAPIById(itemId) {
  return fetch(`https://api.mercadolibre.com/items/${itemId}`)
    .then(response => response.json());
}
function appendElement(container, callback, elements) {
  return container.appendChild(callback(elements));
}
function addEventButton(element) {
  element.addEventListener('click', () => {
    const itemId = getSkuFromProductItem(event.target.parentElement);
    const cartItemsContainer = document.querySelector('.cart__items');
    const item = fetchingAPIById(itemId);
    item
      .then((data) => {
        const dataElements = { sku: data.id, name: data.title, salePrice: data.price };
        appendElement(cartItemsContainer, createCartItemElement, dataElements);
        totalPrice();
        updateLocalStorage();
      });
  });
}
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') addEventButton(e);
  return e;
}
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}
function listingProducts() {
  const productsContainer = document.querySelector('.items');
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
  .then(data => data.results.forEach((product) => {
    const productElements = { sku: product.id, name: product.title, image: product.thumbnail };
    productsContainer
    .appendChild(
      createProductItemElement(productElements),
      );
  }));
}
function loadLocalStorage() {
  const cartItemsContainer = document.querySelector('.cart__items');
  cartItemsContainer.innerHTML = localStorage.getItem('cartItems');
  const cartItens = document.getElementsByClassName('cart__item');
  for (let index = 0; index < cartItens.length; index += 1) {
    cartItens[index].addEventListener('click', cartItemClickListener);
  }
}

function emptyCart() {
  document.querySelector('.cart__items').innerHTML = '';
  const totalPriceContainer = document.querySelector('.total-price');
  totalPriceContainer.innerText = 0;
  localStorage.clear();
}

window.onload = function onload() {
  loadLocalStorage();
  document.querySelector('.empty-cart').addEventListener('click', emptyCart);
  listingProducts();
};
