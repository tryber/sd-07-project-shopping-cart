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

function emptyCart() {
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerHTML = '';
  localStorage.clear();
}

function clearBtn() {
  const clearCartBtn = document.querySelector('.empty-cart');
  clearCartBtn.addEventListener('click', emptyCart);
}

function loading() {
  const loadContainer = document.querySelector('.container');
  return loadContainer.appendChild(createCustomElement('h3', 'loading', 'loading...'));
}

function removeloading() {
  document.querySelector('.loading').remove();
}

function setLocalStorage() {
  const arr = [];
  const li = document.querySelectorAll('.cart__item');
  li.forEach(item => arr.push(item.innerText));
  localStorage.setItem('carrinho de compras', JSON.stringify(arr));
}

function reloadStorage() {
  const ol = document.querySelector('.cart__items');
  const capturedEle = JSON.parse(localStorage.getItem('carrinho de compras'));
  if (capturedEle) {
    capturedEle.forEach((item) => {
      const li = createCustomElement('li', 'cart__item', item);
      ol.appendChild(li);
    });
  }
}

function cartItemClickListener(event) {
  event.target.remove();
  setLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  li.dataset.salePrice = salePrice;
  return li;
}

const fetchProductList = () => {
  const computadorUrl = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  loading();
  return fetch(computadorUrl)
    .then(response => response.json())
    .then((data) => {
      const items = document.querySelector('.items');
      data.results.forEach((product) => {
        const { id: sku, title: name, thumbnail: image } = product;
        const item = createProductItemElement({ sku, name, image });
        items.appendChild(item);
      });
    })
    .then(removeloading);
};

const addItemInCart = (object) => {
  const olCaptured = document.querySelector('.cart__items');
  const product = {
    sku: object.id,
    name: object.title,
    salePrice: object.price,
  };
  olCaptured.appendChild(createCartItemElement(product));
  setLocalStorage();
};

const fetchShoppCart = (itemId) => {
  loading();
  fetch(`https://api.mercadolibre.com/items/${itemId}`)
  .then(response => response.json())
  .then(object => addItemInCart(object))
  .then(removeloading);
};

const handleEventCart = (event) => {
  const parentBtn = event.target.parentNode;
  const idCaptured = getSkuFromProductItem(parentBtn);
  return fetchShoppCart(idCaptured);
};

const btnCapture = () => {
  const btns = document.querySelectorAll('.item__add');
  btns.forEach((btn) => {
    btn.addEventListener('click', handleEventCart);
  });
};

window.onload = async function onload() {
  await fetchProductList();
  btnCapture();
  clearBtn();
  reloadStorage();
};
