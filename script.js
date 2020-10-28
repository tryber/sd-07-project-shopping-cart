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

function totalPriceElement() {
  const cartItems = document.querySelector('.cart__items').childNodes;
  let sum = 0;
  cartItems.forEach((item) => {
    const itemPrice = parseFloat(item.innerHTML.split('$')[1]);
    sum += itemPrice;
  });
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerHTML = `${sum}`;
}

function cartItemClickListener(event) {
  event.target.remove();
  const cart = document.querySelector('.cart__items');
  localStorage.setItem('cart', cart.innerHTML);
  totalPriceElement();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  const url = `https://api.mercadolibre.com/items/${sku}`;
  button.addEventListener('click', () => {
    fetch(url)
      .then(response => response.json())
      .then((object) => {
        const { id, title, price } = object;
        const cartItem = createCartItemElement({ sku: id, name: title, salePrice: price });
        const cartList = document.querySelector('.cart__items');
        cartList.appendChild(cartItem);
        localStorage.setItem('cart', cartList.innerHTML);
        totalPriceElement();
      });
  });
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(button);

  return section;
}

function fetchLocalStorage() {
  const cart = document.querySelector('.cart__items');
  cart.innerHTML = localStorage.getItem('cart');
  cart.childNodes.forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
  totalPriceElement();
}

function createProductsList() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const sectionItems = document.querySelector('.items');
  fetch(url)
    .then(response => response.json())
    .then((response) => {
      const loading = document.querySelector('.loading');
      loading.remove();
      response.results.forEach((item) => {
        const { id: sku, title: name, thumbnail: image } = item;
        const productItem = createProductItemElement({ sku, name, image });
        sectionItems.appendChild(productItem);
      });
    });
}

function clearCart() {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    const cart = document.querySelector('.cart__items');
    cart.innerHTML = '';
    localStorage.setItem('cart', cart.innerHTML);
    totalPriceElement();
  });
}

window.onload = function onload() {
  createProductsList();
  fetchLocalStorage();
  clearCart();
};
