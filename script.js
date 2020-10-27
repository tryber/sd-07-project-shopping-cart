function loadItemStorage() {
  return (JSON.parse(localStorage.getItem('items')));
}

function addStorage(items) {
  return localStorage.setItem('items', JSON.stringify(items));
}

function removeStorage(index) {
  const items = loadItemStorage();
  items.splice(index, 1);
  addStorage(items);
}

function addItemLocalStorage({ id, title, price }) {
  const items = [];
  if ((typeof (Storage) !== 'undefined') && (localStorage.length !== 0)) {
    const storageValues = loadItemStorage();
    storageValues.forEach((element) => {
      items.push(element);
    });
  }
  items.push({ id, title, price });
  addStorage(items);
}

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
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function updadeTotalPrice(price) {
  return new Promise((resolve) => {
    const totalPrice = document.querySelector('.total-price');
    const oldTotalPrice = parseFloat(totalPrice.innerText);
    const newTotalPrice = oldTotalPrice + price;
    const newTotalPriceTwoDigits = Math.round(newTotalPrice * 100) / 100;
    totalPrice.innerText = newTotalPriceTwoDigits; // .toFixed(2);
    resolve();
  });
}

async function cartItemClickListener(event, price) {
  await updadeTotalPrice((-1) * price);
  const pai = event.target.parentElement;
  const filho = event.target;
  removeStorage(Array.prototype.indexOf.call(pai.children, filho));
  event.target.parentElement.removeChild(event.target);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => {
    cartItemClickListener(event, salePrice);
  });
  return li;
}

async function loadCard(obj) {
  const ol = document.querySelector('.cart__items');
  ol.appendChild(createCartItemElement(obj));
  await updadeTotalPrice(obj.price);
}

async function insertCartItemElement(obj) {
  loadCard(obj);
  addItemLocalStorage(obj);
}


async function restoreCartItemElement() {
  const obj = loadItemStorage();

  if (obj !== null) {
    // let totalPrice = 0;
    obj.forEach((element) => {
      // totalPrice += element.price;
      loadCard(element);
    });
  }
}

function insertItems(obj) {
  const itemsSection = document.querySelector('.items');
  itemsSection.innerHTML = '';
  obj.results.forEach((element) => {
    itemsSection.appendChild(createProductItemElement(element));
  });
}

const fetchCurrencyAwaitAsync = async (callBack, endpoint) => {
  try {
    const response = await fetch(endpoint);
    const objProducts = await response.json();

    if (objProducts.error) {
      throw new Error(objProducts.error);
    } else {
      callBack(objProducts);
    }
  } catch (error) {
    alert('Serviço momentaneamente indisponível. Tente Novamente!');
  }
};

window.onload = function onload() {
  const query = 'computador';
  fetchCurrencyAwaitAsync(insertItems, `https://api.mercadolibre.com/sites/MLB/search?q=$${query}`);
  const sectionWithClassItems = document.querySelector('.items');

  const btnEmptyCart = document.querySelector('.empty-cart');
  btnEmptyCart.addEventListener('click', () => {
    const ol = document.querySelector('.cart__items');
    ol.innerHTML = '';
    document.querySelector('.total-price').innerText = '0.00';
    localStorage.removeItem('items');
  });

  restoreCartItemElement();

  // A escuta é feita na classe items, que já existe estaticamente no HTML
  // Só será possível clicar em 'item__add' quando os dados estiverem carregados
  // por isso não precisa fazer um async/await
  sectionWithClassItems.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      const id = event.target.parentElement.firstChild.innerText;
      fetchCurrencyAwaitAsync(insertCartItemElement, `https://api.mercadolibre.com/items/${id}`);
    }
  });
};
