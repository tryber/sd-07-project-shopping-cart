let deleteLoading;
let saveOnStorage;
let itemPrice;
let totalPrice = 0;

const showAlert = message => window.alert(message);

document.addEventListener('DOMContentLoaded', () => {
  const emptyButton = document.querySelector('.empty-cart');
  const cartItems = document.querySelector('.cart__items');
  emptyButton.addEventListener('click', () => {
    cartItems.innerHTML = '';
    const totalPriceSpan = document.querySelector('.total-price');
    totalPrice = 0;
    totalPriceSpan.innerText = Math.round((totalPrice + Number.EPSILON) * 100) / 100;
    localStorage.clear();
  });

  saveOnStorage = () => localStorage.setItem('shoppingList', cartItems.innerHTML);

  deleteLoading = () => {
    const container = document.querySelector('.container');
    const loadingMsg = container.children[0];
    container.removeChild(loadingMsg);
  };
  return {
    deleteLoading,
    saveOnStorage,
  };
});

function calculateTotal(price = 0, op = 0) {
  const totalPriceSpan = document.querySelector('.total-price');
  if (op !== 0) {
    totalPrice -= price;
  } else {
    totalPrice += price;
  }
  localStorage.setItem('Price', totalPriceSpan.innerText = Math.round((totalPrice + Number.EPSILON) * 100) / 100);
}

function cartItemClickListener(event) {
  const valor = event.target.innerText.indexOf('$');
  const itemDeletedPrice = parseFloat(event.target.innerText.slice(valor + 1));
  calculateTotal(itemDeletedPrice, 1);
  event.target.remove();
  saveOnStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const printItemInCart = (object) => {
  const cartItems = document.querySelector('.cart__items');
  const { id, title, price } = object;
  itemPrice = price;

  cartItems.appendChild(
    createCartItemElement({
      sku: id,
      name: title,
      salePrice: price,
    }),
  );
  calculateTotal(itemPrice);
  saveOnStorage();
};

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

const setupApi = async (endpoint, callback, firstDelete) => {
  try {
    const response = await fetch(endpoint);
    const object = await response.json();
    if (firstDelete) firstDelete();
    if (object.error) {
      throw new Error(object.error);
    } else {
      callback(object);
    }
  } catch (error) {
    showAlert(error);
  }
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', (event) => {
    const id = event.target.parentNode.firstChild.innerText;
    const endpoint = `https://api.mercadolibre.com/items/${id}`;
    setupApi(endpoint, printItemInCart);
  });

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(button);

  return section;
}

const printItem = (object) => {
  const items = document.querySelector('.items');
  object.results.forEach(item =>
    items.appendChild(
      createProductItemElement({
        sku: item.id,
        name: item.title,
        image: item.thumbnail,
      }),
    ),
  );
};

window.onload = async function onload() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  await setupApi(endpoint, printItem, deleteLoading);

  const cartItems = document.querySelector('.cart__items');
  cartItems.innerHTML = localStorage.getItem('shoppingList');
  cartItems.childNodes.forEach(product => product.addEventListener('click', cartItemClickListener));

  const totalPriceSpan = document.querySelector('.total-price');
  totalPriceSpan.innerText = localStorage.getItem('Price');
  totalPrice = localStorage.getItem('Price');
};
