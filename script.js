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
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const clearCart = () => {
  const list = document.querySelector('.cart__items');
  const buttonClear = document.querySelector('.empty-cart');
  buttonClear.addEventListener('click', () => {
    list.innerHTML = '';
    localStorage.clear();

    const totalPrice = document.querySelector('.total-price');
    totalPrice.innerHTML = 0;
  });
};

const returnTotalPrice = () => {
  const items = document.querySelectorAll('.cart__item');
  if (!items) {
    return 0;
  }
  let price = 0;
  let sum = 0;
  items.forEach((element) => {
    const string = element.innerText;
    const positionInitial = string.indexOf('PRICE') + 8;
    const positionFinal = string.length;
    const substring = string.substr(positionInitial, positionFinal);
    price = parseFloat(substring);
    sum += price;
  });

  return sum;
};

function cartItemClickListener(event) {
  event.target.remove();

  const sum = returnTotalPrice();
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerHTML = `${sum}`;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  return li;
}

addEventListener('click', (event) => {
  if (event.target.className === 'cart__item') {
    event.target.remove();

    const listCart = document.querySelector('.cart__items');
    const totalPrice = document.querySelector('.total-price');

    const sum = returnTotalPrice();
    totalPrice.innerHTML = `${sum}`;

    localStorage.clear();
    localStorage.setItem('lista', listCart.innerHTML);
    localStorage.setItem('preco', totalPrice.innerHTML);
  }
});

//-----------------------------------------------------------------------

const putOnCart = (data) => {
  const listCart = document.querySelector('.cart__items');
  const obj = {};
  obj.sku = data.id;
  obj.name = data.title;
  obj.salePrice = data.price;
  const product = createCartItemElement(obj);
  listCart.appendChild(product);

  const sum = returnTotalPrice();
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerHTML = `${sum}`;

  localStorage.clear();
  localStorage.setItem('lista', listCart.innerHTML);
  localStorage.setItem('preco', totalPrice.innerHTML);
};

const fetchItem = (itemID) => {
  const endpoint = `https://api.mercadolibre.com/items/${itemID}`;
  // prettier-ignore
  fetch(endpoint)
    .then(response => response.json())
    .then(data => putOnCart(data));
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

//-----------------------------------------------------------------------

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

const fetchMercado = () => {
  const endpoint =
    'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  // prettier-ignore
  fetch(endpoint)
    .then(response => response.json())
    .then(data => putResults(data.results))
    .then(() => buttonID());

  const loading = document.querySelector('.loading');
  loading.innerHTML = 'LOADING ITEMS...';
};

//-----------------------------------------------------------------------

window.onload = function onload() {
  fetchMercado();
  const listCart = document.querySelector('.cart__items');
  listCart.innerHTML = localStorage.getItem('lista');
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerHTML = localStorage.getItem('preco');
  clearCart();
};
