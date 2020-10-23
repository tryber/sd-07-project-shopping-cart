function receberData(url) {
  return fetch(url);
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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function salvarCarrinho() {
  const carrinho = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('carrinho', carrinho);
}

async function atualizarPrecos() {
  const itensCarrinho = document.querySelectorAll('.cart__item');
  const total = document.querySelector('.total-price');
  let precoTotal = 0;
  itensCarrinho.forEach((item) => {
    const preco = item.innerText.match(/[P][R][I][C][E].*/)[0].slice(8);
    precoTotal += Number(preco);
  });
  total.innerText = precoTotal;
}

async function cartItemClickListener(event) {
  event.target.remove();
  salvarCarrinho();
  atualizarPrecos();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function itensNaTela(data) {
  data.results.forEach((element) => {
    const obj = { sku: element.id, name: element.title, image: element.thumbnail };
    const item = createProductItemElement(obj);
    const items = document.querySelector('.items');
    items.appendChild(item);
  });
}

async function addToCart() {
  const idItemClicado = event.target.parentNode.firstChild.innerText;
  const olCart = document.querySelector('.cart__items');
  const data = await receberData(`https://api.mercadolibre.com/items/${idItemClicado}`);
  const dataJSON = await data.json();
  const obj = { sku: dataJSON.id, name: dataJSON.title, salePrice: dataJSON.price };
  olCart.appendChild(createCartItemElement(obj));
  salvarCarrinho();
  atualizarPrecos();
}

function addEventForEach(tagHtml, evento) {
  const btns = document.querySelectorAll(tagHtml);
  btns.forEach((element) => {
    element.addEventListener('click', evento);
  });
}

function adicionarEventosMain() {
  addEventForEach('.item__add', addToCart);
}

async function carregarPagina() {
  const loading = document.querySelector('.loading');
  const data = await receberData('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const dataJSON = await data.json();
  itensNaTela(dataJSON);
  adicionarEventosMain();
  loading.remove();
}

function limparCarrinho() {
  const olCart = document.querySelector('.cart__items');
  olCart.innerHTML = '';
  salvarCarrinho();
  atualizarPrecos();
}

function adicionarEventosCarrinhos() {
  addEventForEach('.cart__item', cartItemClickListener);
}

function carregarCarrinho() {
  const carrinho = localStorage.getItem('carrinho');
  if (carrinho != null) {
    const olCart = document.querySelector('.cart__items');
    olCart.innerHTML = carrinho;
    adicionarEventosCarrinhos();
  }
}

window.onload = function onload() {
  carregarPagina();
  carregarCarrinho();
  atualizarPrecos();
  const limpar = document.querySelector('.empty-cart');
  limpar.addEventListener('click', limparCarrinho);
};
