// const findItemAndReturnArrayObject = async (item) => {
//   const endPoint = `https://api.mercadolibre.com/sites/MLB/search?q=${item}`;
//   try {
//     const response = await fetch(endPoint);
//     const object = await response.json();
//     if (object.error) {
//       throw new Error(object.error);
//     } else {
//       return object.results;
//     }
//   } catch (error) {
//     return alert(error);
//   }
// };

// function appendElementInAClass(classFather, classChild) {
//   father = document.querySelector(classFather);
//   child = document.querySelector(classChild);
//   father.appendChild(child);
// }

// function createProductImageElement(imageSource) {
//   const img = document.createElement('img');
//   img.className = 'item__image';
//   img.src = imageSource;
//   return img;
// }

// function createCustomElement(element, className, innerText) {
//   const e = document.createElement(element);
//   e.className = className;
//   e.innerText = innerText;
//   return e;
// }

// function createProductItemElement({ sku, name, image }) {
//   const section = document.createElement('section');
//   section.className = 'item';
//   section.appendChild(createCustomElement('span', 'item__sku', sku));
//   section.appendChild(createCustomElement('span', 'item__title', name));
//   section.appendChild(createProductImageElement(image));
//   section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
//   return section;
// }

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// const fetchWithProductID = async (productID) => {
//   const endPoint = `https://api.mercadolibre.com/items/${productID}`;
//   try {
//     const response = await fetch(endPoint);
//     const object = await response.json();
//     console.log(object);
//     if (object.error) {
//       throw new Error(object.error);
//     } else {
//       return object.results;
//     }
//   } catch (error) {
//     return alert(error);
//   }
// };

// const getProductId = (event) => {
//   const clickedParent = event.target.parentNode;
//   const idElement = getSkuFromProductItem(clickedParent);
//   const cartToAdd = fetchWithProductID(idElement);
//   const { id: sku, title: name, price: salePrice } = cartToAdd;
//   const cart = createCartItemElement({sku, name, salePrice});
//   const cartList = document.querySelector('cart__items');
//   cartList.appendChild(cart);
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

// const loadProducts = () => {
//   const endPoint = 'https://api.mercadolibre.com/sites/MLB/search?q=$COMPUTADOR';
//   fetch(endPoint)
//   .then(response => (response.json()))
//   .then(response => response.results.forEach((product) => {
//     const items = document.querySelector('.items');
//     const { id: sku, title: name, thumbnail: image } = product;
//     const item = createProductItemElement({ sku, name, image });
//     items.appendChild(item);
//   }));
// };

// window.onload =  async function onload() {
//   await loadProducts();
//   getProductId();
//   // const arrayOfProducts = await findItemAndReturnArrayObject();
//   // console.log(arrayOfProducts);
// };

// Ajuda Karine Moreira - Turma 7, salvou!!!

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
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );
  return section;
}

function saveLocalStorage() {
  const ol = document.querySelector('.cart__items').outerHTML;
  console.log(ol);
  localStorage.setItem('cart', ol);
}

function sumPrice() {
  let sum = 0;
  const itemsPrice = document.querySelectorAll('.cart__item');
  const totalPrice = document.querySelector('.total-price');
  itemsPrice.forEach((item) => {
    sum += parseFloat(item.innerText.split('$')[1]);
  });
  totalPrice.innerText = sum;
  return totalPrice;
}

function cartItemClickListener(event) {
  event.target.remove();
  saveLocalStorage();
  sumPrice();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  sumPrice(salePrice);
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function showCart(id) {
  const endPoint = `https://api.mercadolibre.com/items/${id}`;
  await fetch(endPoint)
  .then(response => response.json())
  .then((object) => {
    document.querySelector('ol').appendChild(createCartItemElement(object));
    saveLocalStorage();
    sumPrice();
  });
}

function clickBtn() {
  const selectButton = document.querySelectorAll('button.item__add');
  selectButton.forEach(element => element.addEventListener('click', () => {
    showCart(getSkuFromProductItem(element.parentElement));
  }));
}

function showList(array) {
  document.querySelector('.loading').remove();
  const items = Object.entries(array);
  items.forEach(entry => document.querySelector('.items').appendChild(createProductItemElement(entry[1])));
}

loadProducts = async () => {
  const endPoint =
    'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  await fetch(endPoint)
    .then(response => response.json())
    .then(object => showList(object.results))
    .then(arrayOfResults => clickBtn(arrayOfResults));
};

function clearCart() {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    document.querySelector('.cart__items').innerText = '';
    saveLocalStorage();
    sumPrice();
  });
}

function loadLocalStorage() {
  if (localStorage.getItem('cart') !== null) {
    const searchOl = document.querySelector('.cart__items');
    searchOl.outerHTML = localStorage.getItem('cart');
    const items = document.querySelectorAll('.cart_item');
    items.forEach(item => item.addEventListener('click', cartItemClickListener));
  }
}

window.onload = function onload() {
  loadProducts();
  clearCart();
  loadLocalStorage();
  sumPrice();
};
