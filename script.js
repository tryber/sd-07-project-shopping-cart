

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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
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

function showPrice(sum) {
  const total = document.querySelector('.total-price');
  total.innerHTML = sum;
}

async function sumCart() {
  let sum = 0;
  const saveItens = await JSON.parse(localStorage.getItem('saveCart'));
  if (saveItens) {
    for (let i = 0; i < saveItens.length; i += 1) {
      sum += saveItens[i].price;
    }
  }
  showPrice(sum);
}

function localStogeRemove(id) {
  const saveItens = JSON.parse(localStorage.getItem('saveCart'));
  for (let index = 0; index < saveItens.length; index += 1) {
    if (saveItens[index].id === id) {
      saveItens.splice(index, 1);
      break;
    }
  }
  localStorage.setItem('saveCart', JSON.stringify(saveItens));
  sumCart();
}

function localStogeSave(id, title, price) {
  if (Storage) {
    const saveItens = JSON.parse(localStorage.getItem('saveCart'));
    const items = (saveItens === null) ? [] : saveItens;
    items.push({ id, title, price });
    localStorage.setItem('saveCart', JSON.stringify(items));
  }
  sumCart();
}

function cartItemClickListener(event) {
  const remove = document.querySelector('.cart__items');
  const item = event.target;
  localStogeRemove(item.id);
  remove.removeChild(item);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = sku;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  return li;
}

function innerLoading() {
  const span = document.createElement('span');
  span.className = 'loading';
  span.innerText = 'Loanding...';
  const items = document.querySelector('.items');
  items.appendChild(span);
}

function removeLoading() {
  setTimeout(() => {
    const items = document.querySelector('.items');
    items.removeChild(items.firstChild);
  }, 3000);
}

function addCar(addCarItem) {
  const car = document.querySelector('.cart__items');
  car.addEventListener('click', cartItemClickListener);
  car.appendChild(addCarItem);
}

async function fetchProductItem(sku) {
  const response = await fetch(`https://api.mercadolibre.com/items/${sku}`);
  const item = await response.json();
  const productObject = createCartItemElement(item);
  addCar(productObject);
  localStogeSave(item.id, item.title, item.price);
}

function apendItem(resultItemElement) {
  document.querySelector('.items').appendChild(resultItemElement);
  resultItemElement.addEventListener('click', (event) => {
    const fechsku = event.currentTarget.firstChild.innerText;
    fetchProductItem(fechsku);
  });
}

async function fetchItens(url, endpoint) {
  innerLoading();
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const item = await response.json();
  item.results.forEach(resultItem => apendItem(createProductItemElement(resultItem)));
  removeLoading();
}

function localStogeRecover() {
  if (Storage) {
    const saveItens = JSON.parse(localStorage.getItem('saveCart'));
    const items = (saveItens === null) ? [] : saveItens;
    items.forEach((item) => {
      const product = createCartItemElement(item);
      addCar(product);
    });
    sumCart();
  }
}

function clearCart() {
  const itemclear = document.querySelector('.cart__items');
  itemclear.innerHTML = '';
  localStorage.clear();
  sumCart();
}

window.onload = function onload() {
  fetchItens();
  localStogeRecover();
  sumCart();
  const clear = document.querySelector('.empty-cart');
  clear.addEventListener('click', clearCart);
};
