const clickSelection = window.document;

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
  const sectionShowProducts = document.querySelector('#presentationItems');
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return sectionShowProducts.appendChild(section);
}

const setCartItem = (idReceived, callback) => {
  const endpoint = `https://api.mercadolibre.com/items/${idReceived}`;
  fetch(endpoint)
    .then((response) => {
      response.json().then((data) => {
        const product = {
          sku: data.id,
          name: data.title,
          salePrice: data.price,
        };
        callback(product);
      });
    });
};

const createCartItemElement = ({ sku, name, salePrice }) => {
  const ol = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (evt) => {
    if (evt.target.nodeName === 'BUTTON' && evt.target.className === 'item__add') {
      setCartItem();
    }
  });
  return ol.appendChild(li);
};

const loadItemLocalStorage = () => {
  let arrayForDataPropagation = [];
  const productsLoadOfLocalStorage = localStorage.getItem('products');
  arrayForDataPropagation = JSON.parse(productsLoadOfLocalStorage);
  if (arrayForDataPropagation === null) {
    arrayForDataPropagation = [];
    return arrayForDataPropagation;
  }
  return arrayForDataPropagation;
};

const removeItemOfHtml = (nameClassOfFather, callback) => {
  const elemFather = document.querySelector(nameClassOfFather);
  while (elemFather.lastElementChild) {
    elemFather.removeChild(elemFather.lastElementChild);
  }
  if (callback === undefined) {
    return undefined;
  }
  return callback();
};

let productsForSendLocalStorage = [];

const cartSum = async () => {
  const kart = await loadItemLocalStorage();
  const sumproductsCart = await kart.reduce((acc, curr) => acc + curr.PRICE, 0);
  const pricePage = document.querySelector('.total-price');
  pricePage.innerText = sumproductsCart;
};

const productGenerateAndSave = (products) => {
  removeItemOfHtml('.cart__items');
  products.forEach((productElement) => {
    createCartItemElement({
      sku: productElement.SKU,
      name: productElement.NAME,
      salePrice: productElement.PRICE,
    });
  });
  localStorage.setItem('products', JSON.stringify(productsForSendLocalStorage));
  cartSum();
  productsForSendLocalStorage = [];
};

const convertProductsArrayForObjects = (newProduct) => {
  const productsLocalStorage = loadItemLocalStorage();
  if (productsLocalStorage.length !== 0) {
    productsLocalStorage.forEach((element) => {
      productsForSendLocalStorage.push(element);
    });
  }
  if (typeof (newProduct) !== 'undefined') {
    productsForSendLocalStorage.push({
      SKU: newProduct.sku, NAME: newProduct.name, PRICE: newProduct.salePrice,
    });
  }
  return productGenerateAndSave(productsForSendLocalStorage);
};

const listItemsForSelect = async (dataSearch) => {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${dataSearch}`;
  try {
    const response = await fetch(endpoint);
    await removeItemOfHtml('.items');
    const object = await response.json();
    return object.results;
  } catch (erro) {
    return alert(erro);
  }
};

const getDataApi = async () => {
  const data = await listItemsForSelect('computador');
  data.forEach((productItem) => {
    const sku = productItem.id;
    const name = productItem.title;
    const image = productItem.thumbnail;
    const product = { sku, name, image };
    createProductItemElement(product);
  });
};

const getClickElements = () => {
  clickSelection.addEventListener('click', function (event) {
    if (event.target.nodeName === 'BUTTON' && event.target.className === 'item__add') {
      const elementClickedId = event.path[1].firstChild.innerText;
      setCartItem(elementClickedId, convertProductsArrayForObjects);
    }
  });
};

const cartItemClickListener = () => {
  clickSelection.addEventListener('click', (event) => {
    if (event.target.nodeName === 'LI') {
      productsForSendLocalStorage = [];
      const itemSelected = event.target.innerText;
      const captureDataLocalStorage = loadItemLocalStorage();
      const idOfItemSelected = itemSelected.split(' ');
      const indexLocale = [];
      captureDataLocalStorage.forEach((productElem, index) => {
        if (productElem.SKU === idOfItemSelected[1]) {
          indexLocale.push(index);
        }
      });
      captureDataLocalStorage.splice(indexLocale[0], 1);
      productsForSendLocalStorage = captureDataLocalStorage;
      productGenerateAndSave(productsForSendLocalStorage);
    }
  });
};

const clearAllCart = () => {
  const buttonCart = document.querySelector('.empty-cart');
  buttonCart.addEventListener('click', () => {
    localStorage.clear();
    return removeItemOfHtml('.cart__items', convertProductsArrayForObjects);
  });
};

window.onload = function onload() {
  getDataApi();
  convertProductsArrayForObjects();
  getClickElements();
  cartItemClickListener();
  clearAllCart();
};
