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
  section.appendChild(createCustomElement('button', 'item__add btn btn-success', 'Adicionar ao carrinho!'));
  return section;
}

function calculateValue(newList) {
  return new Promise((resolve) => {
    const newArray = [];
    newList.forEach(item => newArray.push(item.salePrice));
    const value = (newArray.reduce((acc, nextValue) => acc + nextValue, 0));
    resolve(value);
  });
}

async function sumTotalCart() {
  const newList = JSON.parse(localStorage.getItem('Carrinho de Compras'));
  const divPrice = document.querySelector('.total-price');
  const divPriceChild = document.querySelector('.total-price-child');
  const value = await calculateValue(newList);
  if (!divPriceChild) {
    const totalPriceInCart = createCustomElement('div', 'total-price-child bg-dark text-light', value);
    divPrice.appendChild(totalPriceInCart);
  } else {
    divPrice.removeChild(divPriceChild);
    const totalPriceInCart = createCustomElement('div', 'total-price-child bg-dark text-light', value);
    divPrice.appendChild(totalPriceInCart);
  }
}

function saveCart(newItemCart) {
  const arrayOfData = JSON.parse(localStorage.getItem('Carrinho de Compras'));
  arrayOfData.push(newItemCart);
  localStorage.setItem('Carrinho de Compras', JSON.stringify(arrayOfData));
  sumTotalCart();
}

function cartItemClickListener(event) {
  const arrayLocalStorage = JSON.parse(localStorage.getItem('Carrinho de Compras')) || [];
  const itemParent = document.querySelector('.cart__items');
  const arrayOfData = arrayLocalStorage.map(item => item.sku);
  const itemSelected = event.target;
  const correspondentIndex = arrayOfData.indexOf(itemSelected.dataset.sku);
  arrayLocalStorage.splice(correspondentIndex, 1);
  itemParent.removeChild(itemSelected);
  localStorage.clear();
  localStorage.setItem('Carrinho de Compras', JSON.stringify(arrayLocalStorage));
  sumTotalCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  li.dataset.sku = sku;
  return li;
}

function createCartAllElements(arrayOfData) {
  const list = document.querySelector('.cart__items');
  arrayOfData.forEach((item) => {
    const li = createCartItemElement(item);
    list.appendChild(li);
  });
}

function reloadCart() {
  const arrayOfData = JSON.parse(localStorage.getItem('Carrinho de Compras'));
  if (localStorage.getItem('Carrinho de Compras')) {
    createCartAllElements(arrayOfData);
  } else {
    const newArray = [];
    localStorage.setItem('Carrinho de Compras', JSON.stringify(newArray));
    createCartAllElements(newArray);
  }
  sumTotalCart();
}

function createLoadingElement() {
  const cart = document.querySelector('.cart');
  const loadingElement = createCustomElement('span', 'loading', 'loading...');
  cart.appendChild(loadingElement);
}

function removeLoadingElement() {
  const cart = document.querySelector('.cart');
  const loadingElement = document.querySelector('.loading');
  cart.removeChild(loadingElement);
}

const getFilteredProducts = () => {
  const itemsSection = document.querySelector('.items');
  const endPoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  createLoadingElement();
  return fetch(endPoint)
    .then(response => response.json())
    .then(data => data.results.forEach(({ id: sku, title: name, thumbnail: image }) => {
      const itemToBeInserted = createProductItemElement({ sku, name, image });
      itemsSection.appendChild(itemToBeInserted);
    }))
    .then(removeLoadingElement);
};

const insertProductInCart = (event) => {
  const itemSelected = event.target.parentNode;
  const cartSection = document.querySelector('.cart__items');
  const idSelected = itemSelected.querySelector('.item__sku').innerText;
  const endPoint = `https://api.mercadolibre.com/items/${idSelected}`;
  createLoadingElement();
  fetch(endPoint)
    .then(response => response.json())
    .then(({ id: sku, title: name, price: salePrice }) => {
      const newItemCart = {
        sku,
        name,
        salePrice,
      };
      const itemToBeInsertedInCart = createCartItemElement(newItemCart);
      cartSection.appendChild(itemToBeInsertedInCart);
      saveCart(newItemCart);
    })
    .then(removeLoadingElement);
};

function getClickForCart() {
  const productButton = document.querySelectorAll('.item__add');
  productButton.forEach((item) => {
    item.addEventListener('click', insertProductInCart);
  });
}

function clearCart() {
  const cartList = document.querySelector('.cart__items');
  const newArray = [];
  if (cartList.childNodes.length !== 0) {
    cartList.innerHTML = '';
    localStorage.clear();
    localStorage.setItem('Carrinho de Compras', JSON.stringify(newArray));
    sumTotalCart();
  }
}

function loadClearButton() {
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', clearCart);
}

window.onload = async function onload() {
  await getFilteredProducts();
  reloadCart();
  getClickForCart();
  loadClearButton();
};
