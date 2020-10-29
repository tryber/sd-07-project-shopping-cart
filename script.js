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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__id', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

function createCartElement(product) {
  const items = document.querySelector('.items');
  const elementCreated = createProductItemElement(product);
  items.appendChild(elementCreated);
}
function updateTotal(value, operador) {
  const addLoading = document.querySelector('.total-price');
  const total = addLoading.innerText;
  if (operador === '+') {
    addLoading.innerText = `${parseFloat(total) + parseFloat(value)}`;
  } else {
    addLoading.innerText = `${parseFloat(total) - parseFloat(value)}`;
  }
}

function createTotalPrice(value) {
  const addLoading = document.querySelector('.total');
  divLoad = document.createElement('div');
  divLoad.className = 'total-price';
  divLoad.innerText = `${parseFloat(value)}`;
  addLoading.appendChild(divLoad);
}

function cartItemClickListener(event) {
  const removeItem = document.querySelector('.cart__items');
  removeItem.removeChild(event.target);
  const valueItem = event.toElement.innerText.split('$');
  updateTotal(valueItem[1], '-');
  console.log(event.toElement.innerText.split('|')[0].split(':')[1]);
  localStorage.removeItem(event.toElement.innerText.split('|')[0].split(':')[1]);
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function emptyCart() {
  const removeTotal = document.querySelector('.total-price');
  const itensLista = document.querySelector('.cart__items');
  const itens = document.querySelectorAll('.cart__item');
  for (let item = 0; item < itens.length; item += 1) {
    itensLista.removeChild(itens[item]);
  }
  localStorage.clear();
  removeTotal.innerText = '';
}

let index = 1;
function addCartLi(li) {
  const btnempty = document.querySelector('.empty-cart');
  const addLis = document.querySelector('.cart__items');
  addLis.appendChild(li);
  btnempty.addEventListener('click', emptyCart);
  const conteudo = li.innerText;
  localStorage.setItem(index, conteudo);
  index += 1;
}

function pegaArray(li) {
  let price;
  const id = li.split('|')[0].split(':')[1];
  const title = li.split('|')[1].split(':')[1];
  if (li.split('|')[2] === undefined) {
    price = li.split('|')[4].split(': $')[1];
  } else {
    price = li.split('|')[2].split(': $')[1];
  }
  const pricevalue = document.querySelector('.total-price');
  if (pricevalue === null) {
    createTotalPrice(price);
  } else {
    updateTotal(price, '+');
  }
  return { id, title, price };
}

function recuperaCart() {
  for (let item = 0; item <= localStorage.length; item += 1) {
    const getlis = localStorage.getItem(localStorage.key(item));
    if (getlis !== null) {
      const liComplete = createCartItemElement(pegaArray(getlis));
      addCartLi(liComplete);
    }
  }
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__id').innerText;
}

function responseForID(id) {
  const endpointID = `https://api.mercadolibre.com/items/${id}`;
  fetch(endpointID)
    .then(response => response.json())
    .then((productelected) => {
      const pricevalue = document.querySelector('.total-price');
      if (pricevalue === null) {
        createTotalPrice(productelected.price);
      } else {
        updateTotal(productelected.price, '+');
      }
      addCartLi(createCartItemElement(productelected));
    })
    .catch(error => alert(error));
}

function createItemElement(event) {
  const btnAddItem = document.querySelectorAll('.item__add');
  for (let item = 0; item < btnAddItem.length; item += 1) {
    btnAddItem[item].addEventListener(event, () => {
      const id = getSkuFromProductItem(btnAddItem[item].parentNode);
      responseForID(id);
    });
  }
}

function openLoading() {
  const loading = document.querySelector('.cart');
  divLoad = document.createElement('div');
  divLoad.className = 'loading';
  divLoad.innerText = 'loading...';
  loading.appendChild(divLoad);
  setTimeout(() => {
    const loadingfilho = document.querySelector('.loading');
    loading.removeChild(loadingfilho);
  }, 3000);
}

function responseDate(query) {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
  fetch(endpoint)
    .then(response => response.json())
    .then((product) => {
      product.results.forEach(element => createCartElement(element));
      createItemElement('click');
    })
    .then(() => openLoading())
    .catch(error => alert(error));
}

window.onload = () => {
  responseDate('computador');
  if (localStorage.length !== 0) {
    recuperaCart();
  }
};
