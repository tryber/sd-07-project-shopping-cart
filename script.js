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

const showAlert = message => window.alert(message);

function createLoading(isVisible) {
  if (!isVisible) {
    const loadPlace = document.querySelector('.load-place');
    loadPlace.innerHTML = '';
    loadPlace.style.display = 'none';
  } else {
    const loadPlace = document.querySelector('.load-place');
    loadPlace.innerHTML = "<h1 class='loading'>Loading...</h1>";
    loadPlace.style.display = 'flex';
  }
}

// Baseado no projeto Casa de Câmbio do Oliva
const currencyPHP = async () => {
  createLoading(true);
  const endpoint = 'https://api.ratesapi.io/api/latest?base=BRL';

  try {
    const response = await fetch(endpoint);
    const object = await response.json();
    if (object.error) {
      throw new Error(object.error);
    } else {
      return object.rates.PHP;
    }
  } catch (error) {
    return showAlert(error);
  }
};

const updatePrice = (className, value, signal) => {
  const items = document.querySelectorAll(className);
  const ratePHP = currencyPHP()
    .then(setTimeout(() => setTimeout(() => createLoading(false), 100)));
  items.forEach((item) => {
    const copyItem = item;
    const splitedPrice = item
      .innerText
      .split(' ');

    splitedPrice[signal] = '₱';

    ratePHP.then((x) => {
      splitedPrice[value] = (x * splitedPrice[value]).toFixed(2);
      copyItem.innerText = splitedPrice.join(' ');
    });
  });
};

const createPriceElement = (prices) => {
  const getCurrency = document.querySelector('.selected-currency').getAttribute('currency');
  if (getCurrency === '₱') {
    updatePrice('.item__price', 1, 0);
    updatePrice('.item__price__credit', 3, 2);
  }
  return `R$ ${prices}`;
};

const setLocalStorage = (cartProductPlace) => {
  localStorage.setItem('cart', cartProductPlace.innerHTML);
};

const sumTotalPrices = async (price, operation) => {
  createLoading(true);
  const inputPrice = document.querySelector('.total-price');
  if (operation === '+') {
    inputPrice.innerHTML = Number(inputPrice.innerText) + price;
  } else if (operation === '-') {
    inputPrice.innerHTML = Number(inputPrice.innerText) - price;
  } else {
    inputPrice.innerHTML = price;
  }
};

function cartItemClickListener(event) {
  localStorage.removeItem('cart');
  const price = this.getAttribute('price');
  sumTotalPrices(price, '-');
  this.remove(event);
}

const getLocalStorage = () => {
  const cartItems = document.querySelector('ol');
  if (localStorage.getItem('cart')) {
    cartItems.innerHTML = localStorage.getItem('cart');
    const eachItem = cartItems.querySelectorAll('li');
    eachItem.forEach(item => item.addEventListener('click', cartItemClickListener));
  }
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.setAttribute('price', salePrice);
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // window.localStorage.setItem(`Item${countItems}`, {sku: sku, name: name, salePrice: salePrice});
  sumTotalPrices(salePrice, '+')
  .then(setTimeout(() => createLoading(false), 100));
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchProductToCart = async (id) => {
  createLoading(true);
  const endpoint = `https://api.mercadolibre.com/items/${id}`;

  try {
    const response = await fetch(endpoint);
    const object = await response.json();
    if (object.error) {
      throw new Error(object.error);
    } else {
      const cartProductPlace = document.querySelector('ol.cart__items');
      const { id: sku, title: name, price: salePrice } = object;
      cartProductPlace.appendChild(createCartItemElement({ sku, name, salePrice }));

      setLocalStorage(cartProductPlace);
      return cartProductPlace;
    }
  } catch (error) {
    return showAlert(error);
  }
};

const getSkuFromProductItem = item => item.querySelector('span.item__sku').innerText;

// Baseado na aula do Tiago Esdras
function createProductItemElement({ sku, name, image, price }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__price', createPriceElement(price)));
  section.appendChild(createCustomElement('span', 'item__price__credit', `12x de R$ ${((price) / 12).toFixed(2)} sem juros`));

  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  const button = createCustomElement('button', 'item__add', '+');
  button.addEventListener('click', async function (event) {
    const parentElement = await event.target.parentElement;
    await fetchProductToCart(getSkuFromProductItem(parentElement))
    .then(setTimeout(() => createLoading(false), 100));
  });
  section.appendChild(button);
  return section;
}

// Baseado na aula do Vitor
const createProductList = (searchFor) => {
  createLoading(true);
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${searchFor}`;
  fetch(endpoint)
  .then(response => response.json())
  .then((data) => {
    const items = document.querySelector('.items');

    data.results.forEach((product) => {
      const { id: sku, title: name, thumbnail: image, price } = product;
      const item = createProductItemElement({ sku, name, image, price });
      items.appendChild(item);
    });
  })
  .then(setTimeout(() => createLoading(false), 100));
};

const getSearchItem = () => {
  const searchInput = document.querySelector('#search-input').value;
  setTimeout(() => createLoading(false), 100);
  return searchInput;
};

const executeSearch = (input) => {
  if (input !== '') {
    const items = document.querySelector('#items');
    if (items !== '') {
      items.innerHTML = '';
      createProductList(getSearchItem());
    } else {
      createProductList(getSearchItem());
    }
  }
};

const searchBtn = () => {
  // const searchBtn = document.querySelector('#search-btn');
  const searchInput = document.querySelector('#search-input').value;
  executeSearch(searchInput);
  // searchBtn.addEventListener('click', () => {
    // const searchInput = document.querySelector('#search-input').value;
    // executeSearch(searchInput);
  // });
};

const selectCurrency = () => {
  const inputCurrency = document.querySelector('#input-currency');
  const firstCurrency = document.querySelector('#first-currency');
  const secondCurrency = document.querySelector('#second-currency');

  let boo = true;
  inputCurrency.addEventListener('click', () => {
    if (boo) {
      firstCurrency.className = 'shadow-currency';
      secondCurrency.className = 'selected-currency';
      boo = false;
      executeSearch();
    } else {
      secondCurrency.className = 'shadow-currency';
      firstCurrency.className = 'selected-currency';
      boo = true;
      executeSearch();
    }
  });
};

const emptyCart = () => {
  const emptyCartBtn = document.querySelector('.empty-cart');
  emptyCartBtn.addEventListener('click', () => {
    const cartItems = document.querySelector('ol.cart__items');
    localStorage.removeItem('cart');
    cartItems.innerHTML = '';
    sumTotalPrices('', '')
    .then(setTimeout(() => createLoading(false), 100));
  });
};

window.onload = function onload() {
  getLocalStorage();
  searchBtn();
  selectCurrency();
  const logoBtn = document.querySelector('#logo-svg');
  logoBtn.addEventListener('click', () => location.reload());
  emptyCart();
};
