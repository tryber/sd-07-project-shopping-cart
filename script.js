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

function createProductItemElement({
  sku,
  name,
  image,
}) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}
const handleProducts = (products) => {
  const items = document.querySelector('.items');
  products.forEach((product) => {
    const id = product.id;
    const title = product.title;
    const thumbnail = product.thumbnail;
    const addItem = createProductItemElement({
      sku: id,
      name: title,
      image: thumbnail,
    });
    items.appendChild(addItem);
  });
};


const showAlert = (message) => {
  window.alert(message);
};
const totalCar = async (price) => {
  const totalPrice = document.querySelector('.total-price').innerHTML;
  const totalPedido = (parseFloat(totalPrice) + parseFloat(price));
  document.querySelector('.total-price').innerHTML = totalPedido;
  localStorage.setItem('updateTotal', totalPedido);
};

function cartItemClickListener(event, sku, salePrice) {
  // coloque seu código aqui
  console.log(salePrice);
  const keyLocalStorage = sku;
  const price = parseFloat(salePrice) * -1;
  totalCar(price);
  localStorage.removeItem(keyLocalStorage);
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', function (event) {
    cartItemClickListener(event, sku, salePrice);
  });
  return li;
}
/*------------------------------------*/
const handleProductPerId = (product) => {
  const ol = document.querySelector('.cart__items');
  const addItem = createCartItemElement({
    sku: product.id,
    name: product.title,
    salePrice: product.price,
  });
  ol.appendChild(addItem);
  localStorage.setItem(product.id, addItem.innerText);
  totalCar(product.price);
};
const fetchProductPerId = async (id) => {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  try {
    const response = await fetch(endpoint);
    const object = await response.json();

    if (response.error) {
      throw new Error(response.error);
    } else {
      handleProductPerId(object);
    }
  } catch (error) {
    showAlert(`Houve um erro ${error} - Entre em contato com o suporte`);
  }
};
const getIdButtonClicked = () => {
  const id = event.target.parentNode.firstChild.innerText;
  fetchProductPerId(id);
};
const getButtonProduct = () => {
  const itemAdd = document.querySelectorAll('.item__add');
  itemAdd.forEach((item) => {
    item.addEventListener('click', getIdButtonClicked);
  });
};
const hideLoading = () => {
  const container = document.querySelector('.container');
  container.removeChild(document.querySelector('.loading'));
};
const showLoading = () => {
  const container = document.querySelector('.container');
  const msg = document.createElement('p');
  msg.className = 'loading';
  msg.innerText = 'loading...';
  container.appendChild(msg);
};
const fetchProductsML = async () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  try {
    const response = await fetch(endpoint);
    const object = await response.json();
    hideLoading();
    if (response.error) {
      throw new Error(response.error);
    } else {
      handleProducts(object.results);
      getButtonProduct();
    }
  } catch (error) {
    showAlert(`Houve um erro ${error} - Entre em contato com o suporte`);
  }
};
const loadItemsLocalStorage = () => {
  const values = Object.values(localStorage);
  const ol = document.querySelector('.cart__items');
  values.forEach((value) => {
    if (value.startsWith('SKU')) {
      const li = document.createElement('li');
      li.className = 'cart__item';
      li.innerText = `${value}`;
      li.addEventListener('click', cartItemClickListener);
      ol.appendChild(li);
    }
  });
  if (values.length >= 1) {
    const updateTotal = localStorage.getItem('updateTotal');
    document.querySelector('.total-price').innerHTML = updateTotal;
  }
};
const emptyCarHandle = () => {
  const ol = document.querySelector('.cart__items');
  while (ol.hasChildNodes()) {
    ol.removeChild(ol.firstChild);
  }
  document.querySelector('.total-price').innerHTML = '0.00';
  localStorage.clear();
};
const getButtonEmptyCart = () => {
  const emptyCar = document.querySelector('.empty-cart');
  emptyCar.addEventListener('click', emptyCarHandle);
};


window.onload = function onload() {
  showLoading();
  fetchProductsML();
  loadItemsLocalStorage();
  getButtonEmptyCart();
};
