const savedLocalStorage = () => {
  const dadList = document.querySelector('ol');
  localStorage.setItem('Cart_Shooping', dadList.innerHTML);
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

function cartItemClickListener(event) {
  event.currentTarget.remove('');
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
const addProductInCart = (event) => {
  const itemClicked = event.target.parentNode;
  const cart = document.querySelector('.cart__items');
  const itemId = itemClicked.querySelector('.item__sku');
  const addHtml = itemId.innerHTML;
  fetch(`https://api.mercadolibre.com/items/${addHtml}`)
    .then(response => response.json())
    .then(({ id: sku, title: name, price: salePrice }) => {
      const destructionAll = {
        sku,
        name,
        salePrice,
      };
      const itemToCart = createCartItemElement(destructionAll);
      cart.appendChild(itemToCart);
      savedLocalStorage();
    });
};

const checkProdutct = () => {
  const btn = document.querySelectorAll('.item__add');
  btn.forEach((item) => {
    item.addEventListener('click', addProductInCart);
  });
};

const removeLoading = () => {
  const box = document.querySelector('.container');
  const containerChilds = box.children;
  box.removeChild(containerChilds[0]);
};
async function itemsFounded() {
  const itemsBox = document.querySelector('.items');
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(data =>
      data.results.forEach(({ id: sku, title: name, thumbnail: image }) => {
        const changedParam = createProductItemElement({ sku, name, image });
        itemsBox.appendChild(changedParam);
      }),
    );
}

const btnClear = () => {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    localStorage.clear();
  });
};

window.onload = async function onload() {
  await itemsFounded();
  checkProdutct();
  btnClear();
  removeLoading();
  document.querySelector('ol').innerHTML = localStorage.getItem('Cart_Shooping');
};
