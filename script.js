/* pegar endPoint */
  const getListApi = async () => {
    const endPoint = await (
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador&limit=8')
).json();
    return endPoint.results;
  };
/* pegar item por id  */
  const getByIdApi = async (id) => {
    const objId = await (
  await fetch(`https://api.mercadolibre.com/items/${id}`)).json();
    return objId;
  };

/* // salvar LocalStorage */
  const saveOrUpdateInLocalStorage = (html) => {
    localStorage.setItem('listCar', html);
  };
/* //atualizar LocalStorage */
  const loadLocalStorage = () => {
    const cartItems = document.querySelector('.cart__items');
    const listCar = localStorage.getItem('listCar');
    if (listCar) {
      cartItems.innerHTML = listCar;
    }
  };
// somar itens
  const sumPricesItemsCart = () => {
    const prices = document.querySelectorAll('[data-price-items]');
    const total = Array.from(prices, ({ dataset: { priceItems } }) =>
  Number(priceItems)).reduce((acc, price) => acc + price, 0);
    return total;
  };

  const updateDisplayTotalPrice = (total) => {
    const spanElement = document.querySelector('.total-price');
    spanElement.innerHTML = total;
  };
// limpar Carrinho com a classe empty-cart
  function clearCart() {
    const cartItems = document.querySelectorAll('.cart__item');
    cartItems.forEach(item => item.remove());
    updateDisplayTotalPrice(sumPricesItemsCart());
  }

// carregar itens
  const loading = () => {
    setTimeout(() => {
      document.querySelector('.loading').remove();
    /* eslint no-use-before-define: ["error", { "variables": false }]*/
      return loadProducts();
    }, 3000);
  };

  function createProductImageElement(imageSource) {
    const img = document.createElement('img');
    img.className = 'item__image';
    img.src = imageSource;
    return img;
  }

  function createCustomElement(element, className, innerText, sku = null) {
    const e = document.createElement(element);
    e.className = className;
    e.innerText = innerText;
    if (element === 'button') {
      e.dataset.idProduct = sku;
      e.dataset.click = 'createList';
    }
    return e;
  }

  function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
    const section = document.createElement('section');
    section.className = 'item';

    section.appendChild(createCustomElement('span', 'item__sku', sku));
    section.appendChild(createCustomElement('span', 'item__title', name));
    section.appendChild(createProductImageElement(image));
    section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

    return section;
  }


  function getSkuFromProductItem(item) {
    return item.querySelector('span.item__sku').innerText;
  }

  function cartItemClickListener(event) {
  // coloque seu código aqui
    const cartItems = document.querySelector('.cart__items');
    event.target.remove();
    saveOrUpdateInLocalStorage(cartItems.innerHTML);
    updateDisplayTotalPrice(sumPricesItemsCart());
  }

  function createCartItemElement({ id: sku, title: name, price: salePrice }) {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
    li.dataset.priceItems = salePrice;
    li.addEventListener('click', cartItemClickListener);
    return li;
  }

  const loadProducts = async () => {
    const items = document.querySelector('.items');
    const products = await getListApi();
    products.forEach(product => items.appendChild(createProductItemElement(product)));
  };

  const createList = async (id) => {
    const cartItems = document.querySelector('.cart__items');
    const productById = await getByIdApi(id);
    cartItems.appendChild(createCartItemElement(await productById));
    saveOrUpdateInLocalStorage(cartItems.innerHTML);
    updateDisplayTotalPrice(sumPricesItemsCart());
  };
  const controlerClicks = () => {
    document.addEventListener('click', (event) => {
      const setEvent = event.target.dataset.click;
      switch (setEvent) {
        case 'createList': {
          const parElement = event.target.parentElement;
          const RecorverId = getSkuFromProductItem(parElement);
          createList(RecorverId);
          break;
        }
        case 'clearcart': {
          clearCart();
          break;
        }
        default:
          break;
      }
    });
  };

  window.onload = function onload() {
    loadLocalStorage();
    loading();
    controlerClicks();
    updateDisplayTotalPrice(sumPricesItemsCart());
  };
