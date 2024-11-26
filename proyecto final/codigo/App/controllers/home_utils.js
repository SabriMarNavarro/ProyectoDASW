let productContainer = document.getElementById("Cards_products");
const productsUrl = 'http://localhost:3000/products';
let products = [];  // Variable para almacenar todos los productos


async function loadProductsPage(page) {
    const response = await fetch(`${productsUrl}?page=${page}`);
    if (response.ok) {
        const data = await response.json();
        if (data.products && data.products.length) {
            products = data.products;  // Asigna el arreglo de productos
        } else {
            console.error('No se pudieron cargar los productos');
        }
    } else {
        console.error('Error al obtener productos del servidor');
    }
}

function openMascotas() {
    window.open('/proyecto final/codigo/App/Views/shop_animals.html');
}
function openProducts() {
    window.open('/proyecto final/codigo/App/Views/shop_products.html');
}


async function preloadAddToCartModal(uuid) {
    currentProd = products.find(prod => prod._uuid == uuid);
    document.getElementById('productIdAddModal').value = uuid;
    document.getElementById('productAmountAddModal').value = 1;
    //Usar la API de Bootstrap para abrir el modal
    let addToCartModal = new bootstrap.Modal(document.getElementById('addToCart'));
    addToCartModal.show();
}


async function addProductToCart() {
    let uuid = document.getElementById('productIdAddModal').value;
    let amount = parseInt(document.getElementById('productAmountAddModal').value);

    // Recupera el carrito desde sessionStorage
    let cart = readShoppingCart();

    if (currentProd) {
        // Agrega el producto al carrito si la respuesta es válida
        cart.addItem(uuid, amount);
        cart.addProduct(currentProd);   // Agrega el objeto del producto
        writeShoppingCart(cart);        // Guarda el carrito actualizado
    } else {
        console.error('No se pudo agregar el producto al carrito debido a un error al obtenerlo.');
    }
}

loadProductsPage(1);
