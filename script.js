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

function cartItemClickListener(event) {
  // My code bellow
  const item = event.target;
  let price = item.innerText.split(' ');
  price = price[price.length - 1];
  price = price.split('').filter(c => c !== '$').join('');
  price = parseFloat(price);
  const span = document.querySelector('span.total-price');
  let totalPrice = parseFloat(span.innerText);
  item.parentNode.removeChild(item);
  totalPrice -= price;
  span.innerText = totalPrice;
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// My code bellow ----------------------------------------------------------------------------
function loadingText(param) {
  if (param) {
    const loading = document.createElement('section');
    loading.className = 'loading';
    loading.innerText = 'loading...';
    const container = document.querySelector('.container');
    container.appendChild(loading);
  } else {
    const loading = document.querySelector('.loading');
    loading.parentNode.removeChild(loading);
  }
}

function clearShoppingCartListener() {
  const btnEmptyCart = document.querySelector('.empty-cart');
  btnEmptyCart.addEventListener('click', () => {
    const shoppingCart = document.querySelector('.cart__items');
    const span = document.querySelector('span.total-price');
    shoppingCart.innerHTML = '';
    span.innerText = 0;
  });
}

async function sumCartPrices({ price }) {
  try {
    const span = document.querySelector('span.total-price');
    let totalPrice = parseFloat(span.innerText);
    totalPrice += price;
    span.innerText = totalPrice;
  } catch (error) {
    console.log(error);
  }
}

function cartPlacer(data) {
  const shoppingCart = document.querySelector('.cart__items');
  let item = createCartItemElement(data);
  shoppingCart.appendChild(item);
  item = item.innerHTML;
  sumCartPrices(data);
}

function addToCart(event) {
  loadingText(true);
  const url = 'https://api.mercadolibre.com/items/';
  const parentEvent = event.target.parentNode;
  const sku = getSkuFromProductItem(parentEvent);
  const endpoint = `${url}${sku}`;
  fetch(endpoint)
    .then(response => response.json())
    .then((data) => {
      cartPlacer(data);
      console.log('ok');
      loadingText(false);
    });
}

function storePlacer(data) {
  const store = document.querySelector('.items');
  const items = data.results;
  items.forEach((item) => {
    const product = createProductItemElement(item);
    const btnAddCart = product.querySelector('button');
    btnAddCart.addEventListener('click', addToCart);
    store.appendChild(product);
  });
}

function defaultSearch(term) {
  loadingText(true);
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=';
  const endpoint = `${url}${term}`;
  fetch(endpoint)
    .then(response => response.json())
    .then((data) => {
      storePlacer(data);
      loadingText(false);
    });
}

window.onload = function onload() {
  defaultSearch('COMPUTADOR');
  clearShoppingCartListener();
};
