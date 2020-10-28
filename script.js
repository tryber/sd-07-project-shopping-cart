let totalPrice = 0;

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

function parentCart(element) {
  const parentClass = document.querySelector('.cart__items');
  parentClass.appendChild(element);
}

function retrieveButtonData(button) {
  const itemsDetails = button.parentElement;
  return itemsDetails;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createObjectToCart(data) {
  const response = {
    sku: data.id,
    name: data.title,
    salePrice: data.price,
  };
  return response;
}

function parentPrice(priceSum) {
  const parentClass = document.querySelector('.cart');
  parentClass.append(priceSum);
}

async function removeTotalPrice(sku) {
  const data = await fetch(`https://api.mercadolibre.com/items/${sku}`);
  const jsonPrice = await data.json();
  const price = jsonPrice.price;
  totalPrice -= price;
  const priceTag = document.querySelector('.total-price');
  priceTag.innerText = (totalPrice);
  parentPrice(priceTag);
}

function cartItemClickListener(event) {
  const itemClicked = event.target;
  const sku = itemClicked.id;
  itemClicked.id = 'clicked';
  const itemToRemove = document.querySelector('#clicked');
  removeTotalPrice(sku);
  console.log(totalPrice);
  itemToRemove.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.id = `${sku}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function parentLoad(loadingElement) {
  const parentClass = document.querySelector('.container');
  parentClass.appendChild(loadingElement);
}

function apiLoading() {
  const loadingElement = document.createElement('span');
  loadingElement.className = 'loading';
  loadingElement.innerText = 'loading...';
  parentLoad(loadingElement);
}

function removeLoading() {
  const removeLoad = document.querySelector('.loading');
  removeLoad.remove();
}

function addTotalPrice({ price }) {
  totalPrice += (parseFloat(price) * 100) / 100;
  const priceArray = document.querySelectorAll('.total-price');
  console.log(priceArray);
  if (priceArray.length === 0) {
    const priceTag = document.createElement('span');
    priceTag.className = 'total-price';
    priceTag.innerText = (totalPrice);
    parentPrice(priceTag);
  } else {
    const priceTag = document.querySelector('.total-price');
    priceTag.innerText = (totalPrice);
    parentPrice(priceTag);
  }
}

function sendToCart(sku) {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(data => data.json())
    .then((jsonCart) => {
      addTotalPrice(jsonCart);
      return createObjectToCart(jsonCart);
    })
    .then(dataToCart => createCartItemElement(dataToCart))
    .then(cartFunc => parentCart(cartFunc));
}

function buttonClick(event) {
  const clickedButton = event.target;
  const buttonDetails = retrieveButtonData(clickedButton);
  const buttonSku = getSkuFromProductItem(buttonDetails);
  sendToCart(buttonSku);
}

function parentList(element) {
  const parentClass = document.querySelector('.items');
  parentClass.appendChild(element);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!')).addEventListener('click', buttonClick);

  return parentList(section);
}

function fetchProducts() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((result) => {
      removeLoading();
      return result.json();
    })
    .then(itemsArray => itemsArray.results)
    .then((data) => {
      data.forEach((item) => {
        const object = {
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
        };
        createProductItemElement(object);
      });
    });
}

function clearAll() {
  const cartList = document.querySelector('ol');
  cartList.innerHTML = '';
}

window.onload = function onload() {
  apiLoading();
  fetchProducts();
  const clearAllButton = document.querySelector('.empty-cart');
  clearAllButton.addEventListener('click', clearAll);
};
