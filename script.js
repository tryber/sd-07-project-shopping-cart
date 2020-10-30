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

const totalize = () => {
  const cartList = document.querySelector('.cart__items');
  const spamTotal = document.querySelector('.total-price');
  let cartTotal = 0;
  cartList.childNodes.forEach((element) => {
    cartTotal += parseFloat(element.dataset.salePrice, 10);
  });
  if (cartTotal !== 0) {
    spamTotal.innerHTML = cartTotal;
  } else {
    spamTotal.innerHTML = '';
    localStorage.clear();
  }
};

function cartItemClickListener(event) {
  const cartList = document.querySelector('.cart__items');
  cartList.removeChild(event.target);
  localStorage.setItem('cartContent', cartList.innerHTML);
  totalize();
}

const reload = () => {
  const list = localStorage.getItem('cartContent');
  const cartList = document.querySelector('.cart__items');
  cartList.innerHTML = list;
  cartList.childNodes.forEach((element) => {
    element.addEventListener('click', cartItemClickListener);
  });
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.dataset.salePrice = salePrice;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchCart = async (toMyCart) => {
  const endpoint = `https://api.mercadolibre.com/items/${toMyCart}`;
  try {
    const cart = document.querySelector('.cart');
    const loading = createCustomElement('span', 'loading', 'loading...');
    cart.appendChild(loading);
    const response = await fetch(endpoint);
    const object = await response.json();

    if (object.error) {
      throw new Error(object.error);
    } else {
      const { id, title, price } = object;
      const cartItem = createCartItemElement({
        sku: id,
        name: title,
        salePrice: price,
      });
      const cartList = document.querySelector('.cart__items');
      cartList.appendChild(cartItem);
      localStorage.setItem('cartContent', cartList.innerHTML);
      totalize();
    }
    cart.removeChild(loading);
  } catch (error) {
    console.log(error);
  }
};

const handleQuery = (myQueryObject) => {
  const itemsList = document.querySelector('.items');
  myQueryObject.forEach((gondola) => {
    const { id, title, thumbnail } = gondola;
    const item = createProductItemElement({
      sku: id,
      name: title,
      image: thumbnail,
    });
    item.addEventListener('click', () => fetchCart(getSkuFromProductItem(item)));
    itemsList.appendChild(item);
    // item.addEventListener('click', ...)
  });
};

const emptyCart = () => {
  const cartList = document.querySelector('.cart__items');
  const spamTotal = document.querySelector('.total-price');
  cartList.innerHTML = '';
  spamTotal.innerHTML = '';
  localStorage.clear();
};

const fetchQuery = async (myQuery) => {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${myQuery}`;
  try {
    const cart = document.querySelector('.cart');
    const loading = createCustomElement('span', 'loading', 'loading...');
    cart.appendChild(loading);
    const response = await fetch(endpoint);
    const object = await response.json();

    if (object.error) {
      throw new Error(object.error);
    } else {
      handleQuery(object.results);

      const emptyCartButton = document.querySelector('.empty-cart');
      emptyCartButton.addEventListener('click', emptyCart);
    }
    cart.removeChild(loading);
  } catch (error) {
    console.log(error);
  }
};

window.onload = function onload() {
  // Query for computer
  reload();
  totalize();
  const QUERY = 'computador';
  fetchQuery(QUERY);
};
