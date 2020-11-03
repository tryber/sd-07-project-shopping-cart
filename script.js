
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const pickPriceInString = (item) => {
  const itemElement = item.innerHTML.split(' ');
  const itemSplit = itemElement[itemElement.length - 1].split('');
  itemSplit.splice(0, 1);
  const itemPrice = itemSplit.join('');
  return parseInt(itemPrice * 100, 10);
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

const storageList = () => {
  localStorage.clear();
  const cartItems = document.querySelectorAll('.cart__item');
  cartItems.forEach((element, indexer) => {
    localStorage.setItem(indexer, element.outerHTML);
  });
};
const verifiedLoading = (loading) => {
  if (loading) {
    const cart = document.querySelector('.cart');
    const priceSection = document.createElement('section');
    priceSection.className = 'loading';
    priceSection.innerHTML = 'loading...';
    cart.appendChild(priceSection);
  } else {
    document.querySelector('.loading').remove();
  }
};

function createProductItemElement({ sku, name, image }) {
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

function cartItemClickListener(event) {
  const item = event.currentTarget;
  const priceSection = document.querySelector('.total-price');
  priceSection.innerHTML -= pickPriceInString(item) / 100;
  priceSection.innerHTML = Math.round(priceSection.innerHTML * 1000);
  priceSection.innerHTML /= 1000;
  event.currentTarget.remove();
  storageList();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const totalPrice = async () => {
  const priceSection = document.querySelector('.total-price');
  const list = document.querySelector('ol.cart__items');
  const listPrice = list.querySelectorAll('.cart__item');
  let totalresult = 0;
  await listPrice.forEach((item) => {
    totalresult += pickPriceInString(item);
  });
  priceSection.innerHTML = totalresult / 100;
};

const removeAll = () => {
  const priceSection = document.querySelector('.total-price');
  const listCart = document.querySelector('ol.cart__items');
  priceSection.innerHTML = 0;
  localStorage.clear();
  while (listCart.lastChild) listCart.removeChild(listCart.lastChild);
};

const returnObject = async (url) => {
  let loading = true;
  verifiedLoading(loading);
  const result = await fetch(url).then(itemResult =>
    itemResult.json().then(jsonResult => jsonResult));
  loading = false;
  await verifiedLoading(loading);
  return result;
};

const pickStorageItems = () => {
  const cart = document.querySelector('.cart__items');
  for (let index = 0; index < localStorage.length; index += 1) {
    cart.innerHTML += localStorage.getItem(index);
  }
};

const getItemID = async (ID) => {
  const sectionItem = ID.currentTarget.parentElement;
  const target = getSkuFromProductItem(sectionItem);
  const object = await returnObject(`https://api.mercadolibre.com/items/${target}`);
  const cartItems = document.querySelector('.cart__items');
  const { id, title, price } = object;
  const obj = { sku: id, name: title, salePrice: price };
  await cartItems.appendChild(createCartItemElement(obj));
  totalPrice();
  storageList();
};

const addEvents = (itemClass, func) => {
  const item = document.querySelectorAll(`.${itemClass}`);
  item.forEach(element => element.addEventListener('click', func));
};

const getItemsAPI = async () => {
  const emptyCart = document.querySelector('.empty-cart');
  emptyCart.addEventListener('click', removeAll);
  const object = await returnObject('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  object.results.forEach((product) => {
    const items = document.querySelector('.items');
    const { id, thumbnail, title } = product;
    const obj = { sku: id, image: thumbnail, name: title };
    items.appendChild(createProductItemElement(obj));
  });
  addEvents('item__add', getItemID);
};
window.onload = async function onload() {
  await pickStorageItems();
  getItemsAPI();
  totalPrice();
  addEvents('cart__item', cartItemClickListener);
};
