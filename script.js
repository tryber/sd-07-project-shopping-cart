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

function cartLocalStorage() {
  const lista = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('carrinho', lista);
}

async function getPriceCart(price = 0) {
  let section = document.querySelector('.total-price');
  if (section === null) {
    section = await createCustomElement('section', 'total-price', '');
    section.appendChild(await createCustomElement('span', 'money', price));
    document.querySelector('.cart').appendChild(section);
    localStorage.totalPrice = price;
  } else {
    const elementPrice = section.firstElementChild;
    elementPrice.innerText = (parseFloat(elementPrice.innerText, 10) + price);
    localStorage.totalPrice = elementPrice.innerText;
  }
}

function cartItemClickListener(event) {
  const texto = event.target.innerText;
  valor = -parseFloat(texto.substring(texto.indexOf('$') + 1), 10);
  console.log(valor);
  getPriceCart(valor);
  event.target.remove();
  cartLocalStorage();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  getPriceCart(parseFloat(salePrice));
  return li;
}

function addListElement(item) {
  document.querySelector('.cart__items')
    .appendChild(createCartItemElement(item));
  cartLocalStorage();
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function idButtonEvent() {
  const id = getSkuFromProductItem(event.target.parentNode);
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then(response => response.json())
      .then(object => addListElement(object))
        .catch(error => window.alert(error));
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', idButtonEvent);

  return section;
}


function addItemList(item) {
  const listItem = document.querySelector('.items');
  listItem.appendChild(createProductItemElement(item));
}

function getItemsShopping() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador&limit=10')
    .then(response => response.json())
      .then(({ results }) => {
        results.forEach((item) => {
          addItemList(item);
        });
      })
        .catch(error => window.alert(error));
}

function loadCartStorage() {
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('carrinho');
  const items = document.querySelectorAll('.cart__item');
  getPriceCart(localStorage.totalPrice);
  items.forEach(item => item.addEventListener('click', cartItemClickListener));
}

function eraseAllDatas() {
  document.querySelector('.cart__items').innerHTML = '';
  localStorage.carrinho = '';
  localStorage.totalPrice = 0;
  document.querySelector('.money').innerText = '0';
}

function buttonEraseEvent() {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', eraseAllDatas);
}

window.onload = function onload() {
  getItemsShopping();
  loadCartStorage();
  buttonEraseEvent();
};
