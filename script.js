function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createLoadingElement() {
  const loading = document.createElement('p');
  loading.className = 'loading';
  loading.innerText = 'loading...';
  return loading;
}

function createPriceElement(value) {
  const totalPrice = document.querySelector('.total-price');
  const span = document.createElement('span');
  totalPrice.innerHTML = '';
  span.innerHTML = `${value}`;
  totalPrice.appendChild(span);
  return totalPrice;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const transformCartItemOnObject = (cartItem) => {
  const sku = /^SKU:\s(.*?)\s| /g.exec(cartItem.innerText)[1];
  const name = /NAME:\s(.*)(?=\s\|)/g.exec(cartItem.innerText)[1];
  const salePrice = /PRICE:\s\$(\d+(\.\d{1,2})*)$/g.exec(cartItem.innerText)[1];
  return { sku, name, salePrice };
};

const getCartItemsObjectList = () => {
  const cartItemsList = document.querySelectorAll('.cart__item');
  const cartItemsObjectList = [];
  if (cartItemsList.length > 0) {
    cartItemsList.forEach((cartItem) => {
      cartItemsObjectList.push(transformCartItemOnObject(cartItem));
    });
  }
  return cartItemsObjectList;
};

const sumCartItemsList = () => {
  let sum = 0;
  const cartItemsObjectList = getCartItemsObjectList();
  if (cartItemsObjectList.length > 0) {
    sum = cartItemsObjectList
      .reduce((acc, cartItem) => (acc + parseFloat(cartItem.salePrice)), 0);
  }
  return createPriceElement(sum);
};

const updateCartItemsListLocalStorage = () => {
  localStorage.setItem('cartItemsList', JSON.stringify(getCartItemsObjectList()));
};

function cartItemClickListener(event) {
  const cartItems = document.querySelector('.cart__items');
  cartItems.removeChild(event.target);
  updateCartItemsListLocalStorage();
  sumCartItemsList();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const showAlert = (message) => {
  window.alert(message);
};

const fetchAsyncEndPoint = async (endPoint) => {
  let objectResult;
  try {
    const response = await fetch(endPoint);
    objectResult = await response.json();
  } catch (error) {
    showAlert(error);
  }
  return objectResult;
};

const addProductItemToCartItemsList = ({ sku, name, salePrice }, isLoad = false) => {
  const productLi = createCartItemElement({ sku, name, salePrice });
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(productLi);
  if (!isLoad) updateCartItemsListLocalStorage();
  sumCartItemsList();
};

const productItemClickListener = async (event) => {
  const productId = getSkuFromProductItem(event.target.parentNode);
  const API_URL_ML_SEARCH_ITEM = `https://api.mercadolibre.com/items/${productId}`;
  try {
    const cartItems = document.querySelector('.cart__items');
    const loading = createLoadingElement();
    cartItems.appendChild(loading);

    const productItem = await fetchAsyncEndPoint(API_URL_ML_SEARCH_ITEM);

    cartItems.removeChild(loading);

    const { id: sku, title: name, price: salePrice } = productItem;
    addProductItemToCartItemsList({ sku, name, salePrice });
  } catch (error) {
    showAlert(error);
  }
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') e.addEventListener('click', productItemClickListener);
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

const fillProductListByTerm = async (term) => {
  try {
    const API_URL_ML_SEARCH = `https://api.mercadolibre.com/sites/MLB/search?q=${term}`;
    const sectionItems = document.querySelector('.items');
    const loading = createLoadingElement();
    sectionItems.appendChild(loading);
    const { results } = await fetchAsyncEndPoint(API_URL_ML_SEARCH);
    sectionItems.removeChild(loading);
    results
      .forEach(({ id: sku, title: name, thumbnail: image }) =>
        sectionItems.appendChild(createProductItemElement({ sku, name, image })));
  } catch (error) {
    showAlert(error);
  }
};

const loadCartItemsListFromLocalStorage = () => {
  const cartItemsList = JSON.parse(localStorage.getItem('cartItemsList'));
  if (cartItemsList) {
    cartItemsList
      .forEach(({ sku, name, salePrice }) =>
        addProductItemToCartItemsList({ sku, name, salePrice }, true));
  }
};

const emptyCartItemsList = () => {
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerHTML = '';
  updateCartItemsListLocalStorage();
  sumCartItemsList();
};

const setupEventHandlers = () => {
  const deleteButton = document.querySelector('.empty-cart');
  deleteButton.addEventListener('click', emptyCartItemsList);
};

window.onload = function onload() {
  const SEARCH_TERM = 'computador';
  setupEventHandlers();
  fillProductListByTerm(SEARCH_TERM);
  loadCartItemsListFromLocalStorage();
  sumCartItemsList();
};
