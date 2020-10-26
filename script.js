const cart = document.querySelector('.cart__items');
const emptyCartButton = document.querySelector('.empty-cart');
const totalPrice = document.querySelector('.total-price');
let sumItem = 0;

emptyCartButton.addEventListener('click', () => {
  cart.innerHTML = '';
  totalPrice.innerText = 0;
  sumItem = 0;
  localStorage.totalPrice = 0;
  localStorage.cart = cart.innerHTML;
});

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function deleteLoading() {
  const asideContainer = document.querySelector('.cart-container');
  const loadingParagraph = document.querySelector('.loading');

  asideContainer.removeChild(loadingParagraph);
}

function loading() {
  const asideContainer = document.querySelector('.cart-container');
  const loadingParagraph = document.createElement('p');
  loadingParagraph.innerText = 'loading...';
  loadingParagraph.className = 'loading';
  asideContainer.appendChild(loadingParagraph);
}


async function updatePrice() {
  const data = cart.childNodes;
  const cartItems = data;
  const cartList = [...cartItems];
  if (cartList.length > 0) {
    const sumPrice = cartList.map(element => element.innerText.split('$'))
    .map(element => parseFloat(element[1]))
    .reduce((acc, nextElement) => acc + nextElement, 0);
    sumItem = sumPrice;
    localStorage.totalPrice = sumPrice;
    totalPrice.innerText = sumPrice;
  } else {
    sumItem = 0;
    localStorage.totalPrice = 0;
    totalPrice.innerText = 0;
  }
}

function storeCart() {
  localStorage.setItem('cart', cart.innerHTML);
  localStorage.setItem('totalPrice', sumItem);
  updatePrice();
  return sumItem;
}

function cartItemClickListener(event) {
  cart.removeChild(event.target);
  storeCart();
  updatePrice();
}

function createCartItemElement(computer) {
  const { id: sku, title: name, price: salePrice } = computer;
  const li = document.createElement('li');
  li.className = 'cart__items';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  cart.appendChild(li);
  storeCart();
  return li;
}

function fetchComputerItem(id) {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  fetch(endpoint)
    .then(computer => computer.json())
    .then((computer) => {
      if (computer) {
        createCartItemElement(computer);
        updatePrice();
      } else {
        reject(new Error('endpoint não existe'));
      }
    });
}
function isButton(tag, element) {
  if (tag === 'button') {
    element.addEventListener(('click'), () => {
      const parent = element.parentNode;
      const id = parent.firstChild.innerText;
      fetchComputerItem(id);
    });
  }
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  isButton(element, e);
  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const container = document.querySelector('.container');
  const section = document.createElement('section');
  section.className = 'item';
  container.appendChild(section);


  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));

  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const handleComputerItem = (object) => {
  object.forEach((computer) => {
    createProductItemElement(computer);
  });
};

const fetchDataComputer = (endpoint) => {
  fetch(endpoint)
    .then(data => data.json())
    .then((data) => {
      if (data) {
        deleteLoading();
        handleComputerItem(data.results);
      } else {
        reject(new Error('endpoint não existe'));
      }
    });
};
function initialize() {
  if (localStorage.cart && localStorage.totalPrice) {
    cart.innerHTML = localStorage.cart;
  }
  const cartItems = cart.childNodes;
  cartItems.forEach(item => item.addEventListener('click', cartItemClickListener));
}

window.onload = function onload() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  loading();
  fetchDataComputer(endpoint);
  initialize();
  updatePrice();
};
