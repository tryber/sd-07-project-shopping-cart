let buySum = 0;

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

const localStorageQuery = () => localStorage.getItem('shopList');

const addLocalStorage = async () => {
  const shopList = [];
  const liList = document.querySelectorAll('.cart__item');
  liList.forEach((atual) => {
    shopList.push(atual.innerText);
  });
  localStorage.setItem('shopList', JSON.stringify(shopList));
};

const removeFronLocalStorage = () => {
  addLocalStorage();
  const liList = document.querySelectorAll('.cart__item');
  let somaLiValues = 0;
  liList.forEach((atual) => {
    somaLiValues += parseFloat(atual.innerText.split('$')[1]);
  });
  buySum = somaLiValues;
  localStorage.setItem('shopSum', somaLiValues);
  document.querySelector('.total-price').innerText = localStorage.getItem('shopSum');
};

const cartItemClickListener = (event) => {
  event.target.remove();
  removeFronLocalStorage();
};

const loadShopCar = async (object) => {
  if (localStorage.getItem('shopSum')) {
    document.querySelector('.total-price').innerText = localStorage.getItem('shopSum');
  }
  newObject = await JSON.parse(object);
  if (newObject !== null) {
    newObject.forEach((atual) => {
      const ol = document.querySelector('.cart__items');
      const li = document.createElement('li');
      li.className = 'cart__item';
      li.innerText = atual;
      li.addEventListener('click', cartItemClickListener);
      ol.appendChild(li);
    });
  }
};

const sumPrices = (price) => {
  buySum += price;
  localStorage.setItem('shopSum', buySum);
  return buySum;
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  document.querySelector('.total-price').innerText = sumPrices(salePrice);
  return li;
}

const endpointQuery = async (endpoint) => {
  const result = await fetch(endpoint);
  const object = await result.json();
  return object;
};

async function searchItemByID(id) {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  const object = await endpointQuery(endpoint);
  const objDetails = {
    sku: object.id,
    name: object.title,
    salePrice: object.price,
  };
  const ol = document.querySelector('.cart__items');
  ol.appendChild(createCartItemElement(objDetails));
  await addLocalStorage();
}

const clearList = () => {
  document.querySelector('.cart__items').innerHTML = null;
  removeFronLocalStorage();
};

const showOrHideLoading = async () => {
  if (document.querySelector('.loading')) {
    document.querySelector('.loading').remove();
  } else {
    const section = document.querySelector('.container');
    const span = document.createElement('span');
    span.className = 'loading';
    span.innerText = 'loading...';
    section.appendChild(span);
  }
};

window.onload = async function onload() {
  await showOrHideLoading();
  await loadShopCar(localStorageQuery());
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const object = await endpointQuery(endpoint);
  const objectResults = object.results;
  await showOrHideLoading();
  objectResults.forEach((atual) => {
    const produto = {
      sku: atual.id,
      name: atual.title,
      image: atual.thumbnail,
    };
    const section = document.querySelector('.items');
    section.appendChild(createProductItemElement(produto));
  });
  document.querySelectorAll('.item').forEach((item) => {
    item.childNodes[3].addEventListener('click', () => {
      searchItemByID(item.childNodes[0].innerText);
    });
  });

  document.querySelector('.empty-cart').addEventListener('click', clearList);
};
