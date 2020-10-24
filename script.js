const cart = document.querySelector('.cart__items');
const emptyCartButton = document.querySelector('.empty-cart');
const totalPrice = document.querySelector('.total-price');
let sumItem = 0;
const loading = document.querySelector('.loading');

emptyCartButton.addEventListener('click', () => {
  cart.innerHTML = '';
});

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function storeCart() {
  localStorage.setItem('cart', cart.innerHTML);
}
function cartItemClickListener(event) {
  cart.removeChild(event.target);
}

async function sumCartItems(salePrice) {
  sumItem += await salePrice;
  totalPrice.innerText = Math.round(sumItem * 100) / 100;
}

function createCartItemElement(computer) {
  const { id: sku, title: name, price: salePrice } = computer;
  const li = document.createElement('li');
  li.className = 'cart__items';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  cart.appendChild(li);
  storeCart();
  sumCartItems(salePrice);
  return li;
}
function fetchComputerItem(id) {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  fetch(endpoint)
    .then(computer => computer.json())
    .then(computer => createCartItemElement(computer));
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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }


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
        loading.innerText = '';
        handleComputerItem(data.results);
      }
    });
};

function initialize() {
  cart.innerHTML = localStorage.cart;
  const cartItems = cart.childNodes;
  cartItems.forEach(item => item.addEventListener('click', cartItemClickListener));
}

window.onload = function onload() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetchDataComputer(endpoint);
  initialize();
};
