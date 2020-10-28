

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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }
const addToLocalStorage = () => {
  const arrToSaveInLocalStorage = [];
  const ol = document.querySelector('.cart__items');
  for (let index = 0; index < ol.childElementCount; index += 1) {
    const itemText = ol.children[index].innerText;
    const objToSaveLocalStorage = { item: itemText };
    arrToSaveInLocalStorage.push(objToSaveLocalStorage);
  }
  localStorage.setItem('Item', JSON.stringify(arrToSaveInLocalStorage));
};
const sumAmountToPay = () => {
  const objectLocalStorage = JSON.parse(localStorage.getItem('Item'));
  let amountToPayToReturn = 0;
  for (let index = 0; index < objectLocalStorage.length; index += 1) {
    const priceOfItem = objectLocalStorage[index].item.split('$')[1];
    amountToPayToReturn += parseFloat(priceOfItem);
  }
  return amountToPayToReturn;
};

const totalPriceHTML = async () => {
  const totalPriceToPay = await sumAmountToPay();
  const divTotalPrice = document.querySelector('.total-price');
  divTotalPrice.innerText = totalPriceToPay;
};

function cartItemClickListener(event) {
  const ol = document.querySelector('.cart__items');
  ol.removeChild(event.target);
  localStorage.clear();
  addToLocalStorage();
  totalPriceHTML();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}


const addItensInHTML = async () => {
  const loading = document.createElement('p');
  loading.innerText = 'loading...';
  loading.classList.add('loading');
  const cart = document.querySelector('.items');
  cart.appendChild(loading);
  try {
    const endPoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
    const resultOfFetchAPI = await fetch(endPoint);
    const objectWithAllInformationFetch = await resultOfFetchAPI.json();
    const arrayResultsOfJsonObject = objectWithAllInformationFetch.results;
    const objectToFunctionCreateProductItemElement = {};
    const sectionItems = document.querySelector('.items');
    cart.removeChild(loading);
    arrayResultsOfJsonObject.forEach((item) => {
      objectToFunctionCreateProductItemElement.sku = item.id;
      objectToFunctionCreateProductItemElement.name = item.title;
      objectToFunctionCreateProductItemElement.image = item.thumbnail;
      sectionItems.appendChild(createProductItemElement(objectToFunctionCreateProductItemElement));
    });
  } catch (erro) {
    alert(erro);
  }
};

const addItemIntoCar = () => {
  const sectionItems = document.querySelector('.items');
  sectionItems.addEventListener('click', async (event) => {
    const btnClicked = event.target;
    const itemIdSelected = btnClicked.closest('.item').firstChild.innerText;
    const endPoint = `https://api.mercadolibre.com/items/${itemIdSelected}`;
    const resultEndPoint = await fetch(endPoint);
    const parseResultEndPointToJSON = await resultEndPoint.json();
    const objectToFunctionCreateCartItemElement = {
      sku: parseResultEndPointToJSON.id,
      name: parseResultEndPointToJSON.title,
      salePrice: parseResultEndPointToJSON.price,
    };
    const li = createCartItemElement(objectToFunctionCreateCartItemElement);
    li.classList.add('selected');
    const ol = document.querySelector('.cart__items');
    ol.appendChild(li);
    addToLocalStorage(li);
    totalPriceHTML();
  });
};
window.onload = function onload() {
  addItensInHTML();
  addItemIntoCar();
  totalPriceHTML();

  const btnClearOl = document.querySelector('.empty-cart');
  btnClearOl.addEventListener('click', () => {
    const ol = document.querySelector('.cart__items');
    ol.innerHTML = '';
    addToLocalStorage();
    totalPriceHTML();
  });

  const createLIFromLocalStorage = (textItem) => {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = textItem;
    li.addEventListener('click', cartItemClickListener);
    const ol = document.querySelector('.cart__items');
    ol.appendChild(li);
  };

  if (localStorage.getItem('Item') !== null) {
    const jsonParseGetItem = JSON.parse(localStorage.getItem('Item'));
    const lengthLocalStorageList = jsonParseGetItem.length;
    for (let index = 0; index < lengthLocalStorageList; index += 1) {
      createLIFromLocalStorage(jsonParseGetItem[index].item);
    }
  }
};
