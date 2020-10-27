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

function getItemValue(valueStr) {
  let itemPrice = parseInt(valueStr, 10);
  if (valueStr.includes('.')) {
    const [integerStr, decimalStr] = valueStr.split('.');
    const integer = parseInt(integerStr, 10);
    if (decimalStr.length === 1) decimal = parseInt(decimalStr, 10) * 10;
    else {
      decimal = parseInt(decimalStr, 10);
    }
    itemPrice = integer + (decimal / 100);
  }
  return itemPrice;
}
async function updateCartValue() {
  const cartItems = document.querySelectorAll('.cart__item');
  const priceSpan = document.querySelector('.total-price');
  if (cartItems.length === 0) {
    priceSpan.innerHTML = 0;
  } else {
    let totalPrice = 0;
    cartItems.forEach((item) => {
      itemPriceString = item.innerHTML.split('$')[1];
      const itemPrice = getItemValue(itemPriceString);
      totalPrice += itemPrice;
    });
    totalPrice = Math.round(totalPrice * 100) / 100;
    priceSpan.innerHTML = totalPrice;
  }
}

function loadList() {
  for (let index = 0; index < localStorage.length; index += 1) {
    const cartContent = JSON.parse(localStorage.getItem('cart'));
    const cartItems = document.querySelector('.cart__items');
    cartItems.innerHTML = cartContent;
  }
}

function updateList() {
  const cartItems = document.querySelectorAll('.cart__item');
  localStorage.clear();
  if (cartItems.length !== 0) {
    const cartList = cartItems[0].parentNode;
    const cartContent = JSON.stringify(cartList.innerHTML);
    localStorage.setItem('cart', cartContent);
  }
  updateCartValue();
}

function cartItemClickListener(event) {
  event.target.remove();
  updateList();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function clearButtonIni() {
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', (event) => {
    localStorage.clear();
    const listElement = event.target.nextElementSibling;
    listElement.innerHTML = '';
    updateCartValue();
  });
}

const addEvent = (event) => {
  const itemID = event.target.parentNode.firstChild.innerText;
  endpoint = `https://api.mercadolibre.com/items/${itemID}`;
  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      const { id, title, price } = object;
      const productDetails = { sku: id, name: title, salePrice: price };
      const cartList = document.querySelector('.cart__items');
      cartList.appendChild(createCartItemElement(productDetails));
    })
    .then(updateList);
};

function addButtonsEvent() {
  const addButtons = document.querySelectorAll('.item__add');
  addButtons.forEach(button => button.addEventListener('click', addEvent));
}

function fetchProductApi(query) {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
  const section = document.querySelector('.items');
  fetch(endpoint)
    .then((response) => {
      section.innerHTML = '';
      return response.json();
    })
    .then(object => object.results.forEach(({ id, title, thumbnail }) => {
      const newItem = { sku: id, name: title, image: thumbnail };
      const HtmlElement = createProductItemElement(newItem);
      section.appendChild(HtmlElement);
    }))
    .then(addButtonsEvent);
}

window.onload = function onload() {
  fetchProductApi('computador');
  loadList();
  clearButtonIni();
  updateCartValue();
};
