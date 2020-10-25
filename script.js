const getProductItemInfos = (productItem) => {
  const productObject = {
    sku: productItem.id,
    name: productItem.title,
    image: productItem.thumbnail,
    salePrice: productItem.price,
  };
  return productObject;
};

const getProductItemInfosFromSaved = (product) => {
  const productObject = {
    sku: product.substring(product.indexOf('MLB'), product.indexOf(' | ')),
    name: product.substring(product.indexOf('NAME:') + 6, product.indexOf(' | PRICE')),
    salePrice: product.substring(product.indexOf('$') + 1, product.indexOf('</')),
  };
  return productObject;
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

const saveCartToLocalStorage = () => {
  const cartItens = (document.querySelector('.cart__items').innerHTML).split('><');
  localStorage.setItem('cart', cartItens);
};

const sumTotalCart = async () => {
  const totalElement = document.querySelector('.total-price');
  let result = 0;
  const productItensCart = await (document.querySelector('.cart__items').innerText).split('SKU: ');
  await productItensCart.forEach((product) => {
    const productPrice = (product.substring(product.indexOf('$') + 1, product.length));
    result = (productPrice !== '') ? result + parseFloat(productPrice) : result + 0;
  });
  totalElement.innerText = result;
};

function cartItemClickListener(event) {
  event.target.remove();
  saveCartToLocalStorage();
  sumTotalCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addCartProductItens = (object, from) => {
  let productInfo = null;
  if (from === 'load') {
    productInfo = getProductItemInfosFromSaved(object);
  } else {
    productInfo = getProductItemInfos(object);
  }
  const cartElement = document.querySelector('.cart__items');
  const productElement = createCartItemElement(productInfo);
  cartElement.appendChild(productElement);
  sumTotalCart();
  saveCartToLocalStorage();
};

const renderProductItensList = (element) => {
  const itensSection = document.querySelector('.items');
  itensSection.appendChild(element);
};

const createProductItensList = (object) => {
  object.forEach((product) => {
    const productInfos = getProductItemInfos(product);
    const itemElement = createProductItemElement(productInfos);
    renderProductItensList(itemElement);
  });
};

const loadingTextOnScreen = (isLoading) => {
  const itensSection = document.querySelector('.items');
  if (isLoading) {
    const loadingElement = document.createElement('p');
    loadingElement.className = 'loading';
    loadingElement.innerText = 'loading...';
    itensSection.appendChild(loadingElement);
  } else {
    itensSection.innerHTML = '';
  }
};

const fetchProductItens = async (term) => {
  loadingTextOnScreen(true);
  const query = term;
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
  try {
    const response = await fetch(endpoint);
    const object = await response.json();
    loadingTextOnScreen(false);
    createProductItensList(object.results);
  } catch (error) {
    alert(error);
  }
};

const fetchProductItemId = async (itemId) => {
  const endpoint = `https://api.mercadolibre.com/items/${itemId}`;
  try {
    const response = await fetch(endpoint);
    const object = await response.json();
    addCartProductItens(object, 'api');
  } catch (error) {
    alert(error);
  }
};

const loadCartFromLocalStorage = () => {
  const cartSkuItensSaved = localStorage.getItem('cart');
  if (cartSkuItensSaved !== null && cartSkuItensSaved !== '') {
    const cartSkuItensSavedList = cartSkuItensSaved.split(',');
    cartSkuItensSavedList.forEach((product) => {
      addCartProductItens(product, 'load');
    });
  }
};

const listItemClickListener = (event) => {
  if (event.target.className === 'item__add') {
    const itemId = getSkuFromProductItem(event.target.parentElement);
    fetchProductItemId(itemId);
  }
};

const removeAllProductsCartListener = (event) => {
  const cartElement = document.querySelector('.cart__items');
  cartElement.innerText = '';
  sumTotalCart();
  saveCartToLocalStorage();
};

window.onload = function onload() {
  const itensSection = document.querySelector('.items');
  const buttonEmptyCart = document.querySelector('.empty-cart');
  fetchProductItens('computador');
  itensSection.addEventListener('click', listItemClickListener);
  buttonEmptyCart.addEventListener('click', removeAllProductsCartListener);
  loadCartFromLocalStorage();
  sumTotalCart();
};
