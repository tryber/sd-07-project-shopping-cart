const displayAlert = (message) => {
  window.alert(message);
};

const showTotalPrice = (total) => {
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerHTML = total;
};

const sumPrices = () => {
  const priceitems = document.querySelectorAll('[data-price-items]');
  const total = Array.from(priceitems, ({ dataset: { priceItems } }) =>
  Number(priceItems)).reduce((acc, price) => acc + price, 0);
  return total;
};
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText, sku = null) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.dataset.id = sku;
  }
  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', sku));

  return section;
}


const productOnScreen = async (vector) => {
  const items = document.querySelector('.items');
  await vector.forEach(product => items.appendChild(createProductItemElement(product)));
};

const fecthComputerAsyncAwait = async () => {
  const endpoints = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  try {
    const response = await fetch(endpoints);
    const objekt = await response.json();
    if (objekt.error) {
      throw new Error(objekt.error);
    } else {
      document.querySelector('h3').remove();
      productOnScreen(objekt.results);
    }
  } catch (error) {
    displayAlert(error);
  }
};

function saveInLocalStorage() {
  const cartItems = document.querySelector('.cart__items');
  localStorage.setItem('cartItems', cartItems.innerHTML);
}

function goBackInsideCart() {
  const cartItems1 = document.querySelector('.cart__items');
  const cart = (localStorage.getItem('cartItems'));
  if (cart) { cartItems1.innerHTML = cart; }
}

function cartItemClickListener(event) {
  const cartItems = document.querySelector('.cart__items');
  cartItems.removeChild(event.target);
  saveInLocalStorage();
  showTotalPrice(sumPrices());
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const cartItems = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  li.dataset.priceItems = salePrice;
  cartItems.appendChild(li);
  saveInLocalStorage();
  return li;
}

async function addCartListById(elementId) {
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(createCartItemElement(elementId));
  await showTotalPrice(sumPrices());
}

const fecthIdAsyncAwait = async (id) => {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  try {
    const response = await fetch(endpoint);
    const object = await response.json();
    if (object.error) {
      throw new Error(object.error);
    } else {
      addCartListById(object);
    }
  } catch (error) {
    displayAlert(error);
  }
};
// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function catchAllProductEvent() {
  const addCart = document.querySelectorAll('.item__add');
  addCart.forEach((element) => {
    element.addEventListener('click', (event) => {
      const idSku = event.target.dataset.id;
      fecthIdAsyncAwait(idSku);
    });
  });
}

function emptyCar() {
  const cartItems = document.querySelector('.cart__items');
  const emptyCart = document.querySelector('.empty-cart');
  emptyCart.addEventListener('click', () => {
    cartItems.innerHTML = '';
    showTotalPrice(sumPrices());
  });
}
const awaitLoading = () => {
  const tagHeader = document.querySelector('header');
  const tagh3 = document.createElement('h3');
  tagh3.innerHTML = 'loading...';
  tagh3.className = 'loading';
  tagHeader.appendChild(tagh3);
};

window.onload = async function onload() {
  awaitLoading();
  await fecthComputerAsyncAwait();
  goBackInsideCart();
  catchAllProductEvent();
  emptyCar();
  showTotalPrice(sumPrices());
};

// Referência bibliográfica
// https://github.com/tryber/sd-07-project-shopping-cart/pulls/EduSouza-programmer
// https://www.youtube.com/watch?v=SB9PQrOJVz4
// https://www.youtube.com/watch?v=45XFqfbCVrE
