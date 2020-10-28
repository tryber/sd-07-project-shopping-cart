// ------ CONST SETUP -------
const cartKey = 'cartListLS';
const itemQuery = 'computador';

const loaderDiv = document.createElement('div');
loaderDiv.className = 'loader';
const loadSection = document.createElement('section');
loadSection.className = 'loading';
loadSection.innerText = 'loading...';
// --------------------------

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

function itemObjectCreate(keysFunc, keys, item) {
  const itemObj = {};
  keys.forEach((key, index) => { itemObj[keysFunc[index]] = item[key]; });
  return itemObj;
}

function cartLocalStorage() {
  const cartItems = document.getElementsByClassName('cart__item');
  const cartItemsArray = Array.from(cartItems);
  const itemsToSave = cartItemsArray.reduce((acc, item, index) => (
    {
      ...acc,
      [index]: item.innerHTML,
    }
  ), {});
  localStorage.setItem(cartKey, JSON.stringify(itemsToSave));
}

async function totalCartPrice() {
  let priceSum = 0;
  const cartLiItems = Array.from(document.querySelectorAll('.cart__item'));
  cartLiItems.forEach((item) => {
    priceSingIndex = item.innerHTML.indexOf('$') + 1;
    priceSum += parseFloat(item.innerHTML.slice(priceSingIndex));
  });
  // currencyPrice = new Intl.NumberFormat(
  //   'pt-BR', {
  //     style: 'currency',
  //     currency: 'BRL' })
  //   .format(priceSum);
  // document.querySelector('.total-price').innerText = `Preço total ${currencyPrice}`;
  document.querySelector('.total-price').innerText = `${priceSum}`;
}

/*
function cartItemClickListener(event) {
  return new Promise((resolve, reject) => {
    event.srcElement.remove();
    resolve(cartLocalStorage());
  })
}
*/

function cartItemClickListener(event) {
  event.srcElement.remove();
  totalCartPrice();
  cartLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function loadAPI(isVisible) {
  if (isVisible) {
    document.querySelector('.items').appendChild(loadSection);
    document.querySelector('.loading').appendChild(loaderDiv);
  } else {
    document.querySelector('.loading').remove();
  }
}

const fectchItem = (endpoint) => {
  loadAPI(true);
  fetch(endpoint)
    .then(response => response.json())
    .then((item) => {
      document.querySelector('.cart__items')
      .appendChild(
        createCartItemElement(
          itemObjectCreate(
            ['sku', 'name', 'salePrice'],
            ['id', 'title', 'price'],
            item)));
      totalCartPrice();
      cartLocalStorage();
      loadAPI(false);
    });
};

function handlerEventClick(event) {
  if (event.target.className === 'item__add') {
    const itemId = getSkuFromProductItem(event.path[1]);
    const endpoint = `https://api.mercadolibre.com/items/${itemId}`;
    fectchItem(endpoint);
  }
  if (event.target.className === 'empty-cart') {
    document.querySelector('.cart__items').innerHTML = '';
    document.querySelector('.total-price').innerText = '';
  }
}

function fectchItemSearch(query) {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
  loadAPI(true);
  fetch(endpoint)
    .then(response => response.json())
    .then((data) => {
      data.results.forEach(item =>
        document.querySelector('.items')
        .appendChild(
          createProductItemElement(
            itemObjectCreate(
              ['sku', 'name', 'image'],
              ['id', 'title', 'thumbnail'],
              item))));
      loadAPI(false);
    });
}

function loadLocalStorage() {
  if (localStorage.getItem(cartKey) === null) {
    localStorage.setItem(cartKey, {});
  } else {
    const savedItens = JSON.parse(localStorage.getItem(cartKey));
    (Object.values(savedItens)).forEach((item) => {
      const li = document.createElement('li');
      li.className = 'cart__item';
      li.innerText = `${item}`;
      li.addEventListener('click', cartItemClickListener);
      document.querySelector('.cart__items').appendChild(li);
    });
    totalCartPrice();
  }
}

window.onload = function onload() {
  fectchItemSearch(itemQuery);
  loadLocalStorage();
  document.onclick = handlerEventClick;
};
