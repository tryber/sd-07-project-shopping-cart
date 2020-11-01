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
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// totalCartPrice foi baseada na função calculatePrice do Thiago Pederzolli
// fonte: https://github.com/tryber/sd-07-project-shopping-cart/pull/32/commits/80e23921c8901e1ee94958b47ca1d28df38e3225
const totalCartPrice = async (price, type) => {
  const itemPrice = document.querySelector('.total-price');
  const total = Number(itemPrice.innerText);
  if (type === 'sum') itemPrice.innerText = Number(parseFloat(total + price).toFixed(2));
  if (type === 'sub') itemPrice.innerText = Number(parseFloat(total - price).toFixed(2));
  if (itemPrice.innerText <= 0) itemPrice.innerText = '';
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const saveCart = () => {
  const savedCart = document.querySelector('.cart__items');
  localStorage.setItem('cartItems', savedCart.innerHTML);

  const totalPrice = document.querySelector('.total-price');
  localStorage.setItem('totalPrice', totalPrice.innerText);
};

async function cartItemClickListener(event) {
  const price = +event.target.innerText.slice(-6).replace('$', '');
  totalCartPrice(price, 'sub');
  event.target.remove();
  saveCart();
}
const getProductById = id => `https://api.mercadolibre.com/items/${id}`;

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const localCartItems = () => {
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('cartItems');
  document.querySelector('.total-price').innerText = localStorage.getItem('totalPrice');
  document.querySelectorAll('.cart__item').forEach(item => item.addEventListener('click', cartItemClickListener));
};

const fetchProductItemCart = (item) => {
  fetch(item)
    .then(product => product.json())
    .then(teste =>
      document
        .querySelector('.cart__items')
        .appendChild(createCartItemElement(teste)))
    .then(itemPrice => itemPrice.innerHTML.split('$'))
    .then(price => parseFloat(price[1]))
    .then(number => totalCartPrice(number, 'sum'))
    .then(() => saveCart());
};

const searchProduct = (product, maxResults) =>
  `https://api.mercadolibre.com/sites/MLB/search?q=${product}&limit=${maxResults}`;

const productHandler = (productArray) => {
  const product = Object.entries(productArray);
  product.forEach(entry =>
    document
      .querySelector('.items')
      .appendChild(createProductItemElement(entry[1])));
};

const addToCart = async () =>
  document.querySelectorAll('button.item__add').forEach(button =>
    button.addEventListener('click', () => {
      const id = getSkuFromProductItem(button.parentNode);
      const url = getProductById(id);
      fetchProductItemCart(url);
    }));

const loadingItem = () => {
  const loading = document.createElement('span');
  loading.className = 'loading';
  loading.innerHTML = 'loading';
  document.querySelector('.items').appendChild(loading);
};

const fetchProductsApi = () => {
  const apiUrl = searchProduct('computador', 40);
  loadingItem();
  setTimeout(() => {
    fetch(apiUrl)
    .then(document.querySelector('.items').innerHTML = '')
    .then(product => product.json())
    .then(object => productHandler(object.results))
    .then(() => addToCart());
  }, 300);
};

const emptyCart = () => {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    document.querySelector('.total-price').innerText = '';
    document.querySelectorAll('.cart__item').forEach(item => item.remove());
    saveCart();
  });
};

window.onload = async function onload() {
  fetchProductsApi();
  emptyCart();
  localCartItems();
};
