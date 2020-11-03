/* eslint no-unused-vars: ["error", { "vars": "local" }]*/
/* global some_unused_var */
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}
function showLoadingDiv() {
  const sectionContainer = document.querySelector('body');
  const loadingDiv = document.createElement('div');
  loadingDiv.classList.add('loading');
  loadingDiv.innerText = 'loading...';
  sectionContainer.appendChild(loadingDiv);
}

function hideLoadingDiv() {
  const loadingDiv = document.querySelector('.loading');
  document.querySelector('body').removeChild(loadingDiv);
}

async function TotalPriceOfCart() {
  const cartFull = document.querySelector('.cart__items');
  const cartItems = cartFull.childNodes;
  let prices = 0;
  if (cartItems.length > 0) {
    cartItems.forEach((item) => {
      prices += parseFloat(item.innerText.split('$')[1]);
    });
  }
  return prices;
}

async function TotalValueOfCartUpdated() {
  const TotalPriceInfCart = await TotalPriceOfCart();
  const totalValueField = document.querySelector('.total-price');
  totalValueField.innerText = TotalPriceInfCart;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function gettingSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
  const cartItemsOl = document.querySelector('.cart__items');
  TotalValueOfCartUpdated();
  localStorage.setItem('cartItems', cartItemsOl.innerHTML);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
async function CartItem(product) {
  // showLoadingDiv();
  const productSku = gettingSkuFromProductItem(product);
  const url = `https://api.mercadolibre.com/items/${productSku}`;
  const response = await fetch(url);
  const infoOfItem = await response.json();
  const cartItem = {
    sku: infoOfItem.id,
    name: infoOfItem.title,
    salePrice: infoOfItem.price,
  };
  // hideLoadingDiv();
  return cartItem;
}
async function addItemToCart(product) {
  const putInCartItem = await CartItem(product);
  const cartItemsOl = document.querySelector('.cart__items');
  const cartItemElement = createCartItemElement(putInCartItem);
  cartItemsOl.appendChild(cartItemElement);
  TotalValueOfCartUpdated();
  localStorage.setItem('cartItems', cartItemsOl.innerHTML);
}

async function RetrievedListOfProducts() {
  showLoadingDiv();
  const endPoint = await fetch(
    'https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const reposnseOfEndPoint = await endPoint.json();
  const productsLists = reposnseOfEndPoint.results;
  hideLoadingDiv();
  return productsLists;
}
async function showRetrievedListOfProducts() {
  const productsRetrieved = await RetrievedListOfProducts();
  const itemsField = document.querySelector('.items');
  productsRetrieved.forEach((element) => {
    const product = {
      sku: element.id,
      name: element.title,
      image: element.thumbnail,
    };
    const productElement = createProductItemElement(product);
    const addToCartButton = productElement.querySelector('.item__add');
    addToCartButton.addEventListener('click', () =>
      addItemToCart(productElement));
    itemsField.appendChild(productElement);
  });
}
function showSetedUpCartItems() {
  SetedUpItems = localStorage.getItem('cartItems');
  if (SetedUpItems) {
    const cartItemsListElements = document.querySelector('.cart__items');
    cartItemsListElements.innerHTML = SetedUpItems;
    cartItemsListElements
      .querySelectorAll('.cart__item')
      .forEach((cartItem) => {
        cartItem.addEventListener('click', cartItemClickListener);
      });
  }
}
function clearCart() {
  const cartItemsField = document.querySelector('.cart__items');
  while (cartItemsField.firstElementChild) {
    cartItemsField.firstElementChild.remove();
    TotalValueOfCartUpdated();
    localStorage.setItem('cartItems', cartItemsField.innerHTML);
  }
}

function listeningClearCart() {
  const emptyCartButton = document.querySelector('.empty-cart');
  emptyCartButton.addEventListener('click', clearCart);
}

window.onload = async function onload() {
  await RetrievedListOfProducts();
  showRetrievedListOfProducts();
  showSetedUpCartItems();
  TotalValueOfCartUpdated();
  listeningClearCart();
};
