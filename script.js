const saveLocalStorage = () => {
  const shoppingCart = document.querySelector('.cart__items');
  localStorage.setItem('List_Shopping_Cart', shoppingCart.innerHTML);
};

const interationShopCartChildrens = (shoppingCartChildrens) => {
  let sum = 0;
  shoppingCartChildrens.forEach((item) => {
    const price = item.innerHTML.split('PRICE: $').splice(1, 1);
    sum += parseFloat(price);
  });
  return sum;
};

const calcPriceItemsCart = async () => {
  const shoppingCart = document.querySelector('.cart__items');
  const shoppingCartChildrens = shoppingCart.childNodes;
  const h1Price = document.querySelector('.total-price');
  h1Price.innerHTML = interationShopCartChildrens(shoppingCartChildrens);
  h1Price.style.display = 'block';
  localStorage.setItem('Price', h1Price.innerHTML);
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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
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

function cartItemClickListener(event) {
  const productsCart = document.querySelector('.cart__items');
  productsCart.removeChild(event.currentTarget);
  saveLocalStorage();
  const shoppingCartChildrens = productsCart.childNodes;
  const h1Price = document.querySelector('.total-price');
  if (shoppingCartChildrens.length > 0) {
    h1Price.innerHTML = interationShopCartChildrens(shoppingCartChildrens);
    localStorage.setItem('Price', h1Price.innerHTML);
  } else {
    h1Price.style.display = 'none';
    localStorage.removeItem('Price', h1Price.innerHTML);
  }
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const endPointMain = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

const fetchPromise = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    return console.log('Erro na Requisição');
  }
};

const addProductCart = (addButtons) => {
  addButtons.forEach((button) => {
    button.addEventListener('click', async function (event) {
      if (button === event.currentTarget) {
        const section = button.parentNode;
        const idButton = getSkuFromProductItem(section);
        const endPointId = `https://api.mercadolibre.com/items/${idButton}`;
        const product = await fetchPromise(endPointId);
        const cart = document.querySelector('.cart__items');
        cart.appendChild(createCartItemElement(product));
        await calcPriceItemsCart();
        saveLocalStorage();
      }
    });
  });
};

const clearButton = () => {
  const cleanButton = document.querySelector('.empty-cart');
  cleanButton.addEventListener('click', () => {
    const shoppingCart = document.querySelector('.cart__items');
    const h1Price = document.querySelector('.total-price');
    shoppingCart.innerHTML = '';
    h1Price.innerHTML = '';
    localStorage.clear();
  });
};

window.onload = async function onload() {
  const container = document.querySelector('.container');
  const loading = createCustomElement('h1', 'loading', 'loading...');
  container.appendChild(loading);

  await fetchPromise(endPointMain).then((products) => {
    const itemsSection = document.querySelector('.items');
    return products.results.map(currentProduct => itemsSection
      .appendChild(createProductItemElement(currentProduct)));
  });

  container.removeChild(loading);
  const addButtons = document.querySelectorAll('.item__add');
  addProductCart(addButtons);

  if (typeof (Storage) !== 'undefined' && localStorage.length !== 0) {
    const productsInCart = document.querySelector('.cart__items');
    const h1Price = document.querySelector('.total-price');
    productsInCart.innerHTML = localStorage.getItem('List_Shopping_Cart');
    productsInCart.childNodes
      .forEach(item => item.addEventListener('click', cartItemClickListener));
    const priceTotal = localStorage.getItem('Price');
    h1Price.innerHTML = priceTotal;
    h1Price.style.display = 'block';
  }

  clearButton();
};
