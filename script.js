const allItems = document.querySelector('.items');
const shoppingCart = document.querySelector('.cart__items');
const ClearShoppingCartBtn = document.querySelector('.empty-cart');
const totalPriceTxt = document.querySelector('.total-price');

function saveShoppingCart() {
  localStorage.clear();
  const savedLi = [{ texto: '', classe: '' }];
  const items = [];
  for (let i = 0; i < shoppingCart.childElementCount; i += 1) {
    savedLi.text = shoppingCart.children[i].innerText;
    savedLi.class = shoppingCart.children[i].className;
    items.push(Object.assign({}, savedLi));
  }
  localStorage.setItem('shoppingCartList', JSON.stringify(items));
}

async function sumItems() {
  let totalPrice = 0;
  const allCartItems = shoppingCart.querySelectorAll('li');
  await allCartItems.forEach((item) => {
    totalPrice += Number(item.innerText.split('$')[1]);
  });
  totalPriceTxt.innerText = totalPrice;
}


function cartItemClickListener(event) {
  shoppingCart.removeChild(event.target);
  sumItems();
  saveShoppingCart();
}

function loadSavedShoppingCart(shoppingCartList) {
  const savedShoppingCartList = JSON.parse(shoppingCartList);
  savedShoppingCartList.forEach((item) => {
    const savedItem = document.createElement('li');
    savedItem.className = item.class;
    savedItem.innerText = item.text;
    shoppingCart.appendChild(savedItem);
    savedItem.addEventListener('click', cartItemClickListener);
  });
  sumItems();
}

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

const loadingTxt = () => {
  allItems.appendChild(createCustomElement('p', 'loading', 'loading...'));
};

function removeLoadingTxt() {
  const removeTxt = document.querySelector('.loading');
  removeTxt.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductItemElement({ sku, name, image, salePrice }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', () => {
    const addCart = createCartItemElement({ sku, name, salePrice });
    shoppingCart.appendChild(addCart);
    /* .addEventListener('click', () => {
      // shoppingCart.removeChild(addCart);
      // (bem mais facil dessa forma doke com o event.target na minha opiniao)
    }); */
    sumItems();
    saveShoppingCart();
  });

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const loadProducts = () => {
  const term = 'computador';
  loadingTxt();
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${term}`)
  .then((response) => {
    response.json()
    .then((data) => {
      removeLoadingTxt();
      if (data.results.length > 0) {
        data.results.forEach((product) => {
          const { id: sku, title: name, thumbnail: image, price: salePrice } = product;
          const item = createProductItemElement({ sku, name, image, salePrice });
          allItems.appendChild(item);
        });
      } else {
        console.error('TERM INVALID');
      }
    })
    .catch(error => console.error('ERROR! Nao foi possivel converter pra json. Link ou term invalido.'));
  })
  .catch(error => console.error('ERROR! Link invalido.'));
};


function ClearShoppingCart() {
  ClearShoppingCartBtn.addEventListener('click', function () {
    /* while (tarefaList.firstChild) { !! Alternativa !!
      tarefaList.removeChild(tarefaList.firstChild);
    } */
    shoppingCart.innerHTML = '';
    sumItems();
    saveShoppingCart();
  });
}

window.onload = function onload() {
  const shoppingCartList = localStorage.getItem('shoppingCartList');
  if (shoppingCartList !== null) {
    loadSavedShoppingCart(shoppingCartList);
  }
  loadProducts();
  ClearShoppingCart();
};
