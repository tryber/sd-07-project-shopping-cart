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

async function totalCart() {
  const promise = new Promise(function (resolve) {
    const cart = document.querySelector('.cart__items').childNodes;
    let sum = 0;
    cart.forEach((item) => {
      const priceValue = parseFloat(item.innerHTML.split('$')[1]);
      sum += priceValue;
    });
    resolve(sum);
  });
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerHTML = await promise;
}

function cartItemClickListener(event) {
  event.target.remove();
  const currentCart = document.querySelector('.cart__items');
  localStorage.setItem('cart', currentCart.innerHTML);
  totalCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  const addButtonCart = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  const link = `https://api.mercadolibre.com/items/${sku}`;
  addButtonCart.addEventListener('click', () => {
    fetch(link)
      .then(response => response.json())
      .then((obj) => {
        const { id, title, price } = obj;
        const cartObj = createCartItemElement({ sku: id, name: title, salePrice: price });
        const cartItems = document.querySelector('.cart__items');
        cartItems.appendChild(cartObj);
        localStorage.setItem('cart', cartItems.innerHTML);
        totalCart();
      });
  });
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(addButtonCart);

  return section;
}

function loadCartLocal() {
  const addLocalStorage = document.querySelector('.cart__items');
  addLocalStorage.innerHTML = localStorage.getItem('cart');
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const products = () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const loading = document.createElement('div');
  const container = document.querySelector('.container');
  loading.className = 'loading';
  loading.innerHTML = 'Processando...';
  container.appendChild(loading);
  fetch(endpoint)
    .then(response => response.json()).then((data) => {
      const items = document.querySelector('.items');
      data.results.forEach((product) => {
        const { id: sku, title: name, thumbnail: image } = product;
        const item = createProductItemElement({ sku, name, image });
        items.appendChild(item);
      });
      const loadingElement = document.querySelector('.loading');
      loadingElement.remove();
    });
};

const emptyCart = () => {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    document.querySelector('.cart__items').innerText = '';
    localStorage.clear();
  });
};

window.onload = function onload() {
  products();
  loadCartLocal();
  totalCart();
  emptyCart();
};
