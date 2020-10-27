
const identifyIdNameAndPrice = (item) => {
  const firstComma = item.indexOf(',');
  const id = item.slice(0, firstComma);
  const newString = item.slice((firstComma + 1), (item.length));
  const secondComma = newString.indexOf(',');
  const name = newString.slice(0, (secondComma));
  const price = newString.slice((secondComma + 1), newString.length);
  const itemData = [id, name, price];
  return itemData;
};

const selectTotalPrice = () => {
  let totalPrice = document.querySelector('.total-price').innerText;
  totalPrice = parseFloat(totalPrice.slice(16, (totalPrice.length)), 10);
  return totalPrice;
};

async function totalPriceInnerText(price) {
  document.querySelector('.total-price').innerText = await `Preço total: R$ ${price}`;
}

const removeLastItem = (string) => {
  let stringNumber = string;
  if (stringNumber[stringNumber.length - 1] === '0' || stringNumber[stringNumber.length - 1] === '.') {
    stringNumber = stringNumber.slice(0, (stringNumber.length - 1));
  }
  return stringNumber;
};

const removeZero = (string) => {
  let stringNumber = string;
  if (stringNumber[0] === '0') {
    stringNumber = '0';
    return stringNumber;
  }
  stringNumber = removeLastItem(stringNumber);
  stringNumber = removeLastItem(stringNumber);
  stringNumber = removeLastItem(stringNumber);
  return stringNumber;
};

const roundNumber = (string) => {
  stringNumber = string.toFixed(2);
  const number = removeZero(stringNumber);
  return number;
};

async function discountTotalPrice(price) {
  let discount = price;
  let totalPrice = selectTotalPrice();
  if (typeof discount === 'string') discount = parseFloat(discount, 10);
  totalPrice -= discount;
  if (totalPrice >= 0) {
    totalPrice = roundNumber(totalPrice);
    await totalPriceInnerText(totalPrice);
  }
}

const removeItemFromLocalStorage = (id) => {
  const cartItens = Object.entries(localStorage);
  cartItens.forEach((item) => {
    const itemKey = item[0];
    const itemData = identifyIdNameAndPrice(item[1]);
    const [itemId, name, price] = itemData;
    if (itemId === id) {
      localStorage.removeItem(`${itemKey}`);
      discountTotalPrice(price, name);
    }
  });
};

const getItemId = (item) => {
  const idFirstLetter = item.indexOf('M');
  const idLastNumber = item.indexOf('|');
  const id = item.slice(idFirstLetter, (idLastNumber - 1));
  return id;
};

function cartItemClickListener(event) {
  // coloque seu código aqui
  const item = event.target.innerText;
  const id = getItemId(item);
  removeItemFromLocalStorage(id);
  event.target.remove();
}

const putItemInLocalStorage = (id, name, price) => {
  if (localStorage.getItem('counter') === null) localStorage.setItem('counter', 0);
  let counter = localStorage.getItem('counter');
  counter = parseInt(counter, 10) + 1;
  localStorage.setItem('counter', counter);
  localStorage.setItem(`cartItem${counter}`, [id, name, price]);
};

async function addTotalPrice(price) {
  let sum = price;
  let totalPrice = selectTotalPrice();
  if (typeof sum === 'string') sum = parseFloat(sum, 10);
  totalPrice += sum;
  totalPrice = roundNumber(totalPrice);
  await totalPriceInnerText(totalPrice);
}

function createCartItemElement(sku, name, salePrice) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  removeItemFromLocalStorage(sku);
  putItemInLocalStorage(sku, name, salePrice);
  addTotalPrice(salePrice);
  return li;
}

const convertRequestToJSON = (url) => {
  const loading = document.createElement('h1');
  loading.className = 'loading';
  loading.innerText = 'loading...';
  document.querySelector('body').appendChild(loading);
  const conversion = fetch(url).then(response => response.json());
  return conversion;
};

const identifyPrice = (item) => {
  const secondComma = item.indexOf(',', 20);
  const price = item.slice(secondComma + 1, item.length);
  return price;
};

const cartInitialPrice = () => {
  const cartItens = Object.values(localStorage);
  let initialPrice = 0;
  cartItens.forEach((item) => {
    if (item.length > 10) {
      const price = parseFloat(identifyPrice(item), 10);
      initialPrice += price;
    }
  });
  totalPriceInnerText(initialPrice);
};

const recoverCart = () => {
  const cartItems = Object.values(localStorage);
  cartItems.forEach((item) => {
    if (item.length > 10) {
      const itemData = identifyIdNameAndPrice(item);
      const [id, name, price] = itemData;
      const cartItem = createCartItemElement(id, name, price);
      document.querySelector('.cart__items').appendChild(cartItem);
    }
  });
};

const addRequestToHTMLClass = (request, callback, HTMLClass) => {
  const { id, title, price, thumbnail } = request;
  let imgOrPrice = price;
  if (HTMLClass.length < 10) imgOrPrice = thumbnail;
  const item = callback(id, title, imgOrPrice);
  document.querySelector(`${HTMLClass}`).appendChild(item);
};

const addItemToCart = (element) => {
  const idNumber = element.previousSibling.previousSibling.previousSibling.innerText;
  convertRequestToJSON(`https://api.mercadolibre.com/items/${idNumber}`)
    .then((response) => {
      addRequestToHTMLClass(response, createCartItemElement, '.cart__items');
      document.querySelector('.loading').remove();
    });
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

function createProductItemElement(sku, name, image) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', function () {
    addItemToCart(event.target);
  });
  section.appendChild(button);

  return section;
}

const createItens = () => {
  convertRequestToJSON('https://api.mercadolibre.com/sites/MLB/search?q=cumputador')
    .then((response) => {
      document.querySelector('.loading').remove();
      return response.results.forEach((computer) => {
        addRequestToHTMLClass(computer, createProductItemElement, '.items');
      });
    },
    );
};

const emptyCart = () => {
  const cartItensHTMLCollection = document.getElementsByClassName('cart__item');
  const cartItensArray = [].slice.call(cartItensHTMLCollection);
  cartItensArray.forEach((item) => {
    const itemText = item.innerText;
    const id = getItemId(itemText);
    removeItemFromLocalStorage(id);
    item.remove();
  });
  totalPriceInnerText(0);
};

const checkCounter = () => {
  counter = localStorage.getItem('counter');
  if (counter > 10000) localStorage.counter = 0;
};

window.onload = function onload() {
  createItens();
  recoverCart();
  cartInitialPrice();
  document.querySelector('.empty-cart').addEventListener('click', emptyCart);
  checkCounter();
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
