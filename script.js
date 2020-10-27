window.onload = function onload() { };

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const setOrRemoveItemLocalStorage = (state, item, li) => {
  const ol = document.querySelector('.cart__items');
  const index = ol.childNodes.length;
  const key = `itemProduct${index}`;
  const liItem = li;
  if (state === 'add') {
    localStorage.setItem(key, JSON.stringify(item));
    liItem.className = key;
  } else if (state === 'remove') {
    localStorage.removeItem(`${liItem.className}`);
  }
};

/* const setOrRemoveItemLocalStorage = (state, item, id) => {
  if (state === 'add') {
    localStorage.setItem(id, JSON.stringify(item));
  } else if (state === 'remove') {
    localStorage.removeItem(id, JSON.stringify(item));
  }
};*/

/* const setOrRemoveItemLocalStorage = () => {
  const ol = document.querySelector('.cart__items');
  localStorage.setItem('listItens', ol.innerHTML);
}*/

async function updatePrice(operation, priceItem, price = 0) {
  let totalPrice = 0;
  if (operation === 'sum') {
    totalPrice = parseFloat((price + priceItem).toFixed(2));
  } else if (operation === 'subtract') {
    totalPrice = parseFloat((price - priceItem).toFixed(2));
  }
  localStorage.setItem('totalPrice', totalPrice);
  return totalPrice;
}

async function returnPrice(operation, priceItem) {
  const itemPrice = document.querySelector('.total-price');
  const calculationPrice = await updatePrice(operation, priceItem, Number(itemPrice.textContent));
  itemPrice.textContent = calculationPrice;
}

function cartItemClickListener(event, item) {
  const removeItem = (event.path)[0];
  const ol = document.querySelector('.cart__items');
  ol.removeChild(removeItem);
  setOrRemoveItemLocalStorage('remove', item, removeItem);
  returnPrice('subtract', item.salePrice);
}

function createCartItemElement({ sku, name, salePrice }) {
  const item = { sku, name, salePrice };
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', () => cartItemClickListener(event, item));

  return li;
}

const getItemLocalStorage = () => {
  const listItemsStorage = Object.values(localStorage);
  listItemsStorage.pop();
  listItemsStorage.forEach((item) => {
    const { sku, name, salePrice } = JSON.parse(item);
    const createdcart = createCartItemElement({ sku, name, salePrice });
    const ol = document.querySelector('.cart__items');
    ol.appendChild(createdcart);
  });
  const itemPrice = document.querySelector('.total-price');
  const totalPrice = localStorage.getItem('totalPrice');
  itemPrice.innerHTML = totalPrice;
};

/* const getItemLocalStorage = () => {
  const ol = document.querySelector('.cart__items');
  ol.innerHTML = localStorage.getItem('listItens');

  const itemPrice = document.querySelector('.total-price');
  const totalPrice = localStorage.getItem('totalPrice');
  itemPrice.innerHTML = totalPrice;
}*/

const loading = (state) => {
  const sectionItems = document.querySelector('.cart');
  if (state === 'initial') {
    const msgLoading = document.createElement('section');
    msgLoading.className = 'loading';
    msgLoading.textContent = 'Loading...';
    sectionItems.appendChild(msgLoading);
  } else if (state === 'final') {
    const elementLoading = document.querySelector('.loading');
    sectionItems.removeChild(elementLoading);
  }
};

const itemRequisition = (ids) => {
  const endPointProduct = `https://api.mercadolibre.com/items/${ids}`;
  loading('initial');
  fetch(endPointProduct)
    .then(object => object.json())
    .then((product) => {
      const { id: sku, title: name, price: salePrice } = product;
      const item = { sku, name, salePrice };
      const createItem = createCartItemElement(item);
      const ol = document.querySelector('.cart__items');
      ol.appendChild(createItem);
      returnPrice('sum', salePrice);
      setOrRemoveItemLocalStorage('add', item, createItem);
      loading('final');
    })
    .catch((erro) => {
      loading('final');
      return window.alert(erro);
    });
};

function createCustomElement(element, className, innerText, sku) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;

  if (element === 'button') {
    e.addEventListener('click', () => itemRequisition(sku));
  }
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', sku));

  return section;
}

const fetchMercadoLivre = async () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  loading('initial');
  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      const items = document.querySelector('.items');
      const responseEntries = Object.values(object.results);
      responseEntries.forEach((item) => {
        const { id: sku, title: name, thumbnail: image } = item;
        const product = createProductItemElement({ sku, name, image });
        items.appendChild(product);
      });
      loading('final');
    })
    .catch((erro) => {
      loading('final');
      return window.alert(erro);
    });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const removeCart = () => {
  const ol = document.querySelector('.cart__items');
  const totalPrice = document.querySelector('.total-price');
  ol.innerHTML = '';
  totalPrice.innerHTML = 0;
  localStorage.clear();
};

window.onload = function onload() {
  fetchMercadoLivre();
  const buttonEmptyCart = document.querySelector('.empty-cart');
  buttonEmptyCart.addEventListener('click', removeCart);
  getItemLocalStorage();
};
