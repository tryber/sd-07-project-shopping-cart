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

async function sumCart() {
  const productsInCart = document.querySelectorAll('.cart__item');
  const totalPrice = document.querySelector('.total-price');
  let sum = 0;
  for (let item = 0; item < productsInCart.length; item += 1) {
    const priceCart = productsInCart[item]
      .innerText.split(' | ')[2].split(': ')[1].replace('$', '');
    sum += Number(priceCart);
  }
  totalPrice.innerText = `${sum}`;
}

function registeCartLocalStorage(trigered) {
  const productsInCart = document.querySelectorAll('.cart__item');
  if (trigered === 'remove') localStorage.clear();
  const auxArray = [];
  for (let item = 0; item < productsInCart.length; item += 1) {
    const skuCart = productsInCart[item].innerText;
    auxArray.push(skuCart);
  }
  localStorage.setItem('Items', auxArray);
}

function cartItemClickListener(event) {
  event.target.remove();
  registeCartLocalStorage('remove');
  sumCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}


async function registerToCart(itemID) {
  const endpoint = `https://api.mercadolibre.com/items/${itemID}`;
  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    const { id: sku, title: name, price: salePrice } = data;
    const productComponents = { sku, name, salePrice };
    const cartItems = document.querySelector('.cart__items');
    const productCart = createCartItemElement(productComponents);
    cartItems.appendChild(productCart);
    sumCart();
  } catch (error) {
    console.error(error);
  }
}

async function addToCart(productAdd) {
  const itemID = getSkuFromProductItem(productAdd.target.parentElement);
  await registerToCart(itemID);
  registeCartLocalStorage('add');
}

async function fetchItems() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  try {
    const response = await fetch(endpoint);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    } else {
      for (let index = 0; index < data.results.length; index += 1) {
        const { id: sku, title: name, thumbnail: image } = data.results[index];
        const productComponents = { sku, name, image };
        const items = document.querySelector('.items');
        const product = createProductItemElement(productComponents);
        product.querySelector('button.item__add').addEventListener('click', addToCart);
        items.appendChild(product);
      }
      const loading = document.querySelector('.loading');
      loading.remove();
    }
  } catch (error) {
    console.error(error);
  }
}

function loadCart() {
  if (localStorage.Items) {
    const valuesLocalStorage = localStorage.Items.split(',SK');
    for (let getItem = 0; getItem < valuesLocalStorage.length; getItem += 1) {
      const sku = valuesLocalStorage[getItem].split(' | ')[0].split(': ')[1];
      const name = valuesLocalStorage[getItem].split(' | ')[1].split(': ')[1];
      const salePrice = valuesLocalStorage[getItem].split(' | ')[2].split(': ')[1].replace('$', '');
      const productComponents = { sku, name, salePrice };
      const cartItems = document.querySelector('.cart__items');
      const productCart = createCartItemElement(productComponents);
      cartItems.appendChild(productCart);
      sumCart();
    }
  }
}

function clearCart() {
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerHTML = '';
  sumCart();
  localStorage.clear();
}


window.onload = function onload() {
  fetchItems();
  loadCart();

  const emptyCart = document.querySelector('.empty-cart');
  emptyCart.addEventListener('click', clearCart);
};
