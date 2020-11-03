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

// Função que cria os itens no HTML
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// Função que pega o numero SKU dos items
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Função que inclui a função createProductItemElement como child da classe .items
function getElementItems(product) {
  const section = document.querySelector('.items');
  section.appendChild(createProductItemElement(product));
}

// Funcão que indica os valores após inclusão e remoção
function priceAndSignal(price, signal) {
  const totalHtml = (document.querySelector('.total-price'));
  const total = Number(totalHtml.innerText);
  if (signal === 'positive') {
    totalHtml.innerText = Number(parseFloat(total + price).toFixed(2));
  } if (signal === 'negative') {
    totalHtml.innerText = Number(parseFloat(total - price).toFixed(2));
  }
}

// Função que salva os itens da lista e o valor total independente de atualização da pagina
function storage() {
  const getList = document.querySelector('.cart__items').innerHTML;
  const getTotalPrice = document.querySelector('.total-price').innerHTML;
  localStorage.setItem('list', getList);
  localStorage.setItem('totalPrice', getTotalPrice);
}

// Função que subtrai o valor do item do total
async function cartItemClickListener(event) {
  const listPrice = event.target.innerText.indexOf('$');
  const priceFinal = event.target.innerText.slice(listPrice + 1);
  priceAndSignal(priceFinal, 'negative');
  event.target.remove();
  storage();
}

// Função que exclui todos os itens do carrinho e zera o valor total
function deleteAll() {
  const eraseAll = document.querySelector('.empty-cart');
  eraseAll.addEventListener('click', () => {
    document.querySelector('.cart__items').innerText = '';
    document.querySelector('.total-price').innerText = 0;
    storage();
  });
}

// Função que cria a lista do carrinho de compras
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Função que inclui a função createCartItemElement como child da classe .cart__items
function getItem(produto) {
  const item = document.querySelector('.cart__items');
  item.appendChild(createCartItemElement(produto));
  storage();
}

// Função que busca na API os dados referente ao SKU, name e salePrice
function convertId(id) {
  const idList = `https://api.mercadolibre.com/items/${id}`;
  fetch(idList)
  .then(respond => (respond.json()))
  .then((objeto) => {
    const product = {
      sku: objeto.id,
      name: objeto.title,
      salePrice: objeto.price,
    };
    priceAndSignal(objeto.price, 'positive');
    getItem(product);
  });
}

// Função complementar a função callButton
function getId(event) { // 2 - segunda funcao
  const id = getSkuFromProductItem(event.target.parentNode);
  convertId(id);
}

/* Função que adiciona os itens no carrinho com o evento de click
em todos os botões com classe .item__add */
function callButton() { // 2 - primeira funcao
  const getButton = document.querySelectorAll('.item__add');
  getButton.forEach((botao) => {
    botao.addEventListener('click', getId);
  });
}

// Função que busca na API de forma assincrona o id, nome e foto
function getApiList() {
  const endPoint = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  fetch(endPoint)
  .then(respond => respond.json())
  .then(objeto => Object.entries(objeto.results).forEach((element) => {
    const product = {
      sku: element[1].id,
      name: element[1].title,
      image: element[1].thumbnail,
    };
    getElementItems(product);
    callButton();
  }));
}

// Função que traz os itens e valor total salvos na função storage
function pageLoaded() {
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('list');
  document.querySelector('.total-price').innerHTML = localStorage.getItem('totalPrice');
  document.querySelectorAll('.cart__item').forEach((loopClick) => {
    loopClick.addEventListener('click', cartItemClickListener);
  });
}

window.onload = function onload() {
  getApiList();
  pageLoaded();
  deleteAll();
};
