function storeCart() {
  const cart = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', cart);
}

async function updatePrices() {
  const cartItens = document.querySelectorAll('.cart__item');
  const total = document.querySelector('.total-price');
  let totalPrice = 0;
  cartItens.forEach((item) => {
    const preco = item.innerText.match(/\bPRICE.*/)[0].slice(8);
    totalPrice += Number(preco);
  });
  total.innerText = totalPrice;
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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
}

function appendProducts(products) {
  const items = document.querySelector('.items');
  products.forEach((product) => {
    items.appendChild(
      createProductItemElement({
        sku: product.id,
        name: product.title,
        image: product.thumbnail,
      }),
    );
  });
}

function addClickProducts(selector, action) {
  const buttons = document.querySelectorAll(selector);
  buttons.forEach((element) => {
    element.addEventListener('click', action);
  });
}

function cartItemClickListener(event) {
  const cartItems = document.querySelector('.cart__items');
  cartItems.removeChild(event.target);
  storeCart();
  updatePrices();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = sku;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addToCart(event) {
  const id = event.target.parentNode.firstChild.innerText;
  const cartItems = document.querySelector('.cart__items');
  const productId = await fetch(
    `https://api.mercadolibre.com/items/${id}`,
  ).then(r => r.json());
  const objAdd = { sku: id, name: productId.title, salePrice: productId.price };
  cartItems.appendChild(createCartItemElement(objAdd));
  storeCart();
  updatePrices();
}

function addShowCase(dataApi) {
  appendProducts(dataApi);
  addClickProducts('.item__add', addToCart);
}

function retrieveCart() {
  const cartStore = localStorage.getItem('cart');
  if (cartStore != null) {
    const cartItems = document.querySelector('.cart__items');
    cartItems.innerHTML = cartStore;
    addClickProducts('.cart__item', cartItemClickListener);
  }
}

function emptyCart() {
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerHTML = '';
  updatePrices();
}

async function loadPage() {
  const loading = document.querySelector('.loading');
  const buttonEmptyCart = document.querySelector('.empty-cart');
  buttonEmptyCart.addEventListener('click', emptyCart);
  const data = await fetch(
    'https://api.mercadolibre.com/sites/MLB/search?q=computador',
  )
    .then(r => r.json())
    .then(r => r.results);
  addShowCase(data);
  retrieveCart();
  updatePrices();
  loading.remove();
}

window.onload = function onload() {
  loadPage();
};
