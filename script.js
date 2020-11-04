let cartSum = 0;

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createLoadingElement() {
  const loading = document.createElement('p');
  loading.className = 'loading';
  loading.innerText = 'loading...';
  return loading;
}

function loadCartPrice() {
  return new Promise((resolve) => {
    resolve(Math.abs(cartSum.toFixed(2)));
  },
  );
}

async function createPriceElement() {
  const totalPrice = document.querySelector('.total-price');
  const log = await loadCartPrice();
  totalPrice.innerHTML = log;
}

function clearCartItems() {
  document.querySelector('.empty-cart')
    .addEventListener('click', () => {
      document.querySelector('.cart__items').innerHTML = '';
      const cartItemsStorage = [];
      localStorage.setItem('cartItems', JSON.stringify(cartItemsStorage));
      cartSum = 0;
      loadCartPrice();
      createPriceElement();
      console.log(cartSum);
    });
}

function cartItemClickListener(event) {
  console.log(cartSum);
  cartSum -= event.target.getAttribute('data-sale-price');
  console.log(cartSum);
  event.target.remove();
  createPriceElement();
}

function createCartItemElement({ sku, name, salePrice }) {
  const cartItemsStorage = JSON.parse(localStorage.getItem('cartItems'));
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.dataset.sku = sku;
  li.dataset.salePrice = salePrice;
  cartSum += salePrice;
  console.log(cartSum.toFixed(2));
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  document.querySelector('ol').appendChild(li);
  cartItemsStorage.push({ sku, name, salePrice });
  localStorage.setItem('cartItems', JSON.stringify(cartItemsStorage));
  createPriceElement();
}

function loadCartFromStorage() {
  const itemsStorage = JSON.parse(localStorage.getItem('cartItems'));
  for (let i = 0; i < itemsStorage.length; i += 1) {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.dataset.sku = itemsStorage[i].sku;
    li.dataset.salePrice = itemsStorage[i].salePrice;
    cartSum += itemsStorage[i].salePrice;
    console.log(cartSum);
    li.innerText = `SKU: ${itemsStorage[i].sku} | NAME: ${itemsStorage[i].name} | PRICE: $${itemsStorage[i].salePrice}`;
    li.addEventListener('click', cartItemClickListener);
    document.querySelector('ol').appendChild(li);
    loadCartPrice();
  }
  createPriceElement();
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  const secCartItems = document.querySelector('.cart__items');
  const loading = createLoadingElement();
  e.className = className;
  e.innerText = innerText;
  if (e.className === 'item__add') {
    e.addEventListener('click', () => {
      secCartItems.appendChild(loading);
      const item = (e.parentNode.childNodes[0].textContent);
      const endPointItem = `https://api.mercadolibre.com/items/${item}`;
      fetch(endPointItem)
      .then(async (responseItem) => {
        secCartItems.removeChild(loading);
        const { id, title, price } = await responseItem.json();
        createCartItemElement({ sku: id, name: title, salePrice: price });
      },
      );
    });
  }
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

const fetchApiShopping = (product) => {
  const endPoint = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
  const sectionItems = document.querySelector('.container');
  const loading = createLoadingElement();
  sectionItems.appendChild(loading);
  fetch(endPoint)
    .then(response => response.json())
      .then(({ results }) => {
        const items = document.querySelector('.items');
        sectionItems.removeChild(loading);
        results.forEach((result => (
          (items.appendChild(
            createProductItemElement({
              sku: result.id,
              name: result.title,
              image: result.thumbnail }),
          ))
        )
      ));
      });
};

window.onload = function onload() {
  if (!localStorage.getItem('cartItems')) {
    const cartItemsStorage = [];
    localStorage.setItem('cartItems', JSON.stringify(cartItemsStorage));
  } else {
    console.log('Storage já existe!');
    loadCartFromStorage();
  }
  fetchApiShopping('computador');
  clearCartItems();
};
