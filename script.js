let valor;
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const load = () => {
  const texto = document.querySelector('.cart');
  const div = document.createElement('div');
  div.className = 'loading';
  div.innerHTML = 'loading...';
  setTimeout(() => { texto.removeChild(texto.querySelector('div')); }, 1000);
  texto.appendChild(div);
};

function cartItemClickListener(event) {
  let IC = event.target;
  if (IC.className !== 'cart__item') {
    IC = event.target.parentNode;
    if (IC.className !== 'cart__item') {
      IC = event.target.parentNode.parentNode;
    }
  }
  IC.parentNode.removeChild(IC);
  localStorage.carrinho = document.querySelector('.cart__items').innerHTML.toString();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const maisalem = ({ price }) => {
  const olpai = document.querySelector('.cart');
  if (olpai.querySelector('.total-price')) {
    valor += price;
    olpai.querySelector('.total-price').innerText = valor;
  } else {
    valor = price;
    const h3 = document.createElement('h3');
    h3.className = 'total-price';
    h3.innerText = valor;
    olpai.appendChild(h3);
  }
};

const infinitoalem = (objeto) => {
  const xablau = createCartItemElement(objeto);
  const xablaupai = document.querySelector('.cart__items');
  maisalem(objeto);
  xablaupai.appendChild(xablau);
  localStorage.carrinho = document.querySelector('.cart__items').innerHTML.toString();
};

const addcarrinho = (event) => {
  let idProduto;
  const ET = event.target;
  if (event.target.className !== 'item__add') {
    idProduto = ET.parentNode.parentNode.parentNode.querySelector('.item__sku').innerText;
  } else {
    idProduto = ET.parentNode.querySelector('.item__sku').innerText;
  }
  load();
  const api = `https://api.mercadolibre.com/items/${idProduto}`;
  fetch(api)
    .then(elemento => elemento.json())
    .then(object => infinitoalem(object));
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', addcarrinho);
  }
  return e;
}

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

const arrayproduto = (produtos) => {
  const itens = document.querySelector('.items');
  for (let index = 0; index < produtos.length; index += 1) {
    const produto = createProductItemElement(produtos[index]);
    itens.appendChild(produto);
  }
};

const requisicao = () => {
  load();
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(endpoint)
    .then(response => response.json())
    .then(object => arrayproduto(object.results));
};

const botao = () => {
  const olpai = document.querySelector('.cart');
  const local = document.querySelector('.empty-cart');
  local.addEventListener('click', (event) => {
    const localdetudo = document.querySelector('.cart__items');
    while (localdetudo.firstChild) {
      localdetudo.removeChild(localdetudo.firstChild);
    }
    valor = 0;
    olpai.querySelector('.total-price').innerText = valor;
  });
};

const LS = () => {
  if (localStorage.carrinho) {
    document.querySelector('.cart__items').innerHTML = localStorage.carrinho;
  } else {
    localStorage.setItem('carrinho', document.querySelector('.cart__items').innerHTML.toString());
  }
};

window.onload = function onload() {
  LS();
  requisicao();
  botao();
};
