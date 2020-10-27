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

const createProductItemElement = ({
  id: sku,
  title: name,
  thumbnail: image,
  price: salesPrice,
}) => {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.setAttribute('item-price', salesPrice);

  return section;
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const createPrice = (totalPrice) => {
  const cart = document.querySelector('.cart');
  const prices = document.querySelector('.total-price');
  prices.innerHTML = `${totalPrice}`;
  cart.appendChild(prices);
  return prices;
};

const totalPrice = () => {
  const cartItems = document.querySelectorAll('.cart__item');
  let sum = 0;
  cartItems.forEach((item) => {
    const getPrice = parseFloat(item.getAttribute('item-price'));
    sum += getPrice;
  });
  createPrice(sum);
  return sum;
};

function cartItemClickListener(event) {
  event.target.remove();
  totalPrice();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const cartItems = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.setAttribute('item-price', salePrice);
  li.addEventListener('click', cartItemClickListener);
  cartItems.appendChild(li);
  const cartSave = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('savedItems', cartSave);
  totalPrice();
}

const removeAllItems = () => {
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerHTML = '';
  localStorage.clear();
  totalPrice();
};

const loadElements = () => {
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('savedItems');
  document.querySelectorAll('.cart__items li')
    .forEach(e => e.addEventListener('click', cartItemClickListener));
  const buttonRemove = document.querySelector('.empty-cart');
  buttonRemove.addEventListener('click', removeAllItems);
  totalPrice();
};

const fetchProduct = async (id) => {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  await fetch(endpoint)
    .then(response => response.json())
    .then(data => createCartItemElement(data))
    .catch(error => error);
};

const clickButton = () => {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const resultButton = event.target.parentNode;
      const textId = resultButton.childNodes[0].innerText;
      fetchProduct(textId);
    });
  });
};

const loading = () => {
  const body = document.querySelector('body');
  const loadElement = document.createElement('div');
  loadElement.className = 'loading';
  loadElement.innerText = 'loading...';
  body.appendChild(loadElement);
};

const removeLoading = () => {
  const body = document.querySelector('body');
  const loadingElement = document.querySelector('.loading');
  body.removeChild(loadingElement);
};

const fetchCurrency = async (currency) => {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${currency}`;
  try {
    loading();
    const response = await fetch(endpoint);
    removeLoading();
    const object = await response.json();

    if (object.error) {
      throw new Error(object.error);
    } else {
      object.results.forEach((item) => {
        // Criação de Div produto
        const classItems = document.querySelector('.items');
        classItems.appendChild(createProductItemElement(item));
        // Criação Title Produto
        createCustomElement('p', 'item-title', item.title);
        // Criação img Produto
        createProductImageElement(item.thumbnail);
      });
      clickButton(object.results);
    }
  } catch (error) {
    console.error(error);
  }
};

window.onload = function onload() {
  fetchCurrency('computador');
  loadElements();
};
