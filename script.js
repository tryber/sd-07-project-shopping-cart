function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener(event) { // remove as Lis ao click, requisito 3
  document.querySelector('.cart__items').removeChild(event.target);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const saveLocal = () => { // requisito 4
  const allList = document.querySelector('ol'); // todas as li novas a partir do pai
  localStorage.setItem('Item', allList.innerHTML);
};
function getSkuFromProductItem(item) { // requisito 2
  const justId = item.querySelector('span.item__sku').innerText;
  const endpoint = `https://api.mercadolibre.com/items/${justId}`;
  fetch(endpoint)
    .then(response => response.json())
    .then((data) => {
      document.querySelector('.cart__items').appendChild(createCartItemElement(data));
      saveLocal();
    });
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const returnButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  returnButton.addEventListener('click', (event) => {
    getSkuFromProductItem(event.target.parentNode); // buscar o id que é irmão do button
  });
  section.appendChild(returnButton);
  return section;
}

const selectChild = (arrayValue) => { // referência Rodrigo Sudario - Requisito 1
  const sectionHere = document.querySelector('.items'); // section que vai receber o novo item
  const value = Object.entries(arrayValue); // para formar arrays com chave e valor
  value.forEach(product =>
    sectionHere.appendChild(createProductItemElement(product[1])),
  ); // para que a section receba cada um dos objetos como filhos
};

const functionToFetch = () => { // requisito 1
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      document.querySelector('.loading').remove();
      selectChild(object.results);
    }) // envia só o results
    .then(click => eventButton());
};

const cleanButton = () => { // requisito 6
  const justOl = document.querySelector('.cart__items');
  document.querySelector('.empty-cart').addEventListener('click', () => {
    while (justOl.firstChild) {
      justOl.removeChild(justOl.firstChild);
    }
    localStorage.clear(); // limpa o que tiver salvo para receber lista nova
  });
};

window.onload = function onload() {
  functionToFetch();
  cleanButton();
  document.querySelector('ol').innerHTML = localStorage.getItem('Item');
};
