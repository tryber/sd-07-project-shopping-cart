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
  const elements = document.querySelector('.items');
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return elements.appendChild(section);
}

// requisito 2 passo 1 capturar ol
const cathOl = (element) => {
  const chart = document.querySelector('.cart__items');
  chart.appendChild(element);
};

// paso 3 localStorage
const sumTotalBill = async (sum) => {
  const totalPrice = await document.querySelector('.total-price');
  totalPrice.innerHTML = sum;
};

// passo 2 localStorage
async function getSumTotalBill() {
  let sum = 0;
  const totalBill = await JSON.parse(localStorage.getItem('cart'));
  if (totalBill) {
    for (let index = 0; index < totalBill.length; index += 1) {
      sum += totalBill[index].price;
    }
  }
  sumTotalBill(sum);
}

const removeItemFromLocalStorage = (sku) => {
  const getItemsFromLocalStorage = JSON.parse(localStorage.getItem('cart'));
  for (let index = 0; index < getItemsFromLocalStorage.length; index += 1) {
    if (getItemsFromLocalStorage[index].id === sku) {
      getItemsFromLocalStorage.splice(index, 1);
      break;
    }
  }
  localStorage.setItem('cart', JSON.stringify(getItemsFromLocalStorage));
  getSumTotalBill();
};

function cartItemClickListener(event) {
  event.target.parentNode.removeChild(event.target);
  removeItemFromLocalStorage(event.target.id);
}

// passo 1.1 localStorage
const loadItemsToLocalStorage = (id, title, price) => {
  if (Storage) {
    const getItemSaved = JSON.parse(localStorage.getItem('cart'));
    const values = (getItemSaved === null ? [] : getItemSaved);
    values.push({ id, title, price });
    localStorage.setItem('cart', JSON.stringify(values));
  }
  getSumTotalBill();
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  li.id = sku;
  return li;
}

function loading() {
  const Espan = document.createElement('span');
  Espan.className = 'loading';
  Espan.innerHTML = 'loading...';
  const getContainerElement = document.querySelector('.items');
  getContainerElement.appendChild(Espan);
}

const appendItemToChart = (element) => {
  const toChart = document.querySelector('.cart__items');
  toChart.appendChild(element);
};

// passo 4 localStorage
const retrieveItemsSavedBeforeFromLocalStorage = () => {
  const getItemsFromLocalStorage = JSON.parse(localStorage.getItem('cart'));
  if (getItemsFromLocalStorage !== null) {
    for (let index = 0; index < getItemsFromLocalStorage.length; index += 1) {
      const cart = createCartItemElement(getItemsFromLocalStorage[index]);
      appendItemToChart(cart);
    }
  }
};


const eraseElement = () => {
  const getContainerElement = document.querySelector('.items');
  getContainerElement.removeChild(getContainerElement.firstChild);
};

// requisito 2 passo 2
const fetchToChart = (sku) => {
  const endpoint = `https://api.mercadolibre.com/items/${sku}`;
  fetch(endpoint)
    .then(response => response.json())
    .then((data) => {
      cathOl(createCartItemElement(data)); // requisito 2 passo 4
      loadItemsToLocalStorage(data.id, data.title, data.price);  // passo 1.1 localStorage
    });
};

// requisito 2 passo 3
const appendToChart = (item) => {
  const createDisplay = document.querySelector('.items');
  createDisplay.appendChild(item);
  item.addEventListener('click', (event) => {
    const getSku = event.currentTarget.firstChild.innerText;
    fetchToChart(getSku);
  });
};

// requisito 1
const fetchProducts = () => {
  loading();
  setTimeout(() => {
    const endpoint =
      'https://api.mercadolibre.com/sites/MLB/search?q=computador';
    fetch(endpoint)
      .then(data => data.json())
      .then(data =>
        data.results.forEach((value) => {
          appendToChart(createProductItemElement(value));
        }),
      )
      .then(eraseElement());
  }, 1000);
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cleanToChart() {
  const buttonCleanChart = document.querySelector('.empty-cart');
  buttonCleanChart.addEventListener('click', () => {
    const chart = document.querySelector('.cart__items');
    chart.innerHTML = '';
    localStorage.clear();
    getSumTotalBill();
  });
}

window.onload = function onload() {
  getSumTotalBill();
  retrieveItemsSavedBeforeFromLocalStorage();
  fetchProducts();
  cleanToChart();
};
