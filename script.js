// vou entregar atrasado mas vai ser 100%

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

let sum = 0;
const emptyCart = () => {
  const list = document.querySelector('.cart__items');
  const buttonClear = document.querySelector('.empty-cart');
  buttonClear.addEventListener('click', () => {
    list.innerHTML = '';
    localStorage.clear();
    const totalPrice = document.querySelector('.total-price');
    totalPrice.innerHTML = 'Preço total: 0 R$';
    sum = 0;
  });
};

const decreasesSum = (event) => {
  const string = event.innerText;
  const positionInitial = string.indexOf('PRICE') + 8;
  const positionFinal = string.length;
  const substring = string.substr(positionInitial, positionFinal);
  const price = parseFloat(substring);

  return price;
};

function cartItemClickListener(event) {
  const price = decreasesSum(event.target);
  sum -= price;
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerHTML = sum;
  event.target.remove();
}

const sumPrices = (price) => {
  const totalPrice = document.querySelector('.total-price');
  sum += price;
  totalPrice.innerHTML = sum;
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  sumPrices(salePrice, true);
  return li;
}

addEventListener('click', (event) => {
  if (event.target.className === 'cart__item') {
    event.target.remove();
    localStorage.clear();
    const listCart = document.querySelector('.cart__items');
    localStorage.setItem('lista', listCart.innerHTML);
  }
});

const AddOnCart = (data) => {
  const listCart = document.querySelector('.cart__items');
  const obj = {};
  obj.sku = data.id;
  obj.name = data.title;
  obj.salePrice = data.price;
  const product = createCartItemElement(obj);
  listCart.appendChild(product);
  localStorage.clear();
  localStorage.setItem('lista', listCart.innerHTML);
};

const fetchItem = (itemID) => {
  const endpoint = `https://api.mercadolibre.com/items/${itemID}`;
  fetch(endpoint)
    .then(response => response.json())
    .then(data => AddOnCart(data));
};

const buttonID = () => {
  const buttonAdd = document.querySelectorAll('.item__add');
  buttonAdd.forEach((element) => {
    element.addEventListener('click', (event) => {
      const id = event.target.parentElement.firstChild.innerText;
      fetchItem(id);
    });
  });
};

const putResults = (data) => {
  const sectionItem = document.querySelector('.items');
  const loading = document.querySelector('.loading');
  loading.remove();
  const obj = {};
  data.forEach((element) => {
    obj.sku = element.id;
    obj.name = element.title;
    obj.image = element.thumbnail;
    const product = createProductItemElement(obj);
    sectionItem.appendChild(product);
  });
};

const fetchProducts = () => {
  const endpoint =
    'https://api.mercadolibre.com/sites/MLB/search?q=$computador';

  fetch(endpoint)
    .then(response => response.json())
    .then(data => putResults(data.results))
    .then(() => buttonID());

  const loading = document.querySelector('.loading');
  loading.innerHTML = 'LOADING ITEMS ...';
};

window.onload = async function onload() {
  emptyCart();
  fetchProducts();
  const listCart = document.querySelector('.cart__items');
  listCart.innerHTML = localStorage.getItem('lista');
};

// Agradecimentos a Arthur Massaini o buddy queijadinha,
// cujo a parte do código aqui dou os creditos e referencio.
