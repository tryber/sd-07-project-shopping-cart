window.onload = function onload() { };

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

const calculateCartPrice = async () => {
  const cartItems = document.querySelectorAll('.cart__item');
  let totalPrice = 0;

  cartItems.forEach((item) => {
    const itemInfo = item.innerText;
    const price = Number(itemInfo.split('$')[1]);

    totalPrice += price;
  });

  const totalPriceElement = document.querySelector('.total-price');
  totalPriceElement.innerText = totalPrice;
};

function cartItemClickListener(event) {
  // coloque seu código aqui
  const itemToRemove = event.target;
  const skuToRemoveFromStorage = itemToRemove.innerText.split('|')[0].split(' ')[1];
  let skuPosition;

  for (let index = 0; index < localStorage.length; index += 1) {
    if (localStorage.getItem(index) === skuToRemoveFromStorage) {
      skuPosition = index;
      break;
    }

    if (localStorage.length === 1) localStorage.clear();
  }

  const cartItems = document.querySelector('.cart__items');
  cartItems.removeChild(itemToRemove);
  localStorage.removeItem(skuPosition);
  calculateCartPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const sendProductToCart = (retrievedProduct) => {
  const { id: sku, title: name, price: salePrice } = retrievedProduct;
  const itemGoingToCart = createCartItemElement({ sku, name, salePrice });
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(itemGoingToCart);
  localStorage.setItem('storageCart', cartItems.innerHTML);
  calculateCartPrice();
};

const requestCartProduct = (itemSku) => {
  const api = 'https://api.mercadolibre.com/';
  const endpoint = 'items/';
  const sku = itemSku;
  const requestURL = `${api}${endpoint}${sku}`;

  fetch(requestURL)
  .then(response => response.json())
  .then(data => sendProductToCart(data));
};

const handleProductList = (crudeProductList) => {
  const items = document.querySelector('.items');

  crudeProductList.forEach((product) => {
    const { id: sku, thumbnail: image, title: name } = product;
    const productCard = createProductItemElement({ sku, name, image });

    productCard.lastChild.addEventListener('click', function () {
      const skuToSend = productCard.firstChild.innerText;
      requestCartProduct(skuToSend);
    });

    items.appendChild(productCard);
  });
};

const fetchCartFromStorage = () => {
  const unrefinedCartItems = localStorage.getItem('storageCart');

  if (unrefinedCartItems) {
    const cartItems = unrefinedCartItems.split('</li>');

    cartItems.forEach((item, index) => {
      cartItems[index] = item.split('>')[1];
    });

    cartItems.pop();

    cartItems.forEach((item) => {
      const itemInfo = item.split(' | ');
      const id = itemInfo[0].split(':')[1].substring(1);
      const title = itemInfo[1].split(':')[1].substring(1);
      const price = itemInfo[2].split(':')[1].split('$')[1];

      sendProductToCart({ id, title, price });
    });
  }
};

const removeLoading = () => {
  const loadingBlock = document.querySelector('.loading');
  loadingBlock.remove();
};

const handleRemoveAllButton = () => {
  document.querySelector('.empty-cart').addEventListener('click', function () {
    const cartItems = document.querySelector('.cart__items');
    cartItems.innerHTML = '';
    localStorage.clear();
    calculateCartPrice();
  });
};

const fetchProducts = () => {
  const api = 'https://api.mercadolibre.com/';
  const endpoint = 'sites/MLB/search?q=';
  const searchTerm = 'computador';
  const requestURL = `${api}${endpoint}${searchTerm}`;

  fetch(requestURL)
  .then(response => response.json())
  .then((data) => {
    handleProductList(data.results);
    fetchCartFromStorage();
    handleRemoveAllButton();
  })
  .finally(() => {
    removeLoading();
  });
};

const loading = () => {
  const items = document.querySelector('.items');
  const messageHolder = document.createElement('div');
  messageHolder.innerText = 'loading...';
  messageHolder.classList.add('loading');
  items.appendChild(messageHolder);
};

window.onload = () => {
  loading();
  fetchProducts();
};
