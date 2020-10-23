async function calcCart() {
  const listItems = document.querySelectorAll('.cart__item');
  const priceElement = document.querySelector('.total-price');
  const values = [];
  listItems.forEach(element => values.push(element.textContent.split('$')[1]));
  const total = values.reduce((acc, actual) => acc + Number(actual), 0);

  priceElement.textContent = `${total}`;
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
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  event.target.remove();
  calcCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function loading() {
  const loadElement = document.createElement('h2');
  loadElement.classList.add('loading');
  loadElement.textContent = 'loading...';
  document.querySelector('.items').appendChild(loadElement);
}

function endLoad() {
  const loadElement = document.querySelector('.loading');
  loadElement.remove();
}

async function createListProducts() {
  loading();
  const dataComputer = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(resolve => resolve.json());
  endLoad();

  dataComputer.results.forEach((element) => {
    const inputCreate = {};
    inputCreate.sku = element.id;
    inputCreate.name = element.title;
    inputCreate.image = element.thumbnail;
    document.querySelector('.items').appendChild(createProductItemElement(inputCreate));
  });
}

async function addCart(id) {
  const listItems = document.querySelector('.cart__items');
  const dataItem = await fetch(`https://api.mercadolibre.com/items/${id}`)
    .then(resolve => resolve.json());

  const inputCreate = {};
  inputCreate.sku = dataItem.id;
  inputCreate.name = dataItem.title;
  inputCreate.salePrice = dataItem.price;

  listItems.appendChild(createCartItemElement(inputCreate));
}

function saveCart() {
  const listCart = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', listCart);
}

function emptyCart() {
  const listCart = document.querySelector('.cart__items');
  const btnClearCart = document.querySelector('.empty-cart');
  btnClearCart.addEventListener('click', () => {
    listCart.innerHTML = '';
    calcCart();
  });
}

function recoveryCart() {
  const contentList = localStorage.getItem('cart');
  const listItems = document.querySelector('.cart__items');
  listItems.innerHTML = contentList;
  const items = document.querySelectorAll('.cart__item');

  items.forEach(element => element.addEventListener('click', cartItemClickListener));
}

function onAddButtonCart() {
  const buttonsAdd = document.querySelectorAll('.item__add');
  const buttonsSku = document.querySelectorAll('.item__sku');
  buttonsAdd.forEach((button, index) => {
    const idActual = buttonsSku[index].textContent;
    button.addEventListener('click', async () => {
      await addCart(idActual);
      saveCart();
      calcCart();
    });
  });
}

window.onload = async function onload() {
  await createListProducts();
  onAddButtonCart();
  recoveryCart();
  emptyCart();
  calcCart();
};
