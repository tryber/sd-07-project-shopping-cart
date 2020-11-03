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
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );
  return section;
}
// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }
function cartItemClickListener(event, salePrice) {
  const totalPriceEl = document.querySelector('.total-price');
  const totalPrice = parseFloat(totalPriceEl.innerText) - salePrice;
  totalPriceEl.innerText = totalPrice;

  return event.target.remove();
}
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => {
    cartItemClickListener(event, salePrice);
  });
  return li;
}

function loadingRequest(loading = true) {
  if (loading === true) {
    const span = document.createElement('span');
    span.innerText = 'Loading...';
    span.setAttribute('class', 'loading');

    document.body.appendChild(span);
  } else {
    document.querySelector('.loading').remove();
  }
}

const receiveTotalPrice = async (newprice) => {
  const totalEl = document.querySelector('.total-price');

  const response = await newprice;
  const total = Math.round((parseFloat(totalEl.innerText) + response) * 100) / 100;
  totalEl.innerText = total;
};

function addItemToCart(buttons) {
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.parentNode.querySelector('.item__sku');
      const param = { headers: { Accept: 'application/json' } };
      fetch(
        `https://api.mercadolibre.com/items/${item.innerText}`,
        param,
      ).then((response) => {
        response.json().then((data) => {
          const cartItems = document.getElementById('cart__items');
          const infoProduct = {
            sku: data.id,
            name: data.title,
            salePrice: data.price,
          };

          receiveTotalPrice(data.price);
          cartItems.appendChild(createCartItemElement(infoProduct));
        });
      });
    });
  });
}

function addItemsGotFromQuery(data) {
  const itemsSection = document.getElementById('items');
  const item = data.forEach(({ id, title, thumbnail }) => {
    itemsSection.appendChild(createProductItemElement({
      sku: id, name: title, image: thumbnail,
    }));
  });
  const items = document.querySelectorAll('.item__add');
  addItemToCart(items);
  return item;
}

function getAllItemsFromApi() {
  const param = { headers: { Accept: 'application/json' } };
  loadingRequest();
  fetch(
    'https://api.mercadolibre.com/sites/MLB/search?q=computador',
    param,
  ).then((response) => {
    response
      .json()
      .then((data) => {
        const results = data.results;
        addItemsGotFromQuery(results);
      });
    loadingRequest(false);
  });
}

function removeItemsFromCart() {
  const cartItems = document.getElementById('cart__items');
  const emptyCard = document.querySelector('.empty-cart');
  emptyCard.addEventListener('click', () => {
    cartItems.innerHTML = '';
    document.querySelector('.total-price').innerText = '0.00';
  });
}

window.onload = function onload() {
  getAllItemsFromApi();
  removeItemsFromCart();
};
