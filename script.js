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

function addItem(element) {
  const section = document.querySelector('.items');
  section.appendChild(element);
}

function createProductItemElement(name, sku, image) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  addItem(section);
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }
function changePrice(salePrice, procedure) {
  if (procedure === 'add') {
    const total = document.querySelector('.total-price');
    total.innerText = Number(salePrice) + Number(total.innerText);
  } else {
    const total = document.querySelector('.total-price');
    total.innerText = Number(total.innerText) - Number(salePrice);
  }
}

function createCartItemElement(sku, name, salePrice) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  document.querySelector('.cart__items').appendChild(li);
  li.addEventListener('click', () => {
    changePrice(salePrice, 'remove');
    li.remove();
  });
  localStorage.setItem('list', document.querySelector('.cart__items').innerHTML);
}

function cartItemClickListener() {
  const buttons = document.querySelectorAll('button.item__add');
  buttons.forEach(button =>
    button.addEventListener('click', () => {
      const sku = button.parentNode.firstChild.innerText;
      fetch(`https://api.mercadolibre.com/items/${sku}`)
        .then(response => response.json())
        .then((data) => {
          createCartItemElement(data.id, data.title, data.price);
          changePrice(data.price, 'add');
        });
    }));
}

function fetchProduct(products) {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${products}`)
    .then(response => response.json())
    .then((data) => {
      data.results.forEach((element) => {
        const name = element.title;
        const sku = element.id;
        const image = element.thumbnail;
        createProductItemElement(name, sku, image);
      });
    })
    .then(cartItemClickListener);
}

window.onload = function onload() {
  fetchProduct('computador');
  const elements = localStorage.getItem('list');
  document.querySelector('.cart__items').innerHTML = elements;
  document.querySelector('.empty-cart').addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    document.querySelector('.total-price').innerText = 0;
    localStorage.clear();
  });
};
