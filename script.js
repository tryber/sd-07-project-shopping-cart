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

// SOMANDO ITEMS DA LISTA
const sumPriceListItems = (price) => {
  const strong = document.querySelector('.total-price');
  strong.innerText = price;
};

const updatePrice = () => {
  const array = JSON.parse(localStorage.getItem('list'));
  let value = 0;
  // console.log(array);
  array.forEach((li) => {
    // console.log(li.split('$')[1]);
    value += parseFloat(li.split('$')[1]);
  });
  sumPriceListItems(value);
};

// ADICIONANDO LOCAL STORAGE
const addLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// CRIANDO ARRAY NO LOCAL STORAGE
const arrayLocalStorage = () => {
  const array = [];
  const ol = document.querySelector('.cart__items');
  ol.childNodes.forEach(li => array.push(li.innerText));
  return array;
};

// REMOVENDO ITENS DO STORAGE
function cartItemClickListener(event) {
  const parent = event.target.parentNode;
  // console.log(JSON.parse(localStorage.getItem('list')));
  const array = JSON.parse(localStorage.getItem('list'));
  // console.log(event.target.innerText)
  array.forEach((li) => {
    if (event.target.innerText === li) {
      parent.removeChild(event.target);
      localStorage.clear();
      addLocalStorage('list', arrayLocalStorage());
      updatePrice();
    }
  });
}

// ADD LI NA OL
const addLiCartItem = (li) => {
  const ol = document.querySelector('.cart__items');
  ol.appendChild(li);
};

// ADD NO LOCAL STORAGE
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  addLiCartItem(li);
  addLocalStorage('list', arrayLocalStorage());
  updatePrice();
}

// ATUALIZAR LOCAL STORAGE
const updateLiStorage = () => {
  // console.log(JSON.parse(localStorage.getItem('list'))[1]);
  const array = JSON.parse(localStorage.getItem('list'));
  if (array) {
    array.forEach((info) => {
      // console.log(info)
      const li = document.createElement('li');
      li.className = 'cart__item';
      li.innerText = info;
      li.addEventListener('click', cartItemClickListener);
      addLiCartItem(li);
    });
    updatePrice();
  }
};

// RESGATAR ID DOS ITENS
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// ADD ITEM DA LISTA
const fetchApiIds = (event) => {
  // console.log(event.target.parentNode)
  const id = getSkuFromProductItem(event.target.parentNode);
  const endPoint = `https://api.mercadolibre.com/items/${id}`;
  fetch(endPoint)
    .then(response => response.json())
    .then((data) => {
      createCartItemElement(data);
    });
};

// CRIANDO PRODUTOS
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement(
    'button',
    'item__add',
    'Adicionar ao carrinho!',
  );
  button.addEventListener('click', fetchApiIds);
  section.appendChild(button);
  return section;
}

const addSectionItems = (section) => {
  const sectionItems = document.querySelector('.items');
  sectionItems.appendChild(section);
};

const createNewSectionItems = (object) => {
  addSectionItems(createProductItemElement(object));
};

const newObjectItems = (object) => {
  const newObj = {};
  newObj.sku = object.id;
  newObj.name = object.title;
  newObj.image = object.thumbnail;
  return newObj;
};

const removeLoadMessage = () => {
  const container = document.querySelector('.items');
  const p = document.querySelector('.loading');
  container.removeChild(p);
};

const fetchApiShopping = (product) => {
  const endPoint = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
  fetch(endPoint)
    .then((response) => {
      removeLoadMessage();
      return response.json();
    })
    .then(data =>
      data.results.forEach((object) => {
        // console.log(object);
        createNewSectionItems(newObjectItems(object));
      }),
    );
};

// LIMPANDO TODA LISTA
const clearItems = () => {
  const ol = document.querySelector('.cart__items');
  const strong = document.querySelector('.total-price');
  ol.innerHTML = '';
  strong.innerHTML = '';
  localStorage.clear();
};

// EVENTO DE LIMPAR BOTÃO
const clearShoppingCar = () => {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', clearItems);
};

window.onload = function onload() {
  fetchApiShopping('computador');
  updateLiStorage();
  clearShoppingCar();
};
