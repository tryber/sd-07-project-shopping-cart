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

function removeFromLocalStorage(cartItem) {
  const localCartItems = JSON.parse(localStorage.getItem('cartItems'));
  const str = cartItem.replace(/\s/g, '');

  const newLocalStorage = localCartItems.filter((element) => {
    const strElement = element.replace(/\s/g, '');
    return strElement !== str;
  });

  localStorage.setItem('cartItems', JSON.stringify(newLocalStorage));
}

function getCartItemsPrices() {
  const cartItems = document.querySelector('.cart__items').children;
  let total = 0;

  for (let i = 0; i < cartItems.length; i += 1) {
    const itemSplitting = cartItems[i].innerText.split(' | NAME: ');
    const itemSplittingToName = itemSplitting[1].split(' | PRICE: ');

    const [, price] = itemSplittingToName[1].split('$');

    total += parseFloat(price);
  }

  return total;
}

function calculateTotalPrice() {
  return new Promise((resolve, reject) => {
    const value = getCartItemsPrices();

    if (value >= 0) {
      resolve(value);
    } else {
      reject('-');
    }
  });
}

async function showTotalPrice() {
  const label = document.querySelector('.total-price');

  try {
    const totalValue = await calculateTotalPrice();
    label.innerText = totalValue;
  } catch (error) {
    label.innerText = '-';
  }
}

function cartItemClickListener(e) {
  // coloque seu código aqui
  const cartItem = e.srcElement.innerText;

  const cartList = e.srcElement.parentElement.children;

  for (let i = 0; i < cartList.length; i += 1) {
    if (cartList[i].innerText === cartItem) {
      cartList[i].remove();
    }
  }

  removeFromLocalStorage(cartItem);
  showTotalPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addToLocalStorage({ sku, name, salePrice }) {
  if (localStorage.length === 0) {
    const localCartItems = [];

    localCartItems.push(`SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`);
    localStorage.setItem('cartItems', JSON.stringify(localCartItems));
  } else {
    const locallyCartItems = JSON.parse(localStorage.getItem('cartItems'));

    locallyCartItems.push(`SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`);
    localStorage.setItem('cartItems', JSON.stringify(locallyCartItems));
  }
}
// async function addTotalPrice(salePrice) {
//   const total = document.querySelector('.total-price').innerText;
//   total.innerText = parseInt(total) + salePrice;
//   console.log(total);
// }

function addToCart(itemId) {
  const API_URL = `https://api.mercadolibre.com/items/${itemId}`;
  console.log(API_URL);

  fetch(API_URL)
    .then(object => object.json())
    .then((item) => {
      const itemCart = {
        sku: item.id,
        name: item.title,
        salePrice: item.price,
      };
      const cartItems = document.querySelector('.cart__items');
      cartItems.appendChild(createCartItemElement(itemCart));
      addToLocalStorage(itemCart);
      showTotalPrice();
    });
}

function selectingItemToCart(e) {
  const itemSelected = e.srcElement.parentNode;
  const skuItem = itemSelected.querySelector('.item__sku');
  addToCart(skuItem.innerText);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const newButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(newButton);
  newButton.addEventListener('click', selectingItemToCart);
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const getAllProducts = async () => {
  const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const items = document.querySelector('.items');
  const loadingInfo = document.createElement('p');

  loadingInfo.innerText = 'Loading...';
  loadingInfo.className = 'loading';
  items.appendChild(loadingInfo);
  await fetch(API_URL)
    .then(object => object.json())
    .then((element) => {
      const { results } = (element);
      items.removeChild(loadingInfo);
      results.forEach((result) => {
        const objectResult = {
          sku: result.id,
          name: result.title,
          image: result.thumbnail,
        };
        items.appendChild(createProductItemElement(objectResult));
      });
    });
};

function loadLocalStorage() {
  const localCartItems = JSON.parse(localStorage.getItem('cartItems'));
  const cartItems = document.querySelector('.cart__items');

  localCartItems.forEach((item) => {
    const itemSplitting = item.split(' | NAME: ');
    const itemSplittingToSku = itemSplitting[0].split('SKU: ');
    const itemSplittingToName = itemSplitting[1].split(' | PRICE: $');

    const sku = itemSplittingToSku[1].trim();
    const name = itemSplittingToName[0].trim();
    const salePrice = itemSplittingToName[1].trim();

    cartItems.appendChild(createCartItemElement({ sku, name, salePrice }));
  });
}

function emptyCart() {
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerText = '';
}

window.onload = function onload() {
  getAllProducts();

  const emptyCartButton = document.querySelector('.empty-cart');
  emptyCartButton.addEventListener('click', emptyCart);

  if (localStorage.length > 0) {
    loadLocalStorage();
    showTotalPrice();
  }
};
