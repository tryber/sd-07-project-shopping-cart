

function loading() {
  const load = document.createElement('span');
  load.className = 'loading';
  load.innerHTML = 'loading...';
  const getContainerElement = document.querySelector('.items');
  getContainerElement.appendChild(load);
}

function PriceCalc(price, plus) {
  const textItem = price.innerText;
  const lastString = textItem.substring(textItem.lastIndexOf('$') + 1);
  const priceItem = parseFloat(lastString, 10);
  const total = document.querySelector('.total-price');
  let numberTotal = parseFloat(total.innerText, 10);
  if (plus === true) {
    numberTotal += priceItem;
  }
  if (plus === false) {
    numberTotal += -priceItem;
  }
  total.innerHTML = numberTotal;
}

const saveCartList = () => {
  localStorage.clear();
  const ol = document.querySelector('.cart__items');
  localStorage.setItem('cartList', ol.innerHTML);
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener(sku) {
  const selfRemove = sku;
  selfRemove.parentNode.removeChild(selfRemove);
  PriceCalc(sku, false);
}

function createCartItemElement(sku, name, salePrice) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.id = `${sku}`;
  li.addEventListener('click', () => {
    cartItemClickListener(li);
  });
  saveCartList();
  return li;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement(sku, name, image) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  const productApiPrices = `https://api.mercadolibre.com/items/${sku}`;
  const buttonselected = section.querySelector('.item__add');
  buttonselected.addEventListener('click', () => {
    fetch(productApiPrices)
      .then((response) => {
        response.json()
          .then((data) => {
            document.querySelector('.cart__items')
              .appendChild(createCartItemElement(data.id, data.title, data.price));
            PriceCalc(createCartItemElement(data.id, data.title, data.price), true);
            saveCartList();
          });
      });
  });

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

async function fetchSearch(product) {
  loading();
  setTimeout(() => {
    const productApiItems = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
    fetch(productApiItems)
      .then((response) => {
        response.json().then((data) => {
          data.results.forEach((singPro) => {
            const productfetch = document.querySelector('.items');
            productfetch.appendChild(
              createProductItemElement(singPro.id, singPro.title, singPro.thumbnail));
          });
        });
      });
    document.querySelector('.loading').remove();
  }, 1000);
}

const newSession = () => {
  const ol = document.querySelector('.cart__items');
  ol.innerHTML = localStorage.getItem('cartList');
};

function removeSitems() {
  const removeButton = document.querySelector('.empty-cart');
  removeButton.addEventListener('click', () => {
    const ol = document.querySelector('.cart__items');
    while (ol.firstChild) {
      ol.removeChild(ol.firstChild);
      localStorage.clear();
    }
    document.querySelector('.total-price').innerText = '0';
  });
}


window.onload = function onload() {
  fetchSearch('computador');
  newSession();
  removeSitems();
};
