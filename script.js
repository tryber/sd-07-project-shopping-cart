
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function saveLocalStorage() {
  const ol = document.getElementsByClassName('cart__items')[0].innerHTML;
  localStorage.setItem('html', `${ol}`);
}

function cartItemClickListener(event) {
  const target = event.target;
  const parent = target.parentElement;
  parent.removeChild(target);
  saveLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchCurrencyid = (idItem) => {
  const endpoint = `https://api.mercadolibre.com/items/${idItem}`;
  fetch(endpoint)
  .then(response => response.json())
  .then((object) => {
    const itemId = { sku: object.id, name: object.title, salePrice: object.price };
    const liItem = createCartItemElement(itemId);
    const listCarItem = document.getElementsByClassName('cart__items')[0];
    listCarItem.appendChild(liItem);
    saveLocalStorage();
  });
};

function loadingLocalStorage() {
  const ol = document.getElementsByClassName('cart__items')[0];
  const html = localStorage.getItem('html');
  ol.innerHTML = html;
}

const fetchCurrency = () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const sectionItems = document.getElementsByClassName('items')[0];
  sectionItems.appendChild(createCustomElement('div', 'loading', 'loading...'));
  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      const results = object.results;
      const resultList = results.map(result => [result.id, result.title, result.thumbnail]);
      resultList.forEach((element) => {
        const resultObject = { sku: element[0], name: element[1], image: element[2] };
        const mainSection = document.getElementsByClassName('items')[0];
        const section = createProductItemElement(resultObject);
        mainSection.appendChild(section);
      });
      const buttonAdd = document.getElementsByClassName('item__add');
      for (let i = 0; i < buttonAdd.length; i += 1) {
        buttonAdd[i].addEventListener('click', function () {
          const parentText = getSkuFromProductItem(buttonAdd[i].parentElement);
          fetchCurrencyid(parentText);
        });
      }
      loadingLocalStorage();
      sectionItems.removeChild(document.getElementsByClassName('loading')[0]);
    });
};
/* referencia para remover todos os filhos https://qastack.com.br/programming/3955229/remove-all-child-elements-of-a-dom-node-in-javascript */
function removeListCar() {
  const empty = document.getElementsByClassName('empty-cart')[0];
  const listItemsCar = document.getElementsByClassName('cart__items')[0];
  empty.addEventListener('click', () => {
    while (listItemsCar.firstChild) {
      listItemsCar.removeChild(listItemsCar.lastChild);
    }
    localStorage.clear();
  });
}

window.onload = function onload() {
  fetchCurrency();
  removeListCar();
};
