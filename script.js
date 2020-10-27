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
  const itemsSection = document.querySelector('.items');
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  itemsSection.appendChild(section);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const ol = document.querySelector('.cart__items');
  event.target.remove();
  localStorage.setItem('carrinho', ol.innerHTML);
}

function createCartItemElement({ sku, name, salePrice }) {
  const ol = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  ol.appendChild(li);
  localStorage.setItem('carrinho', ol.innerHTML);
  return li;
}

function createLoad() {
  const loadingCreated = createCustomElement('div', 'loading', '');
  const h1 = createCustomElement('h1', 'load', 'loading...');
  loadingCreated.appendChild(h1);

  return document.body.appendChild(loadingCreated);
}

function loadAPI(loaded = false) {
  const loading = document.querySelector('.loading');
  if (loaded === true) return loading.remove();

  return createLoad();
}

async function fetchData(endpoint, repeat = true) {
  loadAPI();
  const end = await fetch(endpoint);
  const response = await end.json();
  const obj = await response;
  const products = await obj.results;

  if (repeat) {
    products.forEach((product) => {
      const { id, title, thumbnail } = product;
      createProductItemElement({ sku: id, name: title, image: thumbnail });
    });
  } else {
    createCartItemElement({ sku: obj.id, name: obj.title, salePrice: obj.price });
  }
  loadAPI(true);
}

function getProductsFromApi(newProduct, maxQt = 4) {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${newProduct}&limit=${maxQt}`;
  fetchData(endpoint);
}

function getInfosByID(id) {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  fetchData(endpoint, false);
}

function clickEvents() {
  const itemsSection = document.querySelector('.items');
  const emptyCart = document.querySelector('.empty-cart');

  itemsSection.addEventListener('click', (e) => {
    if (e.target.classList.contains('item__add')) {
      const idProductSection = getSkuFromProductItem(e.target.parentNode);
      getInfosByID(idProductSection);
    }
  });

  emptyCart.addEventListener('click', () => {
    const ol = document.querySelector('.cart__items');
    ol.innerHTML = '';
    localStorage.setItem('carrinho', ol.innerHTML);
  });
}

window.onload = function onload() {
  getProductsFromApi('computador');
  clickEvents();

  if (localStorage.getItem('carrinho') !== null) {
    const ol = document.querySelector('.cart__items');
    ol.innerHTML = localStorage.getItem('carrinho');

    const list = document.querySelectorAll('.cart__item');
    list.forEach(li => li.addEventListener('click', cartItemClickListener));
  }
};
