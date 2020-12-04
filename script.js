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
  const addToCartButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  addToCartButton.addEventListener('click', selectedItem);
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(addToCartButton);
  return section;
}

function totalPrice() {
  let total = 0;
  const cartList = document.querySelector('.cart__items').childNodes;
  cartList.forEach((item) => {
    const endpoint = `https://api.mercadolibre.com/items/${item.dataset.sku}`;
    fetch(endpoint).then(response => response.json()).then((data) => {
      const { price: salePrice } = data;
      total += salePrice;
      document.querySelector('.total-price').innerText = total;
    });
  });
}

function removeProducts(id) {
  const list = Object.keys(localStorage);
  if (id === undefined) {
    list.forEach(item => localStorage.removeItem(item));
  }
  list.forEach(item => localStorage.removeItem(id) === item);
}
function cartItemClickListener(event) {
  const id = event.target.dataset.sku;
  removeProducts(id);
  event.target.remove();
  totalPrice();
}
const emptyCart = document.querySelector('.empty-cart');
emptyCart.addEventListener('click', () => {
  const selected = document.querySelector('.cart__items');
  while (selected.firstChild) {
    selected.firstChild.remove();
  }
  removeProducts();
  totalPrice();
});
