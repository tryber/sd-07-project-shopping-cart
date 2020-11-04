function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const saveItens = () => {
  localStorage.setItem('savedCart', document.querySelector('.cart__items').innerHTML);
};

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
  event.target.remove();
  saveItens();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function fetchProducts() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const products = document.querySelector('.items');
  await fetch(endpoint)
  .then(response => response.json())
  .then(infos => infos.results.forEach((item) => {
    products.appendChild(createProductItemElement(item));
  }));
}

function addItensToCart(object) {
  const goToCart = document.querySelector('.cart__items');
  const addTolist = createCartItemElement(object);
  goToCart.appendChild(addTolist);
}

const fetchItensOfCart = async (itemId) => {
  const endpoint = `https://api.mercadolibre.com/items/${itemId}`;
  await fetch(endpoint)
  .then(response => response.json())
  .then(infos => addItensToCart(infos));
  await saveItens();
};

const addItensToList = (event) => {
  if (event.target.className === 'item__add') {
    const itemId = getSkuFromProductItem(event.target.parentElement);
    fetchItensOfCart(itemId);
  }
};

const sectionOfItens = () => {
  const getClick = document.querySelector('.items');
  getClick.addEventListener('click', addItensToList);
};

sectionOfItens();

const emptyCart = () => {
  const getClick = document.querySelector('.empty-cart');
  getClick.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
  });
};

emptyCart();

window.onload = async () => {
  setTimeout(function () {
    fetchProducts();
    const loadingSite = document.querySelector('.loading');
    loadingSite.remove();
  }, 500);
  const getCart = document.querySelector('.cart__items');
  getCart.innerHTML = localStorage.getItem('savedCart');
  document.querySelectorAll('li').forEach(product => product.addEventListener('click', cartItemClickListener));
};
