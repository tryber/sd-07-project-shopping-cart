function getLocalStorage() {
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('cartList');
}

async function setLocalStorage() {
  localStorage.clear();
  const cartList = await document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cartList', cartList);
}

function total() {
  let totalPrice = 0;
  const totalPricePlace = document.querySelector('.total-price');
  const cartList = document.querySelectorAll('.cart__item');
  cartList.forEach((item) => { totalPrice += parseFloat(item.innerText.split('$')[1]); });
  totalPricePlace.innerText = totalPrice;
}

function cleanCart() {
  const cartListCleanButton = document.querySelector('.empty-cart');
  const cartList = document.querySelector('.cart__items');
  cartListCleanButton.addEventListener('click', () => {
    cartList.innerHTML = '';
    localStorage.clear();
    total();
  });
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function showTotalPrice() {
  const cart = document.querySelector('.cart');
  cart.appendChild(createCustomElement('span', 'total-price', 0));
}

async function cartItemClickListener(event) {
  event.target.remove('');
  await setLocalStorage();
  await total();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addProductInCart(event) {
  const cartList = document.querySelector('.cart__items');
  const selectedItem = event.target.parentNode;
  const infosSelectedItem = selectedItem.querySelector('.item__sku');
  const itemId = infosSelectedItem.innerHTML;
  const endpoint = `https://api.mercadolibre.com/items/${itemId}`;
  fetch(endpoint)
    .then(response => response.json())
    .then(({ id: sku, title: name, price: salePrice }) => {
      const sale = { sku, name, salePrice };
      cartList.appendChild(createCartItemElement(sale));
      setLocalStorage();
      total();
    });
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', addProductInCart);
  section.appendChild(button);
  return section;
}

async function start() {
  const itemsSection = document.querySelector('.items');
  itemsSection.appendChild(createCustomElement('h1', 'loading', 'loading...'));
  const query = 'computador';
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
  await fetch(endpoint)
    .then(response => response.json())
    .then(searchInfos => searchInfos.results)
    .then(results => results.forEach((element) => {
      const sale = {
        sku: element.id,
        name: element.title,
        image: element.thumbnail,
        salePrice: element.price,
      };
      itemsSection.appendChild(createProductItemElement(sale));
    }));
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('cart');
  itemsSection.removeChild(itemsSection.firstChild);
}

window.onload = async function onload() {
  await start();
  cleanCart();
  showTotalPrice();
  getLocalStorage();
  total();
};
