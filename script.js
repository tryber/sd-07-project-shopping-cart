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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function updateCartItems() {
  localStorage.setItem('cart', document.querySelector('.cart__items').innerHTML);
  localStorage.setItem('price', document.querySelector('.total-price').innerText);
}

function prices() {
  const cartItem = document.querySelectorAll('.cart__item');
  let sumPriceItems = 0;
  cartItem.forEach((liItem) => {
    sumPriceItems += parseFloat(liItem.innerText.split('$')[1]);
  });
  document.querySelector('.total-price').innerText = sumPriceItems;
}

function cartItemClickListener(event) {
  event.target.remove();
  prices();
  updateCartItems();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createLoading() {
  const loading = createCustomElement('p', 'loading', 'loading...');
  const container = document.querySelector('.container');
  container.appendChild(loading);
}

function removeLoading() {
  const loading = document.querySelector('.loading');
  const container = document.querySelector('.container');
  container.removeChild(loading);
}

async function addItemCart(itemId) {
  const urlItemEndpoint = `https://api.mercadolibre.com/items/${itemId}`;
  createLoading();
  try {
    const response = await fetch(urlItemEndpoint);
    const objectDataItem = await response.json();
    const listOl = document.querySelector('.cart__items');

    if (objectDataItem.error) {
      throw new Error(objectDataItem.error);
    } else {
      listOl.appendChild(createCartItemElement(objectDataItem));
      localStorage.setItem('cart', listOl.innerHTML);
      removeLoading();
      prices();
    }
  } catch (error) {
    alert(error);
  }
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const buttonAddItem = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  buttonAddItem.addEventListener('click', function (event) {
    const item = event.target.parentElement;
    addItemCart(getSkuFromProductItem(item));
  });

  section.appendChild(buttonAddItem);
  return section;
  // aqui segui a mesma lógica do Tiago Esdras, no dia do fechamento (último dia do projeto).
}

async function loadProducts() {
  const urlEndpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  createLoading();
  try {
    const response = await fetch(urlEndpoint);
    const objectData = await response.json();

    if (objectData.error) {
      throw new Error(objectData.error);
    } else {
      const items = document.querySelector('.items');
      objectData.results.forEach((product) => {
        const { id: sku, title: name, thumbnail: image } = product;
        const item = createProductItemElement({ sku, name, image });
        items.appendChild(item);
      });
      removeLoading();
    }
  } catch (error) {
    alert(error);
  }
}

function loadCartItems() {
  const listOl = document.querySelector('.cart__items');
  const cartItems = localStorage.getItem('cart');
  if (cartItems) listOl.innerHTML = cartItems;
}

function emptyCartItems() {
  const buttonEmptyCartItems = document.querySelector('.empty-cart');
  buttonEmptyCartItems.addEventListener('click', function () {
    document.querySelector('.cart__items').innerHTML = '';
    localStorage.clear();
    prices();
  });
}

window.onload = function onload() {
  loadProducts();
  loadCartItems();
  emptyCartItems();
};
