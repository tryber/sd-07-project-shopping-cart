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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function storageSetItem() {
  const allLi = document.querySelector('ol');
  localStorage.setItem('item', allLi.innerHTML);
}

function sumItens() {
  let count = 0;
  const getLi = document.querySelectorAll('li');
  getLi.forEach((li) => {
    const resultString = li.innerText.split('$')[1];
    count += parseFloat(resultString);
  });
  const getPrice = document.querySelector('.total-price');
  getPrice.innerHTML = count;
}

function cartItemClickListener(event) {
  const ol = document.querySelector('.cart__items');
  ol.removeChild(event.target);
  storageSetItem();
  sumItens();
}

function storageGetItem() {
  const allLi = document.querySelector('ol');
  allLi.innerHTML = localStorage.getItem('item');
  allLi.childNodes.forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function insertLoading() {
  const sectionContainer = document.querySelector('.cart');
  sectionContainer.appendChild(createCustomElement('p', 'loading', 'loading...'));
}

function removeLoading() {
  const getLoading = document.querySelector('.loading');
  getLoading.remove();
}

function fetchById(id) {
  const ol = document.querySelector('.cart__items');
  const url = `https://api.mercadolibre.com/items/${id}`;
  insertLoading();
  fetch(url)
    .then(response => response.json())
    .then((product) => {
      ol.appendChild(createCartItemElement(product));
      storageSetItem();
      removeLoading();
      sumItens();
    })
    .catch(error => console.log(error));
}

// Função createProductItemElement adaptada da solução de Tiago Esdras:
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const buttonAddProduct = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  buttonAddProduct.addEventListener('click', (event) => {
    const id = getSkuFromProductItem(event.target.parentNode);
    // Target: faz retornar o elemento onde o evento ocorreu.
    // ParentNode: retorna o pai do nó especificado, como um objeto node.
    fetchById(id);
    storageSetItem();
    sumItens();
  });
  section.appendChild(buttonAddProduct);

  return section;
}

const fetchApi = (product) => {
  const products = document.querySelector('.items');
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
  insertLoading();
  fetch(url)
    .then(response => response.json())
    .then((data) => {
      data.results.forEach((result) => {
        products
        .appendChild(createProductItemElement(result));
      });
      removeLoading();
    })
    .catch(error => console.log(error));
};

// Lógica com o while na linha 90 adaptada da solução do site qastack:
const clearProducts = () => {
  const buttonClear = document.querySelector('button.empty-cart');
  const allLi = document.querySelector('ol');
  buttonClear.addEventListener('click', () => {
    while (allLi.firstChild) allLi.removeChild(allLi.lastChild);
    // localStorage.clear();
    sumItens();
  });
};

window.onload = function onload() {
  fetchApi('computador');
  storageGetItem();
  clearProducts();
  sumItens();
};
