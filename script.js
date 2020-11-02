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

const savingCartStatus = () => {
  const statusCart = document.querySelector('.cart__items');
  localStorage.setItem('cartItem', statusCart.innerHTML);
};

const totalPriceField = () => {
  const totalPriceLocation = document.querySelector('.cart');
  const labelPrice = document.createElement('div');
  const totalPrice = document.createElement('span');
  labelPrice.className = 'label-price';
  labelPrice.innerHTML = 'Total price: R$ ';
  totalPrice.className = 'total-price';
  labelPrice.appendChild(totalPrice);
  return totalPriceLocation.appendChild(labelPrice);
};

const summationPrice = () => {
  const itemsInCart = document.querySelectorAll('.cart__item');
  const summationResult = document.querySelector('.total-price');
  let summation = 0;
  itemsInCart.forEach((item) => {
    summation += parseFloat(item.innerHTML.split('$')[1]);
  });
  summationResult.innerHTML = summation;
};

function cartItemClickListener(event) {
  event.target.remove();
  savingCartStatus();
  summationPrice();
}

const loadingCartStatus = () => {
  const cartData = document.querySelector('.cart__items');
  cartData.innerHTML = localStorage.getItem('cartItem');
  const cartItemList = cartData.querySelectorAll('li');
  cartItemList.forEach(cartItem => cartItem.addEventListener('click', cartItemClickListener));
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function loadingMessage() {
  const messageLocation = document.querySelector('.container');
  const loading = document.createElement('div');
  loading.className = 'loading';
  loading.innerHTML = 'loading...';
  return messageLocation.appendChild(loading);
}

function removeLoadingMessage() {
  const messageRemove = document.querySelector('.loading').remove();
  return messageRemove;
}

const addItemToCart = async (id) => {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  try {
    loadingMessage();
    const response = await fetch(endpoint);
    const object = await response.json();
    const cartList = document.querySelector('.cart__items');
    if (object.error) {
      throw new Error(object.error);
    } else {
      cartList.appendChild(createCartItemElement(object));
      summationPrice();
      savingCartStatus();
      removeLoadingMessage();
    }
  } catch (error) {
    showError(error);
  }
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function capturingItemId(event) {
  const targetItem = event.target.parentElement;
  const itemId = getSkuFromProductItem(targetItem);
  addItemToCart(itemId);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const addToCartButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  addToCartButton.addEventListener('click', capturingItemId);
  section.appendChild(addToCartButton);

  return section;
}

const findProducts = () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  loadingMessage();
  fetch(endpoint)
    .then(response => response.json())
    .then((data) => {
      const items = document.querySelector('.items');
      data.results.forEach((produto) => {
        const { id: sku, title: name, thumbnail: image } = produto;
        const item = createProductItemElement({ sku, name, image });
        items.appendChild(item);
      });
    })
    .then(removeLoadingMessage);
};

function cleanCart() {
  const cartItemsList = document.querySelector('.cart__items');
  cartItemsList.innerHTML = '';
  summationPrice();
  savingCartStatus();
}

const cleanCartButton = () => {
  const cleanButton = document.querySelector('.empty-cart');
  cleanButton.addEventListener('click', cleanCart);
};

window.onload = function onload() {
  findProducts();
  cleanCartButton();
  loadingCartStatus();
  totalPriceField();
  summationPrice();
};
