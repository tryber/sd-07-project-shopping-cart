const API_URL_SEARCH = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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

const sumItensInCart = async (priceItem) => {
  const totalPriceHTML = document.querySelector('.total-price');
  let totalPrice = parseFloat(totalPriceHTML.innerHTML);
  totalPrice += priceItem;
  totalPriceHTML.innerHTML = totalPrice;
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.dataset.id = sku;
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }


async function reduceSumFromTotal(item) {
  const totalPriceHTML = document.querySelector('.total-price');
  const arrayPriceItem1 = item.innerHTML.split(' ');
  const arrayPriceItem2 = arrayPriceItem1[arrayPriceItem1.length - 1].split('$');
  const priceItem = parseFloat(arrayPriceItem2[arrayPriceItem2.length - 1]);
  let totalPrice = totalPriceHTML.innerHTML;
  totalPrice -= priceItem;
  totalPriceHTML.innerHTML = totalPrice;
}

function cartItemClickListener(event) {
  reduceSumFromTotal(event.target);
  event.target.parentNode.removeChild(event.target);
}

const addToLocalStorage = (product) => {
  const currentLocalStorage = JSON.parse(localStorage.getItem('cart')) || [];
  currentLocalStorage.push(product);
  localStorage.setItem('cart', JSON.stringify(currentLocalStorage));
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  addToLocalStorage(li.outerHTML);
  return li;
}

const addClickedItem = () => {
  const buttonClicked = document.querySelector('.items');
  buttonClicked.addEventListener('click', async (event) => {
    const selected = event.target.closest('.item').dataset.id;
    const API_URL_ITEM = `https://api.mercadolibre.com/items/${selected}`;
    const siteResponse = await fetch(API_URL_ITEM).then(response => response.json());
    const object =
      {
        sku: siteResponse.id,
        name: siteResponse.title,
        salePrice: siteResponse.price,
      };
    sumItensInCart(siteResponse.price);
    const createLi = createCartItemElement(object);
    const listOl = document.querySelector('ol');
    listOl.appendChild(createLi);
  });
};

const fetchItemList = async () => {
  const siteReturn = await fetch(API_URL_SEARCH)
  .then(response => response.json())
  .then(data => data.results);

  siteReturn.forEach((element) => {
    const obj = {
      sku: element.id,
      name: element.title,
      image: element.thumbnail,
    };
    const addItem = document.querySelector('.items');
    const a = createProductItemElement(obj);
    addItem.appendChild(a);
  });
};

const clearCart = () => {
  const emptyCartButton = document.querySelector('.empty-cart');
  emptyCartButton.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    document.querySelector('.total-price').innerHTML = 0;
    localStorage.clear();
  });
};

const getLocalStorage = () => {
  const currentLocalStorage = JSON.parse(localStorage.getItem('cart'));
  if (!currentLocalStorage) return;
  const ol = document.querySelector('.cart__items');
  currentLocalStorage.forEach((element) => {
    ol.innerHTML += element;
    ol.addEventListener('click', cartItemClickListener);
  });
};

window.onload = function onload() {
  fetchItemList();
  addClickedItem();
  clearCart();
  getLocalStorage();
};
