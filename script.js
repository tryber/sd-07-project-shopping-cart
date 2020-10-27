const createLoading = () => {
  const section = document.createElement('section');
  section.classList.add('loading');
  const h1 = document.createElement('h1');
  h1.innerText = 'Loading...';
  h1.classList.add('loading__title');
  section.appendChild(h1);
  return section;
};

const fetchData = async (endpoint) => {
  const loading = createLoading();
  document.body.appendChild(loading);
  const response = await fetch(endpoint);
  const data = await response.json();
  loading.classList.add('loading--over');
  document.body.removeChild(loading);
  return data;
};

const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const createProductItemElement = ({ id: sku, title: name, thumbnail: image }) => {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
};

const getSkuFromProductItem = item => item.querySelector('span.item__sku').innerText;

const updateTotalPrince = async () => {
  const cartList = JSON.parse(localStorage.getItem('cart'));
  const totalPrice = await cartList.reduce((acc, curr) => acc + curr.price, 0);
  document.querySelector('.total-price').innerText = parseFloat(totalPrice.toFixed(2));
};

const updateCart = (callback) => {
  const oldList = JSON.parse(localStorage.getItem('cart'));
  const newList = callback(oldList);
  localStorage.setItem('cart', JSON.stringify(newList));
  updateTotalPrince();
};

const cleanCart = () => {
  document.querySelector('.cart__items').innerHTML = '';
  updateCart(() => []);
};

const cartItemClickListener = async (event) => {
  const cartList = document.querySelector('.cart__items');
  cartList.removeChild(event.target);
  const sku = event.target.innerText.split(' ')[1];
  const item = await fetchData(`https://api.mercadolibre.com/items/${sku}`);
  updateCart(oldList => oldList.filter(listItem => listItem.id !== item.id));
};

const createCartItemElement = ({ id: sku, title: name, price: salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const itemClickListener = async (event) => {
  const cartList = document.querySelector('.cart__items');
  const sku = getSkuFromProductItem(event.target.parentElement);
  const endpoint = `https://api.mercadolibre.com/items/${sku}`;
  try {
    const data = await fetchData(endpoint);
    cartList.appendChild(createCartItemElement(data));
    updateCart((oldList) => {
      oldList.push(data);
      return oldList;
    });
  } catch (error) {
    alert(error);
  }
};

const createItemClickListener = async () => {
  document.querySelectorAll('.item__add').forEach((button) => {
    button.addEventListener('click', itemClickListener);
  });
};

const reloadCart = () => {
  const cartList = document.querySelector('.cart__items');
  const cartListBackup = JSON.parse(localStorage.getItem('cart'));
  cartListBackup.forEach((cartItem) => {
    cartList.appendChild(createCartItemElement(cartItem));
  });
  updateTotalPrince();
};

const initializeCart = () => {
  if (typeof (Storage) !== 'undefined') {
    if (localStorage.getItem('cart') === null) {
      localStorage.setItem('cart', JSON.stringify([]));
    }
    if (JSON.parse(localStorage.getItem('cart')).length !== 0) reloadCart();
  }
};

window.onload = async () => {
  const itemsList = document.querySelector('.items');
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  try {
    const data = await fetchData(endpoint);
    data.results.forEach((item) => {
      itemsList.appendChild(createProductItemElement(item));
    });
  } catch (error) {
    alert(error);
  }

  document.querySelector('.empty-cart').addEventListener('click', cleanCart);
  createItemClickListener();
  initializeCart();
};
