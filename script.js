const container = document.createElement('div');
const loading = document.createElement('h1');
loading.className = 'loading';
loading.innerText = 'loading...';
const wait = (event) => {
  if (event) {
    document.querySelector('.items').appendChild(container);
    container.appendChild(loading);
  } else {
    loading.remove();
  }
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


const save = () => {
  const cart = document.querySelector('.cart__items');
  localStorage.setItem('products', cart.innerHTML);
};

const load = () => {
  const cart = document.querySelector('.cart__items');
  cart.innerHTML = localStorage.getItem('products');
};

function getSkuFromProductItem(item, index) {
  return item.querySelectorAll('span.item__sku')[index].innerText;
}
const sumPrice = () => {
  let result = 0;
  const listCart = document.querySelectorAll('.cart__item');
  const price = document.querySelector('.total-price');
  if (listCart.length === 0) {
    price.innerText = 0;
  }
  listCart.forEach((item) => {
    result += parseFloat(item.innerText.split('$')[1]);
    price.innerText = result;
  });
};

function cartItemClickListener(event) {
  event.target.parentNode.removeChild(event.target);
  sumPrice();
  save();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addCart = (product) => {
  const { id, title, price } = product;
  const obj = { sku: id, name: title, salePrice: price };
  document.querySelector('.cart__items').appendChild(createCartItemElement(obj));
  sumPrice();
  save();
};
const addProduct = async (sku) => {
  const endPoint = `https://api.mercadolibre.com/items/${sku}`;
  try {
    const response = await fetch(endPoint);
    const object = await response.json();
    if (!object) {
      throw new Error('Erro');
    } else {
      addCart(object);
    }
  } catch (err) {
    window.alert(err);
  }
};
const addItemCartListener = () => {
  const buttonAdd = document.querySelectorAll('.item__add');
  buttonAdd.forEach((item, index) => {
    item.addEventListener('click', () => {
      addProduct(getSkuFromProductItem(document, [index]));
    });
  });
};

const allList = (items) => {
  items.forEach((item) => {
    const sectionList = document.querySelector('.items');
    const { id, title, thumbnail } = item;
    const obj = { sku: id, name: title, image: thumbnail };
    sectionList.appendChild(createProductItemElement(obj));
  });
  addItemCartListener();
};
const createList = async (search) => {
  const endPoint = `https://api.mercadolibre.com/sites/MLB/search?q=${search}`;
  wait(true);
  try {
    const response = await fetch(endPoint);
    const object = await response.json();

    if (object.results.length === 0) {
      throw new Error('Produto não encontrado');
    } else {
      allList(object.results);
      wait(false);
    }
  } catch (err) {
    window.alert(err);
  }
};

window.onload = function onload() {
  const clearCart = document.querySelector('.empty-cart');
  const clear = () => {
    document.querySelector('.cart__items').innerHTML = '';
    document.querySelector('.total-price').innerText = 0;
    save();
  };
  createList('computador');
  clearCart.addEventListener('click', clear);
  load();
};
