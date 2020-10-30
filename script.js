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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function saveLocalStorage() {
  const saveCart = document.querySelector('.cart__items').outerHTML;
  localStorage.setItem('saveCart', saveCart);
}

function cartItemClickListener(event) {
  const cartItems = document.querySelectorAll('.cart__items');
  event.target.remove(cartItems);
  saveLocalStorage();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addLoading = () => {
  const sectionCart = document.querySelector('.cart');
  sectionCart.appendChild(createCustomElement('p', 'loading', 'Loading'));
};

const removeLoading = () => {
  const loading = document.querySelector('.loading');
  loading.remove();
};

function addProductCart(button) {
  const idButton = getSkuFromProductItem(button.target.parentElement);
  const endpoint = `https://api.mercadolibre.com/items/${idButton}`;
  addLoading();
  fetch(endpoint)
    .then(response => response.json())
    .then((data) => {
      const addChild = document.querySelector('.cart__items');
      addChild.appendChild(createCartItemElement(data));
      removeLoading();
      saveLocalStorage();
    });
}

function createItem(item) {
  const producto = document.querySelector('.items');
  producto.appendChild(item);
}

function fetchContent() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  addLoading();
  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      object.results.forEach(data => createItem(createProductItemElement(data)));
      removeLoading();
      const buttonAddProducto = document.querySelectorAll('.item__add');
      for (let i = 0; i < buttonAddProducto.length; i += 1) {
        buttonAddProducto[i].addEventListener('click', addProductCart);
      }
    });
}

function emptyCart() {
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerText = '';
  saveLocalStorage();
}

function emptyButton() {
  const emptyCartButton = document.querySelector('.empty-cart');
  emptyCartButton.addEventListener('click', emptyCart);
}

function loadLocalStorage() {
  if (localStorage.length !== 0) {
    const ol = document.querySelector('.cart__items');
    ol.outerHTML = localStorage.getItem('saveCart');
    const items = document.querySelectorAll('.cart__item');
    items.forEach(item => item.addEventListener('click', cartItemClickListener));
  }
}

window.onload = function onload() {
  fetchContent();
  emptyButton();
  loadLocalStorage();
};
