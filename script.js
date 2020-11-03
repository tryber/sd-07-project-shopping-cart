async function cartTotalPrice() {
  const priceText = document.querySelector('.total-price');
  let totalPrice = parseFloat(0);
  const cartPrices = Object.values(localStorage);
  cartPrices.forEach((price) => {
    const sumPrice = Number(price);
    totalPrice += sumPrice;
  });
  priceText.innerHTML = `${totalPrice}`;
}

// ----------------------------------------------------

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

function cartItemClickListener(event) {
  const item = event.currentTarget;
  if (item.classList.contains('cart__item')) {
    const splitItem = item.innerText.split(' ');
    localStorage.removeItem(splitItem[1]);
  }
  item.remove();
  cartTotalPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// ------------------------------------------------------
function loading() {
  const section = document.querySelector('.items');
  const loadingElement = document.createElement('h2');
  loadingElement.innerText = '...Loading Products...';
  loadingElement.classList.add('loading');
  section.appendChild(loadingElement);
}

async function productList() {
  loading();
  const itemsList = document.querySelector('.items');
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

  const response = await fetch(endpoint);
  const object = await response.json();
  itemsList.innerHTML = '';
  object.results.forEach((item) => {
    const { id: sku, title: name, thumbnail: image } = item;
    itemsList.appendChild(createProductItemElement({ sku, name, image }));
  });
}

async function addToCart(id) {
  const cart = document.querySelector('.cart__items');

  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  const response = await fetch(endpoint);
  const data = await response.json();

  const { id: sku, title: name, price: salePrice } = data;
  const itemToCart = createCartItemElement({ sku, name, salePrice });
  cart.appendChild(itemToCart);
  localStorage.setItem([id], [salePrice]);
  cartTotalPrice();
}

function addButton() {
  const buttons = document.querySelectorAll('.item__add');
  const itemsId = document.querySelectorAll('.item__sku');

  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      const id = itemsId[index].textContent;
      addToCart(id);
    });
  });
}

function removeItemFromCart() {
  const items = document.querySelectorAll('.cart__item');
  items.forEach(item => item.addEventListener('click', () => {
    cartItemClickListener(item);
  }));
}

async function loadCartFromStorage() {
  // try {
  //   const storage = await Object.entries(localStorage);
  //   return storage.forEach(item => addToCart(item[0]));
  // } catch (error) {
  //   return error;
  // }
  const storage = Object.entries(localStorage);
  return storage.forEach(item => addToCart(item[0]));
}

function clearCart() {
  const clearButton = document.querySelector('.empty-cart');
  const cartItems = document.querySelector('.cart__items').childNodes;
  const cart = document.querySelector('.cart__items');

  clearButton.addEventListener('click', () => {
    for (let index = cartItems.length - 1; index >= 0; index -= 1) {
      cart.lastElementChild.remove();
    }
    localStorage.clear();
    cartTotalPrice();
  });
}

window.onload = async function onload() {
  await loadCartFromStorage();
  await productList();
  addButton();
  clearCart();
  removeItemFromCart();
};
