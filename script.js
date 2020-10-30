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

function createProductItemElement({
  id: sku,
  title: name,
  thumbnail: image,
}) {
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
// 7
function loadingPage() {
  const getContainer = document.querySelector('.container');
  getContainer.appendChild(createCustomElement('p', 'loading', 'Carregando...'));
}

function removeLoadingPage() {
  const getLoading = document.querySelector('.loading');
  getLoading.remove();
}

// 4
function setLStorage() {
  const cartItems = document.querySelector('ol');
  localStorage.setItem('cart', cartItems.innerHTML);
}

function getLStorage() {
  const cartItems = document.querySelector('ol');
  if (localStorage.getItem('cart')) {
    cartItems.innerHTML = localStorage.getItem('cart');
  }
}

// 3
function cartItemClickListener(event) {
  const selectedItemsOl = document.querySelector('.cart__items');
  selectedItemsOl.removeChild(event.target);
  setLStorage();
}
// 6
function clearCart() {
  const selectedButton = document.querySelector('.empty-cart');
  const selectedOl = document.querySelector('.cart__items');
  selectedButton.addEventListener('click', () => {
    selectedOl.innerHTML = '';
  });
}

function createCartItemElement({
  id: sku,
  title: name,
  price: salePrice,
}) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// 1
const fetchCurrency = async () => {
  const list = document.querySelector('.items');
  const endPoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  loadingPage();
  try {
    const response = await fetch(endPoint);
    const object = await response.json();
    object.results.forEach((checkItem) => {
      list.appendChild(createProductItemElement(checkItem));
    });
  } catch (error) {
    alert(error);
  }
  removeLoadingPage();
};

// 2
function createItems(item) {
  const selected = document.querySelector('.cart__items');
  const createItem = createCartItemElement(item);
  selected.appendChild(createItem);
  setLStorage(); // Adição de setLocalStorage com a ajuda de Filipe Nascimento via Slack
}
// 2.1
function searchItems(ItemID) {
  const endPoint = `https://api.mercadolibre.com/items/${ItemID}`;
  loadingPage();
  fetch(endPoint)
    .then(response => response.json())
    .then((item) => {
      createItems(item);
      removeLoadingPage();
    });
} // Ajuste na função realizada com a ajude de Isaac no plantão.

// 2.2
function addItems(event) {
  if (event.target.className === 'item__add') {
    const item = getSkuFromProductItem(event.target.parentElement);
    searchItems(item);
  }
}
// 2.3
function addWithClick() {
  const addClick = document.querySelector('.items');
  addClick.addEventListener('click', addItems);
}

window.onload = function onload() {
  fetchCurrency();
  addWithClick();
  clearCart();
  getLStorage();
};
