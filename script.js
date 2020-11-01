function showError(message) {
  return window.alert(message);
}

function autoSave() {
  const cartItems = document.querySelector('.cart__items');
  localStorage.setItem('saved-cart', cartItems.innerHTML);
}
// Solução sugerida pelo colega Stefano Branz da turma 6
async function cartItemsTotalPrice() {
  const cartItems = document.querySelectorAll('.cart__item');
  const cartItemsTotalPrices = document.querySelector('.total-price');
  let sumOfCartItemsPrice = 0;
  cartItems.forEach((item) => {
    const itemPrice = parseFloat(item.innerHTML.split('$')[1]);
    sumOfCartItemsPrice += itemPrice;
  });
  cartItemsTotalPrices.innerHTML = sumOfCartItemsPrice;
}

function emptyCart() {
  const emptyShopingCart = document.querySelector('.empty-cart');
  const cartItems = document.querySelector('.cart__items');
  emptyShopingCart.addEventListener('click', () => {
    cartItems.innerHTML = '';
    localStorage.clear();
  });
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

function pageLoading() {
  document.querySelector('.container').appendChild(
    createCustomElement('h1', 'loading', 'loading...'));
  setTimeout(() => {
    document.querySelector('.container').removeChild(
      document.querySelector('.loading'));
  }, 300);
}

function getSkuFromProductItem(item) {
  return item.target.parentNode.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const cartItem = event.target.parentNode;
  cartItem.removeChild(event.target);
  cartItemsTotalPrice();
  autoSave();
}

function savedCart() {
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerHTML = localStorage.getItem('saved-cart');
  const li = document.querySelectorAll('li');
  li.forEach((element) => {
    element.addEventListener('click', cartItemClickListener);
  });
  cartItemsTotalPrice();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addToCart(sku) {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(result => result.json())
    .then((object) => {
      pageLoading();
      const cartItems = document.querySelector('.cart__items');
      cartItems.appendChild(createCartItemElement(object));
      cartItemsTotalPrice();
      autoSave();
    })
    .catch(erro => showError(erro));
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const addCartBtn = section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  addCartBtn.addEventListener('click', (event) => {
    addToCart(getSkuFromProductItem(event));
  });
  return section;
}

async function searchProducts(prdoduct) {
  const items = document.querySelector('.items');
  await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${prdoduct}`)
    .then(result => result.json())
    .then((object) => {
      pageLoading();
      object.results.forEach((element) => {
        const item = createProductItemElement(element);
        items.appendChild(item);
      });
    })
    .catch(erro => showError(erro));
}

window.onload = function onload() {
  const prdoduct = 'computador';
  searchProducts(prdoduct);
  emptyCart();
  savedCart();
};
