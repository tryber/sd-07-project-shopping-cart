function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function onLoading() {
  const loadText = createCustomElement('h1', 'loading', 'loading...');
  const section = document.querySelector('.items');
  section.insertAdjacentElement('afterbegin', loadText);
}

function doneLoading() {
  setTimeout(() => {
    document.querySelector('.loading').remove();
  }, 1000);
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function calculatePrice() {
  return new Promise((resolve) => {
    const prices = [];
    document
      .querySelectorAll('.cart__item')
      .forEach(data => prices.push(Number(data.dataset.price)));
    const value = prices.reduce((acc, crr) => acc + crr, 0);
    resolve(parseFloat(value.toFixed(2)));
  });
}
async function sumTotalCart() {
  const priceChild = document.querySelector('.total-price-child');
  const value = await calculatePrice();
  if (priceChild.innerText === '') {
    priceChild.innerText = value;
  }
  if (value === 0) {
    priceChild.innerHTML = '';
  } else {
    priceChild.innerHTML = '';
    priceChild.innerText = value;
  }
}

function cartItemClickListener(event) {
  event.target.remove();
  const id = event.target.innerText.split(' ')[1];
  localStorage.removeItem(id);
  sumTotalCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.dataset.price = salePrice;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToCart = ({ sku, name, salePrice }) => {
  const ListItems = document.querySelector('ol.cart__items');
  const listItem = createCartItemElement({ sku, name, salePrice });
  ListItems.appendChild(listItem);
  sumTotalCart();
};

const fetchAddCart = (id) => {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  fetch(endpoint)
    .then(response => response.json())
    .then((data) => {
      const { id: sku, title: name, price: salePrice } = data;
      addToCart({ sku, name, salePrice });
      localStorage.setItem(id, JSON.stringify(data));
    });
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  button.addEventListener('click', () => {
    const item = button.parentElement;
    fetchAddCart(getSkuFromProductItem(item));
  });
  return section;
}

const loadProducts = () => {
  onLoading();
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(endpoint)
    .then(response => response.json())
    .then((data) => {
      const items = document.querySelector('.items');
      data.results.forEach((produto) => {
        const { id: sku, title: name, thumbnail: image } = produto;
        const item = createProductItemElement({ sku, name, image });
        items.appendChild(item);
      });
    })
    .then(doneLoading());
};

const reloadList = () => {
  const values = Object.values(localStorage);
  values.forEach(async (value) => {
    console.log(JSON.parse(value));
    const { id: sku, title: name, price: salePrice } = JSON.parse(value);
    await addToCart({ sku, name, salePrice });
  });
};

function clearButton() {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    const cartList = document.querySelector('.cart__items');
    cartList.innerHTML = '';
    localStorage.clear();
    sumTotalCart();
  });
}

window.onload = async function onload() {
  await loadProducts();
  reloadList();
  clearButton();
};
