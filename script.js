window.onload = function onload() {
  fetchAPI();
  cartItemClickListener();
  clearAll();
  webStoreRecover();
};

const insertCartItem = async (sku) => {
  const getApi = await fetch(`https://api.mercadolibre.com/items/${sku}`);
  const json = await getApi.json();
  const data = json;

  createCartItemElement(data);
};

function createProductImageElement(imageSource) { // -> insere a imagem na div
  const img = document.createElement("img");
  img.className = "item__image";
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) { // -> insere os dados da imagem
  const e = document.createElement(element);
  e.className = className;
  cartItemClickListener;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({
  id: sku,
  title: name,
  thumbnail: image
}) { // -> cria o elemento e seus atributos

  const section = document.createElement("section");
  section.className = "item";

  section.appendChild(createCustomElement("span", "item__sku", sku));
  section.appendChild(createCustomElement("span", "item__title", name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement("button", "item__add", "Adicionar ao carrinho!"));
  appendElement(section);
  return section;
}

const appendElement = (section) => {
  const element = document.querySelector(".items");
  element.appendChild(section);
};

function getSkuFromProductItem(item) {
  return item.querySelector("span.item__sku").innerText;
}

function cartItemClickListener() {
  const buttonClass = "item__add";
  document.addEventListener("click", (e) => { // The event happens before the element exist, so it is not possible get the element
    const elementSelected = e.target.className;
    if (elementSelected === buttonClass) {
      const sku = e.target.parentNode.firstChild.innerText;
      insertCartItem(sku);
    }
  });
}

const clearAll = () => {
  const button = document.querySelector(".empty-cart");
  const ol = document.querySelector(".cart__items");
  button.addEventListener("click", () => {
    ol.innerText = "";
    localStorage.clear();
  });
};

const removeOne = (event) => {
  const ol = document.querySelector(".cart__items");
  const targeElement = event.target;
  ol.removeChild(targeElement);
  removeFromStorage(targeElement);
};

function createCartItemElement({
  id: sku,
  title: name,
  price: salePrice
}) {
  const li = document.createElement("li");
  const ol = document.querySelector(".cart__items");
  const objItems = {
    sku,
    name,
    salePrice
  };
  li.className = "cart__item";
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  ol.appendChild(li);
  li.addEventListener("click", removeOne);
  localStorage.setItem(sku, JSON.stringify(objItems));
  return li;
}

const fetchAPI = async () => {
  try {
    const getPromise = await fetch("https://api.mercadolibre.com/sites/MLB/search?q=computador");
    const json = await getPromise.json();
    const data = json.results;
    data.forEach(createProductItemElement);
  } catch (err) {
    throw new Error(`You are facing an error. ${err}`);
  }
};

const createItemsFromStorage = ({
  sku,
  name,
  salePrice
}) => {
  const li = document.createElement("li");
  const ol = document.querySelector(".cart__items");
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.classList.add("selected");
  ol.appendChild(li);
  li.addEventListener("click", removeOne);
  return li;
};

const loadWebStorage = () => {
  const storedItems = [];
  console.log(localStorage.length);
  for (let index = 0; index < localStorage.length; index += 1) {
    storedItems.push(JSON.parse(localStorage.getItem(localStorage.key(index))));
  }

  // localStorage.clear();
  return storedItems;
};

const removeFromStorage = (target) => {
  const thisItem = target;
  const word = thisItem.innerText;
  const test = word.split("");
  const array = [];
  for (let index = 5; index < 18; index += 1) {
    array.push(test[index]);
  }
  if (array.includes(" ")) {
    array.pop();
  }
  const key = array.join("");
  if (thisItem.className === "selected" || thisItem.className === 'cart__item') {
    localStorage.removeItem(key);
  }
};

const webStoreRecover = () => {
  const arrayItems = loadWebStorage();
  arrayItems.forEach((item) => {
    console.log(item);
    const li = createItemsFromStorage(item);
    const ol = document.querySelector(".cart__items");
    ol.appendChild(li);
  });
};