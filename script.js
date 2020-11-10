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
  section.appendChild(createCustomElement('button', 'item__add btn btn-success', 'Adicionar ao carrinho!'));
  return section;
}
// criando elementos HTML com JS:
// https://developer.mozilla.org/pt-BR/docs/Web/API/Document/createElement

function calculateValue(newList) {
  return new Promise((resolve) => {
    const newArray = [];
    newList.forEach(item => newArray.push(item.salePrice));
// cada valor de cada item de newList e adicionado a newArray
    const value = (newArray.reduce((acc, nextValue) => acc + nextValue, 0));
    resolve(value);
// o valor dos itens sao somados e adicionados a variavel value
  });
}
// Uso de promisse constructor:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/Promise

async function sumTotalCart() {
  const newList = JSON.parse(localStorage.getItem('Carrinho de Compras'));
// ao carregar a pagina o carrinho deve ser carregado de localStorage
  const divPrice = document.querySelector('.total-price');
  const divPriceChild = document.querySelector('.total-price-child');
  const value = await calculateValue(newList);
// calculateValue e uma funçao assincrona devido ao uso do construtor new Promisse
  if (!divPriceChild) {
    const totalPriceInCart = createCustomElement('div', 'total-price-child bg-dark text-light', value);
    divPrice.appendChild(totalPriceInCart);
  } else {
    divPrice.removeChild(divPriceChild);
    const totalPriceInCart = createCustomElement('div', 'total-price-child bg-dark text-light', value);
    divPrice.appendChild(totalPriceInCart);
  }
}
// Uso de JSON.parse, muito similar a Object.keys(so que JSON e uma string que representa um obj)
// https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse

function saveCart(newItemCart) {
  const arrayOfData = JSON.parse(localStorage.getItem('Carrinho de Compras'));
  arrayOfData.push(newItemCart);
  localStorage.setItem('Carrinho de Compras', JSON.stringify(arrayOfData));
  sumTotalCart();
}
// localStorage.getItem acha o valor de uma chave pelo seu nome
// https://developer.mozilla.org/pt-BR/docs/Web/API/Storage/getItem
// localStorage.setItem : quando passado 'chave' e 'valor', irá adicionar esta chave ao storage,
// ou atualizar o valor caso a chave já exista.
// https://developer.mozilla.org/pt-BR/docs/Web/API/Storage/setItem

function cartItemClickListener(event) {
  const arrayLocalStorage = JSON.parse(localStorage.getItem('Carrinho de Compras')) || [];
  const itemParent = document.querySelector('.cart__items');
  const arrayOfData = arrayLocalStorage.map(item => item.sku);
// transforma cada item do array em item.sku
  const itemSelected = event.target;
  const correspondentIndex = arrayOfData.indexOf(itemSelected.dataset.sku);
// o metodo indexOF retorna o primeiro índice em que o elemento pode ser encontrado no array
  arrayLocalStorage.splice(correspondentIndex, 1);
// remove um elemento da lista a partir do indice correspondentIndex
// https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
  itemParent.removeChild(itemSelected);
  localStorage.clear();
  localStorage.setItem('Carrinho de Compras', JSON.stringify(arrayLocalStorage));
  sumTotalCart();
// Uso de JSON.stringify (converte um valor numa string JSON)
// https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  li.dataset.sku = sku;
  return li;
}
// A propriedade HTMLElement.dataset permite o acesso, em modo de leitura e escrita,
// a todos os atributos de dados personalizado (data-*) no elemento. Ele é um mapa
// de DOMString, com uma entrada para cada atributo de dados personalizado.
// https://developer.mozilla.org/pt-BR/docs/Web/API/HTMLElement/dataset

function createCartAllElements(arrayOfData) {
  const list = document.querySelector('.cart__items');
  arrayOfData.forEach((item) => {
    const li = createCartItemElement(item);
    list.appendChild(li);
  });
}
// curiosidade sobre o uso de appendChild (teste realizando a comparação de appendChild vs innerHTML)
// https://pt.stackoverflow.com/questions/120708/criar-elemento-no-html-com-javascript-appendchild-vs-innerhtml

function reloadCart() {
  const arrayOfData = JSON.parse(localStorage.getItem('Carrinho de Compras'));
  if (localStorage.getItem('Carrinho de Compras')) {
    createCartAllElements(arrayOfData);
// se existir o item Carrinho de Compras no localStorage, sera "recarregado" na pagina.
// (eh criado a partir do JSON.parse o elemento e readicionado a pagina pela funçao
// createCartAllElements)
  } else {
    const newArray = [];
    localStorage.setItem('Carrinho de Compras', JSON.stringify(newArray));
    createCartAllElements(newArray);
  }
  sumTotalCart();
}
// se nao eh carregado o elemento Carrinho de compras, soh que vazio.

function createLoadingElement() {
  const cart = document.querySelector('.cart');
  const loadingElement = createCustomElement('span', 'loading', 'loading...');
  cart.appendChild(loadingElement);
}

function removeLoadingElement() {
  const cart = document.querySelector('.cart');
  const loadingElement = document.querySelector('.loading');
  cart.removeChild(loadingElement);
}

const getFilteredProducts = () => {
  const itemsSection = document.querySelector('.items');
  const endPoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  createLoadingElement();
  return fetch(endPoint)
    .then(response => response.json())
    .then(data => data.results.forEach(({ id: sku, title: name, thumbnail: image }) => {
      const itemToBeInserted = createProductItemElement({ sku, name, image });
      itemsSection.appendChild(itemToBeInserted);
    }))
    .then(removeLoadingElement);
};

const insertProductInCart = (event) => {
  const itemSelected = event.target.parentNode;
  const cartSection = document.querySelector('.cart__items');
  const idSelected = itemSelected.querySelector('.item__sku').innerText;
  const endPoint = `https://api.mercadolibre.com/items/${idSelected}`;
  createLoadingElement();
  fetch(endPoint)
    .then(response => response.json())
    .then(({ id: sku, title: name, price: salePrice }) => {
      const newItemCart = {
        sku,
        name,
        salePrice,
      };
      const itemToBeInsertedInCart = createCartItemElement(newItemCart);
      cartSection.appendChild(itemToBeInsertedInCart);
      saveCart(newItemCart);
    })
    .then(removeLoadingElement);
};

function getClickForCart() {
  const productButton = document.querySelectorAll('.item__add');
  productButton.forEach((item) => {
    item.addEventListener('click', insertProductInCart);
  });
}

function clearCart() {
  const cartList = document.querySelector('.cart__items');
  const newArray = [];
  if (cartList.childNodes.length !== 0) {
    cartList.innerHTML = '';
    localStorage.clear();
    localStorage.setItem('Carrinho de Compras', JSON.stringify(newArray));
    sumTotalCart();
  }
}

function loadClearButton() {
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', clearCart);
}

window.onload = async function onload() {
  await getFilteredProducts();
  reloadCart();
  getClickForCart();
  loadClearButton();
};

// consultei o repositorio de Jessica de Paula para implementaçao das funçoes acima.
// https://github.com/tryber/sd-07-project-shopping-cart/pull/93
