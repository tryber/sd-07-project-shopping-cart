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

const saveCarItens = () => localStorage.setItem('cart', document.querySelector('.cart__items').innerHTML);

const filterNumber = value => value.match(/([0-9.]){1,}$/);

const totalPrice = () => {
  const products = document.querySelectorAll('.cart__item');
  const totalCarPrice = document.querySelector('.total-price');
  const total = [...products].map(product => filterNumber(product.textContent))
    .reduce((acc, curr) => (acc + parseFloat(curr)), 0);
  totalCarPrice.innerText = total;
};

const cartItemClickListener = (event) => {
  event.target.remove();
  saveCarItens();
  totalPrice();
};

const emptyItens = () => {
  const cart = document.querySelector('.cart__items');
  cart.innerHTML = '';
  saveCarItens();
  totalPrice();
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addItemCart = async ({ sku }) => {
  const item = await fetch(`https://api.mercadolibre.com/items/${sku}`)
  .then(data => data.json())
  .then(obj =>
    createCartItemElement({
      sku: obj.id,
      name: obj.title,
      salePrice: obj.price }),
  );
  await document.querySelector('.cart__items').appendChild(item);
  await saveCarItens();
  await totalPrice();
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', () => {
    addItemCart({ sku });
  });
  section.appendChild(button);
  return section;
}

const loadProducts = () => {
  const QUERY = 'computador';
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`;
  fetch(endpoint)
  .then(response => response.json())
  .then((data) => {
    const items = document.querySelector('.items');
    data.results.forEach(({ id, title, thumbnail }) => {
      const item = { sku: id, name: title, image: thumbnail };
      items.appendChild(createProductItemElement(item));
    });
  });
};

window.onload = () => {
  loadProducts();
  const empty = document.querySelector('.empty-cart');
  empty.addEventListener('click', function () {
    emptyItens();
  });
  const cart = document.querySelector('.cart__items');
  cart.innerHTML = localStorage.getItem('cart');
  document.querySelectorAll('li')
  .forEach(product => product.addEventListener('click', cartItemClickListener));
};
