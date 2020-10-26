let cartStore = [];

let totalPrice = 0;

const pricesTotal = async () => {
  const totalPriceDiv = document.getElementsByClassName('total-price')[0];

  totalPrice = await cartStore.reduce((acc, current) => acc + current.salePrice, 0);

  totalPriceDiv.innerText = `${parseFloat(totalPrice.toFixed(2))}`;
};

const storage = {
  get() {
    return JSON.parse(localStorage.getItem('store'));
  },
  save() {
    localStorage.setItem('store', JSON.stringify(cartStore));
  },
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

function cartItemClickListener(event) {
  const ol = document.querySelector('.cart__items');
  ol.removeChild(event.target);
  const sku = event.target.children[0].innerText;
  cartStore = cartStore.filter(cart => cart.sku !== sku);
  storage.save();
  pricesTotal();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerHTML = `SKU: <span>${sku}</span> | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const handlerCartInHtml = (cart) => {
  const ol = document.querySelector('.cart__items');
  const cartItem = {};
  cartItem.sku = cart.id;
  cartItem.name = cart.title;
  cartItem.salePrice = cart.price;

  const li = createCartItemElement(cartItem);
  ol.appendChild(li);

  cartStore.push(cartItem);
  storage.save();
};

const errorLog = (message) => {
  console.log(message);
};

const fetchShoppingCart = async (id) => {
  try {
    const api = await fetch(`https://api.mercadolibre.com/items/${id}`);
    const response = await api.json();

    handlerCartInHtml(response);
    await pricesTotal();
  } catch (error) {
    errorLog(error);
  }
};

function addItemInStore(event) {
  const idCart = event.target.parentNode.children[0].children[0].innerText;

  fetchShoppingCart(idCart);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  const div = createCustomElement('div', 'title-image', '');
  div.appendChild(createCustomElement('span', 'item__sku', sku));
  div.appendChild(createCustomElement('span', 'item__title', name));
  div.appendChild(createProductImageElement(image));
  section.appendChild(div);
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', addItemInStore);
  section.appendChild(button);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const handlerCartsInHtml = (carts) => {
  carts.forEach((cart) => {
    const sessionItems = document.getElementsByClassName('items')[0];
    const cart1 = {};
    cart1.sku = cart.id;
    cart1.name = cart.title;
    cart1.image = cart.thumbnail;
    const session = createProductItemElement(cart1);
    sessionItems.appendChild(session);
  });
};

const loading = {
  add() {
    const body = document.getElementsByTagName('body')[0];
    const divLoad = createCustomElement('div', 'loading-content', '');
    divLoad.appendChild(createCustomElement('h1', 'loading', 'loading...'));
    body.appendChild(divLoad);
  },
  remove() {
    const body = document.getElementsByTagName('body')[0];
    const load = document.getElementsByClassName('loading-content')[0];
    body.removeChild(load);
  },
};

const fetchShoppingCarts = async (query = 'computador') => {
  try {
    loading.add();
    const api = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
    const response = await api.json();
    loading.remove();
    handlerCartsInHtml(response.results);
  } catch (error) {
    errorLog(error);
  }
};

const addEventEmptyCarts = () => {
  const buttonEmptyCart = document.getElementsByClassName('empty-cart')[0];

  buttonEmptyCart.addEventListener('click', () => {
    const ol = document.querySelector('.cart__items');
    ol.innerHTML = '';
  });
};

window.onload = function onload() {
  fetchShoppingCarts();

  if (storage.get()) {
    const getCartStore = storage.get();

    getCartStore.forEach((cart) => {
      handlerCartInHtml({
        id: cart.sku,
        title: cart.name,
        price: cart.salePrice,
      });
    });
  }

  pricesTotal();
  addEventEmptyCarts();
};
