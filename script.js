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

// Thiago Pederzolli JSON

const saveInLocalStorage = () => {
  const ol = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cartList', JSON.stringify(ol));

  const totalPrice = document.querySelector('.total-price').innerHTML;
  localStorage.setItem('totalPrice', JSON.stringify(totalPrice));
};

const sumPrice = async () => {
  const lis = document.querySelectorAll('.cart__item');
  const resultElement = document.querySelector('.total-price');
  const nodeListForArr = Array.from(lis);

  const sum = nodeListForArr.reduce((total, li) => {
    const liValue = li.innerText;
    const arrOfValue = liValue.split('$');
    return total + Number(arrOfValue[1]);
  }, 0);

  resultElement.innerText = sum;
  // resultElement.innerText = sum.toFixed(2);

  saveInLocalStorage();
};

async function cartItemClickListener(event) {
  const ol = document.querySelector('.cart__items');
  const li = event.target;
  ol.removeChild(li);

  await sumPrice();
  saveInLocalStorage();
}

// Thiago Pederzolli JSON

const loadLocalStorage = () => {
  let jsonList = localStorage.getItem('cartList');
  jsonList = JSON.parse(jsonList);

  const ol = document.querySelector('.cart__items');

  ol.innerHTML = jsonList;

  const lis = document.querySelectorAll('li');

  lis.forEach(li => li.addEventListener('click', cartItemClickListener));

  const totalPrice = document.querySelector('.total-price');

  let sumResult = localStorage.getItem('totalPrice');
  sumResult = JSON.parse(sumResult);

  totalPrice.innerHTML = sumResult;
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getFetchEndPoint = endPoint => fetch(endPoint);

const createExpectedObject = (id, title, thumbnail, price) => ({
  sku: id,
  name: title,
  image: thumbnail,
  salePrice: price,
});

const printProduct = ({ id, title, thumbnail, price }) => {
  const newSection = createProductItemElement(createExpectedObject(id, title, thumbnail, price));
  const containerSection = document.querySelector('.items');

  containerSection.appendChild(newSection);
};

const callFetch = async (id) => {
  try {
    const promiseResult = await getFetchEndPoint(`https://api.mercadolibre.com/items/${id}`);
    const data = await promiseResult.json();
    return data;
  } catch (error) {
    alert(error);
    return error;
  }
};

const goToOL = async (event) => {
  let gettingSku = event.target;
  gettingSku = gettingSku.parentElement;
  gettingSku = gettingSku.firstChild;
  gettingSku = gettingSku.innerText;

  const ol = document.querySelector('.cart__items');

  const objectOfFetch = await callFetch(gettingSku);
  const { id, title, thumbnail, price } = objectOfFetch;

  const expectedObject = createExpectedObject(id, title, thumbnail, price);
  const li = createCartItemElement(expectedObject);

  ol.appendChild(li);

  await sumPrice();
  saveInLocalStorage();
};

const listeningAddToCartButton = () => {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach(button => button.addEventListener('click', goToOL));
};

const emptyCart = () => {
  const emptyButton = document.querySelector('.empty-cart');
  const ol = document.querySelector('.cart__items');
  emptyButton.addEventListener('click', async () => {
    ol.innerHTML = '';
    await sumPrice();
    saveInLocalStorage();
  });
};

const removeLoadingMessage = () => {
  const container = document.querySelector('.container');
  const nodesContainer = container.children;
  container.removeChild(nodesContainer[0]);
};

const loadPage = async () => {
  try {
    const promiseResult = await getFetchEndPoint('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
    const data = await promiseResult.json();
    removeLoadingMessage();
    const arrOfObjects = data.results;
    arrOfObjects.forEach(printProduct);
    loadLocalStorage();
    listeningAddToCartButton();
    emptyCart();
  } catch (error) {
    alert(error);
  }
};

window.onload = function onload() {
  loadPage();
};
