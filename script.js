// API
const url = {
  API: 'https://api.mercadolibre.com/sites/MLB/search?q=computador',
};

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

// Testando local se existe e carregando
const loadLocalStorage = () => {
  if (localStorage.list) {
    document.querySelector('.cart__items').innerHTML = localStorage.list;
  }
};

// Salvando no Storage
const saveStorage = () => {
  const local = document.querySelector('.cart__items').innerHTML;
  localStorage.list = local;
};

// Fun ClickLister RM Carrinho
function cartItemClickListener(event) {
  const cartItems = document.querySelector('.cart__items');
  cartItems.removeChild(event.target);
  saveStorage();
}

// Cria item no carrinho e storage
function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  document.querySelector('.cart__items').appendChild(li);
  saveStorage();
}

const fetchItem = (sku) => {
  const endPoint = `https://api.mercadolibre.com/items/${sku}`;
  fetch(endPoint)
    .then(response => response.json())
    .then(objeto => createCartItemElement(objeto));
};

function createProductItemElement({ sku, name, image }) {
  const addButtonCar = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  addButtonCar.addEventListener('click', () => {
    fetchItem(sku);
    saveStorage();
  });
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(addButtonCar);

  return section;
}

const fetchWindow = () => {
  const endPoint = `${url.API}`;
  const load = document.querySelector('.items');
  load.innerHTML = '<h1 class="loading">loading...</h1>';
  fetch(endPoint)
    .then(response => response.json())
    .then((objShowCase) => {
      load.innerHTML = '';
      objShowCase.results.forEach((item) => {
        const objShowC = {
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
        };
        const showcase = document.querySelector('.items');
        showcase.appendChild(createProductItemElement(objShowC));
      });
    });
};

const setClearButton = () => {
  const clearButton = document.getElementsByClassName('empty-cart');
  clearButton[0].addEventListener('click', () => {
    const items = document.querySelector('.cart__items');
    items.innerHTML = '';
    localStorage.clear();
  });
};

window.onload = function onload() {
  fetchWindow();
  setClearButton();
  loadLocalStorage();
};
