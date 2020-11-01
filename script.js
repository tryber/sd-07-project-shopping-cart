localStorageCart = () => {
  const listCart = document.querySelector('.cart__items').innerHTML;
  localStorage.cartItems = listCart;
};

const somarValor = () => {
  const li = document.querySelectorAll('.cart__item');
  console.log(li.innerHTML);
  let totalValue = 0;
  li.forEach((element) => {
    const liPrice = element.innerHTML.split('$');
    totalValue += parseFloat(liPrice[1]);
  });
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerHTML = totalValue;
};

const emptyCart = () => {
  const buttonEmptyCart = document.getElementsByClassName('empty-cart')[0];

  buttonEmptyCart.addEventListener('click', (event) => {
    const cartItensSection = document.querySelector('.cart__items');
    cartItensSection.innerHTML = '';
    localStorage.cartItems = '';
  });
};

function cartItemClickListener(event) {
  event.target.remove();
  localStorageCart();
  somarValor();
}

loadLocalstorageCart = () => {
  if (localStorage.cartItems) {
    document.querySelector('.cart__items').innerHTML = localStorage.cartItems;
    const li = document.querySelectorAll('.cart__item');
    li.forEach((elementList) => {
      elementList.addEventListener('click', cartItemClickListener);
    });
    somarValor();
  }
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

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  const cartItensSection = document.querySelector('.cart__items');
  cartItensSection.appendChild(li);
  somarValor();
}
const addItemCart = (itemId) => {
  const endpoint = `https://api.mercadolibre.com/items/${itemId}`;

  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      if (object.Error) {
        throw new Error(object.Error);
      } else {
        createCartItemElement(object);
        localStorageCart();
      }
    });
};

const fetchComputer = (search) => {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${search}`;

  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      if (object.error) {
        throw new Error(object.error);
      } else {
        // Abstração facilitada pelo colega Vitor Rodrigues
        const itemsSection = document.querySelector('.items');
        const resultProduct = object.results;
        resultProduct.forEach((product) => {
          const { id: sku, title: name, thumbnail: image } = product;
          const eachItem = createProductItemElement({ sku, name, image });
          eachItem.addEventListener('click', (event) => {
            if (event.target.className === 'item__add') {
              addItemCart(product.id);
            }
          });
          itemsSection.appendChild(eachItem);
        });
      }
    });
};

window.onload = function onload() {
  fetchComputer('computador');
  loadLocalstorageCart();
  emptyCart();
};
