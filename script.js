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

const createPriceElement = (price) => {
  let getCurrency = document.querySelector('.selected-currency').getAttribute('currency');
  console.log(getCurrency);
  return `${getCurrency} ${price}`;
}

function createProductItemElement({ sku, name, image, price }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__price', createPriceElement(price)));
  section.appendChild(createCustomElement('span', 'item__price__credit', `12x de ${((price) / 12).toFixed(2)} sem juros`));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createCustomElement('button', 'item__add', '+'));

  return section;
}

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }


const getSearchItem = () => {
  const searchInput = document.querySelector('#search-input').value;
  document.querySelector('#search-input').value = '';
  return searchInput;
}

const settingsSearchBtn = () => {
  const searchBtn = document.querySelector('#search-btn');
  searchBtn.addEventListener('click', () => {
    const searchInput = document.querySelector('#search-input').value;
    if (searchInput !== '') {
      const items = document.querySelector('#items');
      if (items !== '') {
        items.innerHTML = '';
        createProductList(getSearchItem());
      } else {
        createProductList(getSearchItem());
      }
    }
  })
}

// Baseado na aula do Vitor
const createProductList = (searchFor) => {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${searchFor}`;
  fetch(endpoint)
  .then(response => response.json())
  .then((data) => {
    const items = document.querySelector('.items');

    data.results.forEach((product) => {
      const { id: sku, title: name, thumbnail: image, price: price } = product;
      const item = createProductItemElement({ sku, name, image, price });
      items.appendChild(item);
    });
  });
};

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

const settingsCartBtn = () => {
  let cartIsShown = false;
  const btnCart = document.querySelector('#btn-cart');
  btnCart.addEventListener('click', () => {
    const cart = document.querySelector('#cart');
    if (cartIsShown) {
      cart.style.display = 'none';
      cartIsShown = false;
    } else {
      cart.style.display = 'flex';
      cartIsShown = true;
    }
  })
}

const selectCurrency = () => {
  const inputCurrency = document.querySelector('#input-currency');
  const firstCurrency = document.querySelector('#first-currency');
  const secondCurrency = document.querySelector('#second-currency');
  
  let boo = true;
  inputCurrency.addEventListener('click', () => {
    if (boo) {
      firstCurrency.className = 'shadow-currency';
      secondCurrency.className = 'selected-currency';
      boo = false;
    } else {
      secondCurrency.className = 'shadow-currency';
      firstCurrency.className = 'selected-currency';
      boo = true;
    }
  });
}

window.onload = function onload() {
  settingsCartBtn();
  settingsSearchBtn();
  selectCurrency();
};
