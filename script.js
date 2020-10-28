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

const showAlert = (message) => {
  window.alert(message);
};

const updateCart = () => {
  localStorage.setItem('ol', document.querySelector('.cart__items').innerHTML);
  localStorage.setItem('price', document.querySelector('.total-price').innerText);
};

const prices = () => {
  const allItemCart = document.querySelectorAll('.cart__item');
  let sum = 0;
  allItemCart.forEach((li) => {
    sum += parseFloat(li.innerText.split('$')[1]);
  });
  document.querySelector('.total-price').innerText = sum;
};

async function cartItemClickListener(event) {
  await event.target.remove();
  prices();
  updateCart();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const createLoading = () => {
  const container = document.querySelector('.container');
  container.appendChild(createCustomElement('p', 'loading', 'loading...'));
};

const removeLoading = () => {
  const loading = document.querySelector('.loading');
  loading.remove();
};

const fetchAddCart = async (id) => {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  createLoading();
  try {
    const response = await fetch(endpoint);
    const object = await response.json();
    const ol = document.querySelector('.cart__items');
    if (object.error) {
      throw new Error(object.error);
    } else {
      ol.appendChild(createCartItemElement(object));
      removeLoading();
      prices();
    }
  } catch (error) {
    showAlert(error);
  }
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', async function (event) {
    const parentElement = await event.target.parentElement;
    await fetchAddCart(getSkuFromProductItem(parentElement));
    updateCart();
  });
  section.appendChild(button);
  return section;
}

const fetchList = async () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  createLoading();
  try {
    const response = await fetch(endpoint);
    const object = await response.json();
    const items = document.querySelector('.items');
    if (object.error) {
      throw new Error('Um erro ocorreu!');
    } else {
      object.results.forEach((result) => {
        items.appendChild(createProductItemElement(result));
      });
      removeLoading();
    }
  } catch (error) {
    showAlert(error);
  }
};

const loadLocalStorage = () => {
  const ol = document.querySelector('.cart__items');
  const price = document.querySelector('.total-price');
  if (localStorage.price) {
    price.innerText = localStorage.getItem('price');
  }
  if (localStorage.ol) {
    ol.innerHTML = localStorage.getItem('ol');
    ol.querySelectorAll('li').forEach(li => li.addEventListener('click', cartItemClickListener));
  }
};

const emptyCart = () => {
  const btnEmptyCart = document.querySelector('.empty-cart');
  btnEmptyCart.addEventListener('click', function () {
    document.querySelector('.cart__items').innerHTML = '';
    localStorage.clear();
    prices();
  });
};

window.onload = function onload() {
  const span = createCustomElement('span', 'total-price', 0);
  document.querySelector('.cart').appendChild(span);
  fetchList();
  loadLocalStorage();
  emptyCart();
};
