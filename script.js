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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function calculatePrice(price, type) {
  const priceInput = document.querySelector('.total-price');
  const total = Number(priceInput.innerText);
  if (type === 'add') priceInput.innerText = (total + Number(parseFloat(price.toFixed(2))));
  if (type === 'remove') priceInput.innerText = (total - Number(parseFloat(price.toFixed(2))));
}

function clearList() {
  const olList = document.querySelector('.cart__items');
  const itensList = document.querySelectorAll('.cart__item');
  for (let i = 0; i < itensList.length; i += 1) {
    const removedItem = itensList[i];
    olList.removeChild(removedItem);
  }
}

function updateStorage() {
  const olContent = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('content', JSON.stringify(olContent));
}

async function cartItemClickListener(event) {
  //  coloque seu código aqui
  const price = +event.target.innerText.slice(-6).replace('$', '');
  event.target.remove();
  await calculatePrice(price, 'remove');
  updateStorage();
}

async function fetchCart() {
  const container = document.querySelector('.container');
  const loading = document.querySelector('.loading');
  loading.innerText = 'Carregando';
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(result => result.json())
  .then(json => json.results)
  .then(infos => infos.forEach(({ id, title, thumbnail }) => {
    const section = document.querySelector('.items');
    const information = { sku: id, name: title, image: thumbnail };
    const printElement = createProductItemElement(information);
    section.appendChild(printElement);
  }));
  container.removeChild(loading);
  const newOlContent = document.querySelector('.cart__items');
  const olContent = localStorage.getItem('content');
  const jsonParse = JSON.parse(olContent);
  newOlContent.innerHTML = jsonParse;
  const itensCart = document.querySelectorAll('.cart__item');
  itensCart.forEach(item => item.addEventListener('click', cartItemClickListener));
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addToCart(event) {
  const sku = getSkuFromProductItem(event.currentTarget);
  const cart = document.querySelector('.cart__items');
  const item = fetch(`https://api.mercadolibre.com/items/${sku}`);
  const itemDetails = await (await item).json();
  const { id, title, price } = itemDetails;
  const itemProps = { sku: id, name: title, salePrice: price };
  const addedItem = createCartItemElement(itemProps);
  cart.appendChild(addedItem);
  await calculatePrice(price, 'add');
  updateStorage();
}

function createButtonListener() {
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', clearList);
  const buttonList = document.querySelectorAll('.item');
  buttonList.forEach(button => button.addEventListener('click', event => addToCart(event)));
}

window.onload = async function onload() {
  await fetchCart();
  createButtonListener();
};
