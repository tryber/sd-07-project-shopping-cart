const totalPrice = () => {
  const items = document.querySelectorAll('.cart__item');
  const total = document.querySelector('.total-price');
  let sumPrices = 0;
  items.forEach((item) => {
    const itemPrice = parseFloat(item.getAttribute('value'));
    sumPrices += itemPrice;
  });
  total.innerHTML = `${sumPrices}`;
};

const addLocalStorage = () => {
  const cartItems = document.querySelector('ol.cart__items');
  localStorage.setItem('Cart', cartItems.innerHTML);
};

const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const createProductItemElement = ({ id, title, thumbnail }) => {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
};

const getSkuFromProductItem = item => item.querySelector('span.item__sku').innerText;

const cartItemClickListener = (event) => {
  event.path[1].removeChild(event.path[0]);
  totalPrice();
  addLocalStorage();
};

const removeCart = () => {
  const cartList = document.getElementsByClassName('cart__items')[0];
  cartList.innerHTML = '';
  totalPrice();
  addLocalStorage();
};

const buttonRemoveCart = () => {
  const removeButton = document.getElementsByClassName('empty-cart')[0];
  removeButton.addEventListener('click', removeCart);
};

const createCartItemElement = ({ id, title, price }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  li.setAttribute('value', price);
  return li;
};

const loadingProduct = () => {
  document.getElementsByClassName('items')[0].appendChild(
  createCustomElement('h1', 'loading', 'Loading...'));
};

const loadingComplete = () => document.getElementsByClassName('loading')[0].remove();

const buttonAddApi = (productID) => {
  fetch(`https://api.mercadolibre.com/items/${productID}`)
    .then((response) => {
      response.json()
        .then((data) => {
          const addProductCart = document.getElementsByClassName('cart__items')[0];
          addProductCart.appendChild(createCartItemElement(data));
          totalPrice();
          addLocalStorage();
        });
    });
};

const itemsApi = (search) => {
  loadingProduct();
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${search}`)
    .then((response) => {
      response.json()
        .then((data) => {
          loadingComplete();
          const sectionItems = document.getElementsByClassName('items')[0];
          const product = data.results;
          product.forEach(item =>
            sectionItems.appendChild(createProductItemElement(item)),
          );
          const buttonAddCart = document.querySelectorAll('.item__add');
          buttonAddCart.forEach((button) => {
            button.addEventListener('click', (event) => {
              const ID = event.target.parentNode.firstChild.innerHTML;
              buttonAddApi(ID);
            });
          });
        });
    });
};

const getLocalStorage = () => {
  const cartItems = document.querySelector('ol.cart__items');
  cartItems.innerHTML = localStorage.getItem('Cart');
  cartItems.childNodes.forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
  totalPrice();
};

window.onload = () => {
  itemsApi('computador');
  buttonRemoveCart();
  getLocalStorage();
};

// Projeto com ajuda de Lugh Walle e Emanuelle Brasil.
