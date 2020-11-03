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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function saveItensCartInLocalStorage() {
  const listItensCart = document.querySelector('.cart__items');
  localStorage.setItem('itensCart', listItensCart.outerHTML);
}

const sumValueItemsCart = async () => {
  const itemsInCart = await document.querySelectorAll('.cart__item');
  const total = await document.querySelector('.total-price');
  let actualValue = 0;
  await itemsInCart.forEach(async (sumText) => {
    const captureText = await sumText.innerText;
    const capturaNumber = parseFloat(captureText.substr(-10).replace(/([^\d])+/gim, '.').substr(1));
    actualValue += capturaNumber;
  });
  total.innerText = await actualValue;
};

function cartItemClickListener(event) {
  const olCart = event.target.parentNode;
  olCart.removeChild(this);
  sumValueItemsCart();
  saveItensCartInLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  const itensCart = document.querySelector('.cart__items');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  itensCart.appendChild(li);
  saveItensCartInLocalStorage();
  return li;
}


const productInCart = (product) => {
  const { id: sku, title: name, price: salePrice } = product;
  const itemsCart = document.querySelector('.cart__items');
  const item = createCartItemElement({ sku, name, salePrice });
  itemsCart.appendChild(item);
  saveItensCartInLocalStorage();
  sumValueItemsCart();
};

const loadingDuaringFetch = (loading) => {
  const createH1 = createCustomElement('h1', 'loading', 'loading...');
  const sectionCart = document.querySelector('.cart');

  if (loading) {
    sectionCart.appendChild(createH1);
  } else {
    document.querySelector('.loading').remove();
  }
};

const insertProductInCar = async (event) => {
  const itemSelected = event.target.parentNode;

  let loading = true;
  setTimeout(loadingDuaringFetch(loading), 8000);

  const endpoint = `https://api.mercadolibre.com/items/${getSkuFromProductItem(itemSelected)}`;
  await fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      productInCart(object);
    });

  loading = false;
  setTimeout(loadingDuaringFetch(loading), 8000);
};

const productButtonsToAddToCart = (buttons) => {
  buttons.forEach((item) => {
    item.addEventListener('click', insertProductInCar);
  });
};

const products = (product) => {
  const productsKeys = Object.keys(product);
  const sectionItems = document.querySelector('.items');

  productsKeys.forEach((key) => {
    const { id: sku, title: name, thumbnail: image } = product[key];
    const item = createProductItemElement({ sku, name, image });
    sectionItems.appendChild(item);
  });
  const buttons = document.querySelectorAll('.item__add');
  productButtonsToAddToCart(buttons);
};

const fetchItens = () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      products(object.results);
    });
};

function clear() {
  const buttonClearCart = document.querySelector('.empty-cart');
  buttonClearCart.addEventListener('click', () => {
    const listProductsInCart = document.querySelector('.cart__items');
    listProductsInCart.innerHTML = '';
    saveItensCartInLocalStorage();
    sumValueItemsCart();
  });
}

function loadingItemsCartOfLocalStorage() {
  const itemsCart = document.querySelector('.cart__items');
  const cart = (localStorage.getItem('itensCart'));
  if (cart) {
    itemsCart.outerHTML = cart;
  }
}

window.onload = function onload() {
  fetchItens();
  clear();
  loadingItemsCartOfLocalStorage();
  sumValueItemsCart();
};
