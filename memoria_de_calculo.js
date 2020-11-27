// const fetch = require('node-fetch');

// const findItemAndReturnArrayObject = (item) => {
//   const endPoint = `https://api.mercadolibre.com/sites/MLB/search?q=${item}`;
//   return fetch(endPoint)
//     .then(response => response.json())
//     .then((object) => {
//   if (object.error) {
//       throw new Error(object.error);
//     } else {
//       object.results;
//       }
//     })
//     .catch(error => alert(error));
// };

// const arrayOfProducts = findItemAndReturnArrayObject('COMPUTADOR');
// console.log(arrayOfProducts);
