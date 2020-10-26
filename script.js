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

const showError = (message => window.alert(message));

async function sumPriceItem() {
  const sumPrice = await document.querySelectorAll('.cart__item');
  const totalPrice = await document.querySelector('.total-price');
  let numbers = 0;
  await sumPrice.forEach(async (sumText) => {
    const capNumber = await sumText.innerText;
    const capNumbers = parseFloat(capNumber.substr(-10).replace(/([^\d])+/gim, '.').substr(1));
    numbers += capNumbers;
  });
  totalPrice.innerText = await numbers;
}

function pageApiLoading() {
  document.querySelector('.container').appendChild(
    createCustomElement('h3', 'loading', 'loading...'));
  setTimeout(() => {
    document.querySelector('.container').removeChild(
      document.querySelector('.loading'));
  }, 1000);
}

function cartItemClickListener(event) {
  event.target.remove();
  sumPriceItem();
  const removeLocal = [];
  const removeLocalStorage = document.querySelectorAll('.cart__item');
  for (index = 0; index < removeLocalStorage.length; index += 1) {
    removeLocal.push(removeLocalStorage[index].outerHTML);
  }
  localStorage.setItem('list-items', JSON.stringify(removeLocal));
}

const setItemLocalStorage = (item) => {
  let addLocalStorage = JSON.parse(localStorage.getItem('list-items'));
  if (addLocalStorage !== null) {
    addLocalStorage.push(item);
  } else {
    addLocalStorage = [];
    addLocalStorage.push(item);
  }
  localStorage.setItem('list-items', JSON.stringify(addLocalStorage));
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  setItemLocalStorage(li.outerHTML);
  return li;
}

const fetchAddItemCar = async (itemID) => {
  const endpoint = `https://api.mercadolibre.com/items/${itemID}`;
  try {
    const response = await fetch(endpoint);
    const object = await response.json();
    pageApiLoading();
    if (object.error) {
      throw new Error(object.error);
    } else {
      const listCar = document.querySelector('.cart__items');
      listCar.appendChild(createCartItemElement(object));
      sumPriceItem();
    }
  } catch (error) {
    showError(error);
  }
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const addButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  addButton.addEventListener('click', (event) => {
    fetchAddItemCar(getSkuFromProductItem(event.path[1]));
  });
  section.appendChild(addButton);

  return section;
}

const getItemLocalStorage = () => {
  const getListItem = JSON.parse(localStorage.getItem('list-items'));
  const listStorage = document.querySelector('.cart__items');
  if (getListItem !== null) {
    getListItem.forEach((items) => {
      listStorage.innerHTML += items;
      listStorage.addEventListener('click', cartItemClickListener);
    });
  }
};

const fetchListProduct = ((term) => {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${term}`;
  fetch(endpoint)
    .then(res => res.json())
    .then((response) => {
      pageApiLoading();
      const sectionComputer = document.querySelector('.items');
      response.results.forEach((product) => {
        sectionComputer.appendChild(createProductItemElement(product));
      });
    })
    .catch(error => showError(error));
});

const emptyCar = () => {
  const emptybutton = document.querySelector('.empty-cart');
  const listCar = document.querySelector('.cart__items');
  emptybutton.addEventListener('click', () => {
    listCar.innerHTML = '';
    localStorage.setItem('list-items', JSON.stringify([]));
    sumPriceItem();
  });
};

window.onload = function onload() {
  const term = 'computador';
  fetchListProduct(term);
  getItemLocalStorage();
  sumPriceItem();
  emptyCar();
};
