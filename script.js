const API_ALL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const API_GET_ITEM = 'https://api.mercadolibre.com/items/';

const fetchData = async () => fetch(API_ALL).then(res => res.json());
const fetchItem = async item => fetch(`${API_GET_ITEM}${item}`).then(res => res.json());

const onLoading = () => {
  const loadText = document.createElement('h3');
  loadText.className = 'loading';
  loadText.textContent = 'Carregando os dados...';

  const section = document.querySelector('.items');
  section.insertAdjacentElement('afterbegin', loadText);
};

const onFinish = () => {
  document.querySelector('.loading').remove();
};

const emptyCart = () => {
  localStorage.clear();
  document.querySelector('.cart__items').innerHTML = '';
  document.querySelector('.total-price').textContent = '';
};

const updateTotal = (price, operation) => {
  const span = document.querySelector('.total-price');
  const total = Number(parseFloat(span.textContent).toFixed(2)) || 0;
  if (operation === 'somar') span.textContent = `${total + parseFloat(price.toFixed(2))}`;
  if (operation === 'subtrair') span.textContent = `${total - parseFloat(price.toFixed(2))}`;
};

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

function cartItemClickListener(event) {
  const sku = event.target.textContent.split(' ')[1];

  const { salePrice } = JSON.parse(localStorage.getItem(sku));
  updateTotal(salePrice, 'subtrair');

  localStorage.removeItem(sku);
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getCart = () => {
  const values = Object.values(localStorage);
  values.forEach((value) => {
    const { sku, name, salePrice } = JSON.parse(value);
    const createdItem = createCartItemElement({ sku, name, salePrice });
    const section = document.querySelector('.cart__items');
    section.appendChild(createdItem);
    updateTotal(salePrice, 'somar');
  });
};

const addItemToCart = async (event) => {
  if (event.target.className === 'item__add') {
    const sku = getSkuFromProductItem(event.currentTarget);
    const { id, title, price } = await fetchItem(sku);
    const item = { sku: id, name: title, salePrice: price };
    const createdItem = createCartItemElement(item);
    const section = document.querySelector('.cart__items');

    section.appendChild(createdItem);
    localStorage.setItem(sku, JSON.stringify(item));
    updateTotal(price, 'somar');
  }
};

const addButtonEventListener = () => {
  const buttonEmpty = document.querySelector('.empty-cart');
  buttonEmpty.addEventListener('click', emptyCart);

  const listItems = document.querySelectorAll('.item');
  listItems.forEach(li => li.addEventListener('click', event => addItemToCart(event)));
};

const createPage = async () => {
  onLoading();
  const data = await fetchData();
  onFinish();

  data.results.forEach(({ id, title, thumbnail }) => {
    const section = document.querySelector('.items');
    const item = { sku: id, name: title, image: thumbnail };
    const createdItem = createProductItemElement(item);

    section.insertAdjacentElement('beforeend', createdItem);
  });
};

window.onload = async function onload() {
  await createPage();
  getCart();
  addButtonEventListener();
};
