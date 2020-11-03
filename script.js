// comentário para o avaliador
const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';

const showAlert = (message) => {
  window.alert(message);
};

const saveLocal = () => {
  const cartList = document.querySelector('.cart__items').outerHTML;
  localStorage.setItem('cart', cartList);
};

const totalPrice = async () => {
  let sum = 0;
  document.querySelectorAll('.cart__item').forEach((item) => {
    sum += parseFloat(item.innerText.split('$')[1]);
  });
  document.querySelector('.total-price').innerText = sum;
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

const loadingScreen = (isloading) => {
  if (isloading) {
    document.body.appendChild(createCustomElement('section', 'loading', 'loading...'));
  } else {
    document.body.removeChild(document.querySelector('.loading'));
  }
};

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
  saveLocal();
  totalPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const requestItemAPI = async (idProduct) => {
  const requestItem = await fetch(`https://api.mercadolibre.com/items/${idProduct}`);
  try {
    const { id, title, price } = await requestItem.json();
    return { sku: id, name: title, salePrice: price };
  } catch (error) {
    showAlert(error);
  }
  return null;
};

const addToCartEvent = (buttons) => {
  buttons.forEach((button) => {
    button.addEventListener('click', async (event) => {
      if (button === event.currentTarget) {
        const itemID = getSkuFromProductItem(button.parentNode);
        const item = await requestItemAPI(itemID);
        document.querySelector('.cart__items').appendChild(createCartItemElement(item));
        saveLocal();
        totalPrice();
      }
    });
  });
};

const addCart = () => {
  const buttons = document.querySelectorAll('.item__add');
  addToCartEvent(buttons);
};

const fetchProductList = async () => {
  try {
    loadingScreen(true);
    const listFetch = await fetch(endpoint);
    const response = await listFetch.json();
    response.results.forEach((item) => {
      const { id: sku, title: name, thumbnail: image } = item;
      const product = createProductItemElement({ sku, name, image });
      document.querySelector('.items').appendChild(product);
    });
  } catch (error) {
    showAlert(error);
  }
  loadingScreen(false);
  addCart();
};

const loadLocal = () => {
  if (localStorage.getItem('cart') !== null) {
    document.querySelector('.cart__items').outerHTML = localStorage.getItem('cart');
    const items = document.querySelectorAll('.cart__item');
    items.forEach(item => item.addEventListener('click', cartItemClickListener));
    totalPrice();
  }
};

const emptyCart = () => {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    document.querySelector('.cart__items').innerText = '';
    totalPrice();
    localStorage.clear();
  });
};

window.onload = function onload() {
  fetchProductList();
  loadLocal();
  emptyCart();
  totalPrice();
};
