window.onload = function onload() { };

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

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const adicionarAoCarrinho = (event) => {
  console.log(event.currentTarget);
  const idSku = getSkuFromProductItem(event.currentTarget);
  const endpoint = `https://api.mercadolibre.com/items/${idSku}`;
  fetch(endpoint).then(Response => Response.json()).then((data) => {
    const { id: sku, title: name, price: salePrice } = data;
    const cartItem = createCartItemElement({ sku, name, salePrice });
    const cartItems = document.querySelector('.cart__items');
    cartItems.appendChild(cartItem);
  });
};

const click = () => {
  const buttons = document.querySelectorAll('.item');
  buttons.forEach((button) => {
    button.addEventListener('click', adicionarAoCarrinho);
  });
};

const loadProducts = async () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  await fetch(endpoint).then(Response => Response.json()).then((data) => {
    const items = document.querySelector('.items');
    data.results.forEach((product) => {
      const { id: sku, title: name, thumbnail: image } = product;
      const item = createProductItemElement({ sku, name, image });
      items.appendChild(item);
    });
  });
};

window.onload = async function onload() {
  await loadProducts();
  click();
};
