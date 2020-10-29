function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
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

// source https://www.devmedia.com.br/javascript-substring-selecionando-parte-de-uma-string/39232
const sumItems = () => {
  const arrayOfItems = [];
  const sumPrice = document.querySelector('.total-price');
  const cartItems = document.querySelectorAll('.cart__item');
  if (cartItems.length === 0) {
    sumPrice.innerText = 0;
  } else {
    cartItems.forEach(item => arrayOfItems.push(item.innerText));
    const arrayOfPricesInString = [];
    arrayOfItems.forEach(item => arrayOfPricesInString.push(item.substring(item.indexOf('$') + 1)));
    const arrayOfPrices = [];
// source https://medium.com/aprendajs/convertendo-uma-string-em-um-numero-em-javascript-e6c856fb53be
    arrayOfPricesInString.forEach(item => arrayOfPrices.push(Number(item)));
    const sum = arrayOfPrices.reduce((previousValue, currentValue) => previousValue + currentValue);
    sumPrice.innerText = `${sum}`;
    localStorage.setItem('totalValue', sum);
  }
  return sumPrice;
};

function cartItemClickListener(event) {
  event.target.remove();
  sumItems();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  const cart = document.querySelector('.cart__items');
  cart.appendChild(li);
  const cartSet = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('finalCart', cartSet);
  return li;
}
const addToCart = async (itemID) => {
  const API_URL = `https://api.mercadolibre.com/items/${itemID}`;
  try {
    const response = await fetch(API_URL);
    const object = await response.json();

    if (object.error) {
      throw new Error(object.error);
    } else {
      createCartItemElement(object);
      sumItems();
    }
  } catch (error) {
    console.error(error);
  }
};

const addEventAddCart = () => {
  const buttonAddCart = document.querySelectorAll('.item__add');
  buttonAddCart.forEach((item) => {
    item.addEventListener('click', () => {
      const identify = item.parentNode.querySelector('.item__sku').innerText;
      addToCart(identify);
    });
  });
};


const handleResults = (results) => {
  const hall = document.querySelector('.items');
  results.forEach((item) => {
    const { id, title, thumbnail } = item;
    const itemData = { id, title, thumbnail };
    hall.appendChild(createProductItemElement(itemData));
  });
  addEventAddCart();
};

const fetchItems = async () => {
  const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  try {
    const response = await fetch(API_URL);
    const object = await response.json();

    if (object.error) {
      throw new Error(object.error);
    } else {
      handleResults(object.results);
      // solução de loading pós-consulta PR Vitor-rc1
      const loading = document.querySelector('.loading');
      loading.remove();
    }
  } catch (error) {
    console.error(error);
  }
};

const createClearButton = () => {
  const clearButton = document.getElementsByClassName('empty-cart')[0];
  const cartItems = document.getElementsByClassName('cart__items')[0];
  const cartCust = document.getElementsByClassName('total-price')[0];
  clearButton.addEventListener('click', () => {
    cartItems.innerHTML = '';
    cartCust.innerText = 0;
    localStorage.clear();
  });
};

const requireLocalStorage = () => {
  const allCart = document.querySelector('ol');
  allCart.innerHTML = localStorage.getItem('finalCart');
  const values = document.querySelector('.total-price');
  values.innerHTML = localStorage.getItem('totalValue');
};

window.onload = function onload() {
  fetchItems();
  requireLocalStorage();
  createClearButton();
};
