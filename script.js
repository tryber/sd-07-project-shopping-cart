let cardItemsArrStorage = localStorage.getItem('cardItemsArr') !== null ?
  JSON.parse(localStorage.getItem('cardItemsArr')) : [];

const upDateLocalStorage = () => {
  localStorage.setItem('cardItemsArr', JSON.stringify(cardItemsArrStorage));
};

const calcCardItemsArrStorage = async () => {
  const price = await cardItemsArrStorage.reduce((acc, crr) => crr.salePrice + acc, 0);
  document.querySelector('.total-price').innerText = `${price}`;
};

const removeCardItemsArrStorage = (event) => {
  const index = cardItemsArrStorage.findIndex(element => element.sku === event.target.id);
  cardItemsArrStorage.splice(index, 1);
  upDateLocalStorage();
  calcCardItemsArrStorage();
};

const pushCardItemsArrStorage = (obj) => {
  cardItemsArrStorage.push(obj);
  upDateLocalStorage();
};

const removeCardItemsLi = (event) => {
  document.querySelector('.cart__items').removeChild(event.target);
  removeCardItemsArrStorage(event);
};

const createCartItemElement = ({ sku, name, salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = `${sku}`;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', removeCardItemsLi);
  return li;
};

const getProductsObj = url => fetch(url)
  .then(result => result.json())
  .then(result => result);

const getCartItemsApi = async (item) => {
  const skuItem = item.target.parentNode.querySelector('span').innerText;
  const product = await getProductsObj(`https://api.mercadolibre.com/items/${skuItem}`);
  const { id: sku, title: name, price: salePrice } = product;
  return { sku, name, salePrice };
};

const addCardItems = async (item) => {
  const product = await getCartItemsApi(item);
  const element = createCartItemElement(product);
  document.querySelector('.cart__items').appendChild(element);
  pushCardItemsArrStorage(product);
  calcCardItemsArrStorage();
};

const createCartItensOfArrStorage = (cardItemsArrStorageArr) => {
  if (localStorage.getItem('cardItemsArr') !== null) {
    cardItemsArrStorageArr.forEach((e) => {
      const { sku, name, salePrice } = e;
      const element = createCartItemElement({ sku, name, salePrice });
      document.querySelector('.cart__items').appendChild(element);
    });
    calcCardItemsArrStorage();
  }
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  if (element === 'button') {
    e.addEventListener('click', addCardItems);
  }
  e.className = className;
  e.innerText = innerText;
  return e;
};

const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const createProductItemElement = ({ sku, name, image }) => {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
};

const loadingMsg = () => { 
  const msg = createCustomElement('span', 'loading', 'loading...');
  document.querySelector('.items').appendChild(msg);
};

const loadProducts = async () => {
  const products = await getProductsObj('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const container = document.querySelector('.items');
  products.results.forEach((product) => {
    const { id: sku, title: name, thumbnail: image } = product;
    const section = createProductItemElement({ sku, name, image });
    container.appendChild(section);
  });
  container.removeChild(document.querySelector('.loading'));
};

const btnEmptyCardAddListener = () => {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    cardItemsArrStorage = [];
    upDateLocalStorage();
    calcCardItemsArrStorage();
    document.querySelector('.cart__items').innerHTML = '';
  });
};

window.onload = function onload() {
  btnEmptyCardAddListener();
  createCartItensOfArrStorage(cardItemsArrStorage);
  loadingMsg();
  loadProducts();
};
