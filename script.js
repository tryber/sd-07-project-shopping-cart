function saveStorage() {
  const cartList = document.querySelector('.cart__items');
  localStorage.setItem('itensSaved', cartList.innerHTML);
}

function getStorage() {
  const cartList = document.querySelector('.cart__items');
  cartList.innerHTML = localStorage.getItem('itensSaved');
}

function emptyCart() {
  const ol = document.querySelector('.cart__items');
  ol.innerHTML = '';
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerHTML = 0;
  saveStorage();
}

function clearCartButton() {
  const buttonCleanAll = document.querySelector('.empty-cart');
  buttonCleanAll.addEventListener('click', emptyCart);
}

const priceTotal = () => {
  let summation = 0;
  const allItensInCart = document.querySelectorAll('.cart__item');
  allItensInCart.forEach((element) => {
    summation += parseFloat(element.innerHTML.split('$')[1]);
  });
  document.querySelector('.total-price').innerText = summation;
};

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

async function cartItemClickListener(event) {
  const li = event.target;
  li.remove();
  await saveStorage();
  await priceTotal();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const fetchId = async (id) => {
  const apiRequest = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const body = await apiRequest.json();
  const li = document.querySelector('.cart__items');
  li.appendChild(createCartItemElement(body));
  saveStorage();
  priceTotal();
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', async (event) => {
    const parent = await event.target.parentElement;
    await fetchId(getSkuFromProductItem(parent));
    await priceTotal();
  });
  section.appendChild(button);

  return section;
}

const request = async () => {
  const selectorItems = document.querySelector('.items');
  selectorItems.appendChild(createCustomElement('h1', 'loading', 'loading...'));
  const endPoint = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const jsonObject = await endPoint.json();
  const results = jsonObject.results;
  selectorItems.removeChild(selectorItems.firstChild);
  results.forEach((productList) => {
    const { id, title, thumbnail } = productList;
    const product = { sku: id, name: title, image: thumbnail };
    selectorItems.appendChild(createProductItemElement(product));
  });
  const elementPrice = createCustomElement('span', 'total-price', 0);
  const cartItems = document.querySelector('.cart');
  cartItems.appendChild(elementPrice);
};

window.onload = function onload() {
  request();
  getStorage();
  clearCartButton();
};
