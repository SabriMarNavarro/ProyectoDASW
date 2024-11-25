const { 
    DataHandlerException, 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    findProduct 
} = require('../codigo/App/controllers/data_handler'); // Asegúrate de que la ruta sea correcta


const Product = require ('../codigo/App/controllers/product');
const ShoppingCart = require ('../codigo/App/controllers/shopping_cart');
// impresion del arreglo vacio:

console.log ("------- 1.-Imprimiendo el arreglo vacio:--------");

console.log(getProducts());



// Agregando un elemento al producto

console.log ("-------2.-Agregando un producto al arreglo vacio:--------");

let producto_new_1 = new Product(
                                  "Hierro_Garcia_729409",
                                  "Metal para vigas",
                                  "https://", 
                                  "pieza", 
                                   10,
                                   4.5,
                                   "Metales"
)

createProduct(producto_new_1);

console.table(getProductById(producto_new_1.uuid));




console.log ("-------2.-Agregando los otros 3 producto al arreglo:--------");

let producto_new_2 = new Product(
    "Hafnio_Garcia_729409",
    "Un metal para experimentos",
    "https://", 
    "pieza", 
     15,
     4.5,
     "Metales"
)


createProduct(producto_new_2);

let producto_new_3 = new Product(
    "Harina_Garcia_729409",
    "Harina para hot-cakes",
    "https://", 
    "pieza", 
     20,
     17,
     "comida"
)

createProduct(producto_new_3);

let producto_new_4 = new Product(
    "Helados_Garcia_729409",
    "Postre para restaurantes",
    "https://", 
    "pieza", 
     20,
     17,
     "comida"
)

createProduct(producto_new_4);

console.table(getProducts());


console.log ("-------3.-Actualizar dos productos al arreglo:--------");           

updateProduct(producto_new_3._uuid, {_title: "HG_729409_update"});
updateProduct(producto_new_4._uuid, {_title: "HG_729409_update2"});

console.table(getProductById(producto_new_3._uuid));


console.table(getProducts());


console.log ("-------4.-Elimina un  producto al arreglo:--------");    

deleteProduct(producto_new_4.uuid);

console.table(getProducts());



console.log ("-------5.-Hacer una excepción para verificar validaciones:--------");

//console.table(getProductById(producto_new_4._unit));

console.log ("-------6.-Agregar 3 elementos en la lista de productos a shoppingCart:--------");
//Agrega 3 elementos en la lista de productos a un nuevo objeto ShoppingCart


let shoppingCart = new ShoppingCart();

// Agregar productos al carrito:

shoppingCart.addProduct(producto_new_1);
shoppingCart.addProduct(producto_new_2);
shoppingCart.addProduct(producto_new_3);

// Agregar compras al productproxy:

shoppingCart.addItem(producto_new_1._uuid,4);
shoppingCart.addItem(producto_new_2._uuid,5);
shoppingCart.addItem(producto_new_3._uuid,6);

console.log("Lista de proxies: ")
console.table(shoppingCart.getProxies());

console.log ("-------7.-Actualiza uno de los productos cambiando la cantidad:--------");

shoppingCart.updateItem(producto_new_1._uuid,7);

console.table(shoppingCart.getProxies());

console.log ("-------8.- Eliminar cualquier producto de los productos del ShoppingCart:--------");

shoppingCart.removelItem(3);

console.table(shoppingCart.getProxies());


console.log ("-------9.- Verifica los totales en el carrito de compras:--------");

shoppingCart.calculateTotal();

console.log ("-------10.- Busca y muestra en consola algún producto:--------");

console.log("Aqui se mostraran las busquedas por categoria: ");
console.table(findProduct("Metales")); // unicamente por categoria.

console.log("Aqui se mostraran las busquedas por categoria y titulo: ");
console.table(findProduct("Metal: Hierro_Garcia_729409"));
