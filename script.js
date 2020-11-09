function saveData() {
  const cartList = document.querySelector('.cart__items');
  localStorage.setItem('itensSaved', cartList.innerHTML);
}

function getDataFromLocalStorage() {
  const cartList = document.querySelector('.cart__items');
  cartList.innerHTML = localStorage.getItem('itensSaved');
}

function removeAll() {
  const ol = document.querySelector('.cart__items');
  ol.innerHTML = '';
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerHTML = 0;
  saveData();
}

function createElementLoading() {
  const elementLoading = document.createElement('p');
  elementLoading.className = 'loading';
  elementLoading.innerText = 'loading...';
  return elementLoading;
}

function removeElementLoading() {
  document.querySelector('.loading').remove();
}

function clearCartButton() {
  const buttonCleanAll = document.querySelector('.empty-cart');
  buttonCleanAll.addEventListener('click', removeAll);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const priceTotal = () => {
  let summation = 0;
  const allItensInCart = document.querySelectorAll('.cart__item');
  allItensInCart.forEach((element) => {
    summation += parseFloat(element.innerHTML.split('$')[1]);
  });
  document.querySelector('.total-price').innerText = summation;
};

function cartItemClickListener(event) {
  const clickedItem = event.target;
  clickedItem.parentNode.removeChild(clickedItem);
  saveData();
  priceTotal();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const productID = async (itemId) => {
  const productEndPoint = `https://api.mercadolibre.com/items/${itemId}`;

  return fetch(productEndPoint)
    .then(response => response.json())
    .then((jsonObject) => {
      const objectSelectedbyId = jsonObject;
      return objectSelectedbyId;
    })
    .catch(() => console.log('Erro inexperado.'));
};

const fetchItem = async (event) => {
  const clickedElementParent = event.target.parentNode;
  const idItem = getSkuFromProductItem(clickedElementParent);
  const objectItemID = await productID(idItem);
  const { id: sku, title: name, price: salePrice } = objectItemID;
  const cartItemList = createCartItemElement({ sku, name, salePrice });
  const cartList = document.querySelector('.cart__items');
  cartList.appendChild(cartItemList);
  saveData();
  priceTotal();
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', fetchItem);
  }
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
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

const productListing = async () => {
  const endPoint = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  const items = document.querySelector('.items');
  const loadingElement = createElementLoading();
  items.append(loadingElement);
  const list = await fetch(endPoint)
    .then(response => response.json())
    .then(jsonObject => jsonObject.results)
    .catch(() => console.log('Algo deu errado!'));
  list.forEach((element) => {
    items.appendChild(
      createProductItemElement({ sku: element.id, name: element.title, image: element.thumbnail }));
  });
  removeElementLoading();
};

window.onload = function onload() {
  productListing();
  getDataFromLocalStorage();
  clearCartButton();
};
