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

const createLoading = () => {
  const loading = document.querySelector('.items');
  loading.appendChild(createCustomElement('span', 'loading', 'loading...'));
};

const removeLoading = () => {
  // const items = document.querySelector('.items');
  const loading = document.querySelector('.loading');
  // items.removeChild(loading);
  loading.remove();
};

const createLoadingCart = () => {
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(createCustomElement('li', 'loading', 'loading...'));
};
// Conforme ajuda do colega Rafael Guimarães.

const removeLoadingCart = () => {
  // const items = document.querySelector('.items');
  const loading = document.querySelector('.loading');
  // items.removeChild(loading);
  loading.remove();
};

const sumPrices = async () => {
  const itemsCart = document.querySelectorAll('.cart__item');
  let sum = 0;
  await itemsCart.forEach((li) => {
    sum += parseFloat(li.innerText.split('$')[1]);
  });
  document.querySelector('.total-price').innerText = sum;
};

const emptyCart = () => {
  const buttonEmptyCart = document.querySelector('.empty-cart');
  buttonEmptyCart.addEventListener('click', function () {
    document.querySelector('.cart__items').innerHTML = '';
    sumPrices();
    localStorage.removeItem('products');
  });
};

const saveLocalStorage = () => {
  const lis = document.querySelectorAll('.cart__item');
  const array = [];
  for (let i = 0; i < lis.length; i += 1) {
    array.push(lis[i].innerText);
  }
  localStorage.setItem('products', JSON.stringify(array));
};

function cartItemClickListener(event) {
  event.target.remove();
  saveLocalStorage();
  sumPrices();
}

const loadLocalStorage = () => {
  const array = JSON.parse(localStorage.getItem('products'));
  const ol = document.querySelector('.cart__items');
  if (array) {
    array.forEach((cartText) => {
      const li = document.createElement('li');
      li.className = 'cart__item';
      li.innerText = cartText;
      li.addEventListener('click', cartItemClickListener);
      ol.appendChild(li);
    });
  }
};
// Feito pelo colega Rafael Guimarães.

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
// Conforme orientado pelo colega Tiago Esdra.
const fetchAddItemCart = async (sku) => {
  const endpoint = `https://api.mercadolibre.com/items/${sku}`;
  createLoadingCart();
  const response = await fetch(endpoint);
  const object = await response.json();
  const ol = document.querySelector('.cart__items');
  ol.appendChild(createCartItemElement(object));
  saveLocalStorage();
  sumPrices();
  removeLoadingCart();
  // Feito por Vitor.
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );
  button.addEventListener('click', async function (event) {
    const parentElement = await event.target.parentElement;
    await fetchAddItemCart(getSkuFromProductItem(parentElement));
  });
  section.appendChild(button);
  return section;
}

const fetchComputer = () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=$computer';
  createLoading();
  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      const items = document.querySelector('.items');
      object.results.forEach((product) => {
        const item = createProductItemElement(product);
        items.appendChild(item);
      });
      removeLoading();
    });
// Conforme ajuda do colega Vitor Rodrigues.
};

window.onload = function onload() {
  fetchComputer();
  emptyCart();
  loadLocalStorage();
  sumPrices();
};
