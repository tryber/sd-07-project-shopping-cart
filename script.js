function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const saveLocalStorage = () => {
  const savedCartList = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('Saved Cart List', savedCartList);
};

function cartItemClickListener(event) {
  const cartSingleItem = event.target;
  cartSingleItem.remove();
  saveLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const fetchCartItemList = (event) => {
  const cartItem = event.target.parentNode; // linha baseada no projeto de NicoleTeisen
  const cartItemId = getSkuFromProductItem(cartItem);
  const cartItemEndpoint = `https://api.mercadolibre.com/items/${cartItemId}`;

  fetch(cartItemEndpoint)
    .then(response => response.json())
    .then((result) => {
      const { id, title, price } = result;
      const cartItemObject = { sku: id, name: title, salePrice: price };
      const cartItemProduct = createCartItemElement(cartItemObject);
      const cartItemList = document.querySelector('.cart__items');
      cartItemList.appendChild(cartItemProduct);
      saveLocalStorage();
    });
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') { // linha baseada no projeto de NicoleTeisen
    e.addEventListener('click', fetchCartItemList);
  }
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

const renderProductList = (singleProduct) => {
  const { id: sku, title: name, thumbnail: image } = singleProduct;
  const finalProduct = createProductItemElement({ sku, name, image });
  const productsList = document.querySelector('.items');

  productsList.appendChild(finalProduct);
};

const transformProductsList = (productsArray) => {
  const products = productsArray;
  const loading = document.querySelector('.loading');
  const listLoading = document.querySelector('.items');
  listLoading.removeChild(loading);
  products.forEach(product => renderProductList(product));
};

const loadingMessage = () => {
  const emptyProductsList = document.querySelector('.items');
  const loadingMessageText = document.createElement('p');
  loadingMessageText.className = 'loading';
  loadingMessageText.innerText = 'loading...';

  emptyProductsList.appendChild(loadingMessageText);
};

const fetchProductList = (product) => {
  const productEndpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;

  fetch(productEndpoint)
    .then(loadingMessage())
    .then(response => response.json())
    .then(array => transformProductsList(array.results));
};

const clearCart = () => {
  const allCartList = document.querySelector('.cart__items');
  allCartList.innerHTML = '';
  saveLocalStorage();
};

const recoverLocalStorage = () => {
  const cartProductsList = document.querySelector('.cart__items');
  cartProductsList.innerHTML = localStorage.getItem('Saved Cart List');

  const cartProduct = cartProductsList.querySelectorAll('li');
  cartProduct.forEach(item => item.addEventListener('click', cartItemClickListener));
};

window.onload = () => {
  fetchProductList('computador');
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', clearCart);
  recoverLocalStorage();
};
