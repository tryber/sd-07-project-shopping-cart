window.onload = function onload() { };

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const somarValor = () => {
  const li = document.querySelectorAll('.cart__item');
  console.log(li.innerHTML);
  let totalValue = 0;
  li.forEach((element) => {
    const liPrice = element.innerHTML.split('$');
    totalValue += parseFloat(liPrice[1]);
  });
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerHTML = totalValue;
};

const emptyCart = () => {
  const buttonEmptyCart = document.getElementsByClassName('empty-cart')[0];

  buttonEmptyCart.addEventListener('click', (event) => {
    const cartItensSection = document.querySelector('.cart__items');
    cartItensSection.innerHTML = '';
    localStorage.cartItems = '';
  });
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function saveShoppingcar() {
  const shoppingCar = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('shoppingCar', shoppingCar);
  somarValor();
}

function clearCart() {
  document.getElementsByClassName('cart__items')[0].innerHTML = '';
  saveShoppingcar();
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const item = event.target;
  item.remove();
  saveShoppingcar();
  somarValor();
}
  // Resolução com ajuda na turma 6, requisito 2
function includeItemcart(item) {
  const list = document.querySelector('.cart__items');
  list.appendChild(item);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  somarValor();
  return li;
}

function addEventListenerForItemsLocalStorage(tagHtml, event) {
  const btns = document.querySelectorAll(tagHtml);
  btns.forEach((element) => {
    element.addEventListener('click', event);
  });
}

function calladdEventListener() {
  addEventListenerForItemsLocalStorage('.cart__item', cartItemClickListener);
}

function loadShoppingCar() {
  const shoppingCar = localStorage.getItem('shoppingCar');
  document.querySelector('.cart__items').innerHTML = shoppingCar;
  calladdEventListener();
}

function ItemclickListener(event) {
  const id = event.target.parentNode.firstChild.innerText;
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      const item = createCartItemElement(object);
      includeItemcart(item);
      saveShoppingcar();
    });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', ItemclickListener);
  section.appendChild(button);
  return section;
}
// Aula 9.4 requisito 1
const loadProducts = () => {
  const loading = document.querySelector('.loading');
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(endpoint).then(Response => Response.json()).then((data) => {
    const items = document.querySelector('.items');
    data.results.forEach((produto) => {
      const { id: sku, title: name, thumbnail: image } = produto;
      const item = createProductItemElement({ sku, name, image });
      items.appendChild(item);
      loading.remove();
      somarValor();
    });
  });
};

window.onload = function onload() {
  loadProducts();
  document.getElementsByClassName('empty-cart')[0].addEventListener('click', clearCart);
  loadShoppingCar();
  emptyCart();
};
