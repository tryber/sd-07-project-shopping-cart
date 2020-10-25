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
function purchasesHistoric() {
  const cartList = document.querySelector('.cart__items');
  localStorage.setItem('list', cartList.innerHTML);
}
async function totalPrice() {
  const items = document.getElementsByClassName('cart__item');
  let sum = 0;
  for (let index = 0; index < items.length; index += 1) {
    const element = items[index].innerText;
    sum += Number(element.split('$')[1]);
  }

  const total = document.getElementsByClassName('total-price')[0];

  total.innerText = parseFloat(sum.toFixed(2));
}

function cartItemClickListener(event) {
  const productList = document.querySelector('.cart__items');
  const itemSelected = event.target;
  productList.removeChild(itemSelected);
  purchasesHistoric();
  totalPrice();
}
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
function addCartItem(event) {
  const itemID = event.path[1].childNodes[0].innerHTML;
  const url = `https://api.mercadolibre.com/items/${itemID}`;
  fetch(url)
  .then(response => response.json())
  .then((product) => {
    const productFormated = {
      sku: product.id,
      name: product.title,
      salePrice: product.price,
    };
    const shoppingCartList = document.querySelector('.cart__items');
    shoppingCartList.appendChild(createCartItemElement(productFormated));
    purchasesHistoric();
    totalPrice();
  });
}
function createItemList() {
  const containerItems = document.querySelector('.items');
  const loadingText = document.querySelector('.loading');
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  fetch(url)
  .then(response => response.json())
  .then(data => data.results.forEach((product) => {
    const productFormated = {
      sku: product.id,
      name: product.title,
      image: product.thumbnail,
    };
    const productList = document.querySelector('.items');
    const newProduct = createProductItemElement(productFormated);
    newProduct.addEventListener('click', addCartItem);
    productList.appendChild(newProduct);
  }))
  .finally(() => containerItems.removeChild(loadingText));
}
function clearList() {
  const cartList = document.querySelector('.cart__items');
  cartList.innerHTML = '';
  purchasesHistoric();
  totalPrice();
}
function loadingMessage() {
  const containerItems = document.querySelector('.items');
  const title = document.createElement('h1');
  title.className = 'loading';
  title.innerText = 'loading...';
  title.style.color = 'red';
  containerItems.appendChild(title);
}
function recoverLocalStorage() {
  const cartList = document.querySelector('.cart__items');
  cartList.innerHTML = localStorage.list;
  Array.from(document.getElementsByClassName('cart__item')).forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
}
window.onload = function onload() {
  loadingMessage();
  createItemList();
  recoverLocalStorage();
  totalPrice();
  const buttonEmptyCart = document.querySelector('.empty-cart');
  buttonEmptyCart.addEventListener('click', clearList);
};
