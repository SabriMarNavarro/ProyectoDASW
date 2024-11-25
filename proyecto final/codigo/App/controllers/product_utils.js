let productContainer = document.getElementById("Cards_products");
const productsUrl = 'http://localhost:3000/products';
let products = [];  // Variable para almacenar todos los productos

//Para controlar la paginación:
let totalPages = 0;  // Variable para almacenar el total de páginas
let currentPage = 1;  // Página actual

//Para controlar el producto seleccionado
let currentProd;

//let {utils} = require("./utils")

function productToHtml(product) {
    return `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4" style="position: relative;">
                                <div class="card" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                                    <!--corazón + foto-->
                                    <div class="position-relative">
                                        <span class="d-none">${product._uuid}</span>
                                        <img src="${product._imageUrl}" alt="${product._type}" 
                                            class="w-100 p-3" 
                                            style="border-top-left-radius: 30px; border-top-right-radius: 30px; object-fit:cover; height: 250px;">
                                        <button class="heart-icon position-absolute top-0 end-0 p-2" aria-label="Add to favorites" style="background: none; border: none; cursor: pointer;">
                                            <i class="fa fa-heart" aria-hidden="true" style="font-size: 1.5rem;"></i>
                                        </button>
                                    </div>
                                
                                    <!--Contenido-->
                                    <div class="card-body d-flex flex-column align-items-center text-center">
                                        <h4 class="card-title" style="color: #000; font-size: 1.1rem; font-weight: 500;">${product._title}</h4>
                                        <p class="card-text" style="font-weight: 700; color: rgba(54, 41, 41, 0.699); font-size: 1.1rem;"> $${product._pricePerUnit}</p>
                                        <button type="button" class="btn mb-2" style="border: 2px solid #94694C; border-radius: 19px; width: 145px; color: #94694C; background-color: transparent; font-weight: 650; font-size: 16px;"
                                        onclick="preloadAddToCartModal('${product._uuid}')">
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
        </div>
    `;
}

function productListToHtml(productList) {
    if (productContainer) {
        productContainer.innerHTML = `<div class="row mt-5 d-flex justify-content-center">\n` + productList.map(productToHtml).join("\n") + `\n</div>`;
    } else {
        alert("no product container")
    }
    
}

// Función para cargar los productos desde el servidor
async function loadProductsPage(page) {
    const response = await fetch(`${productsUrl}?page=${page}`);
    if (response.ok) {
        const data = await response.json();
        if (data.products && data.products.length) {
            products = data.products;  // Asigna el arreglo de productos
            totalPages = data.totalPages;  // Asigna el total de páginas
            renderPage(page);  // Muestra la página solicitada
            setupPagination();  // Configura la paginación
        } else {
            console.error('No se pudieron cargar los productos');
        }
    } else {
        console.error('Error al obtener productos del servidor');
    }
}

// Función para mostrar los productos de la página seleccionada
function renderPage(page) {
    currentPage = page;  // Actualiza la página actual
    productListToHtml(products);  // Muestra los productos de la página actual
    updatePaginationActive(page);  // Actualiza el estilo de la paginación activa
}

// Configura los eventos de la paginación
function setupPagination() {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    // Crear el botón "Anterior"
    const prevItem = document.createElement('li');
    prevItem.classList.add('page-item', 'prev');
    prevItem.innerHTML = `
        <a class="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
        </a>
    `;
    paginationContainer.appendChild(prevItem);

    // Crear las páginas dinámicamente
    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement('li');
        pageItem.classList.add('page-item');
        if (i === currentPage) pageItem.classList.add('active'); // Marca la página activa

        const pageLink = document.createElement('a');
        pageLink.classList.add('page-link');
        pageLink.href = '#';
        pageLink.innerText = i;
        pageLink.addEventListener('click', (event) => {
            event.preventDefault();
            loadProductsPage(i); // Llama a loadProductsPage al hacer clic en una página
        });

        pageItem.appendChild(pageLink);
        paginationContainer.appendChild(pageItem);
    }

    // Crear el botón "Siguiente"
    const nextItem = document.createElement('li');
    nextItem.classList.add('page-item', 'next');
    nextItem.innerHTML = `
        <a class="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
        </a>
    `;
    paginationContainer.appendChild(nextItem);

    // Configurar los eventos de los botones "Anterior" y "Siguiente"
    prevItem.querySelector('a').addEventListener('click', (event) => {
        event.preventDefault();
        if (currentPage > 1) loadProductsPage(currentPage - 1); // Página anterior
    });

    nextItem.querySelector('a').addEventListener('click', (event) => {
        event.preventDefault();
        if (currentPage < totalPages) loadProductsPage(currentPage + 1); // Página siguiente
    });
}

// Actualiza el estilo de paginación activa
// Función para actualizar la paginación activa
function updatePaginationActive(page) {
    document.querySelectorAll('.page-item').forEach((item, index) => {
        if (item.classList.contains('prev') || item.classList.contains('next')) return;
        if (index + 1 === page) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Funciones para el carrito
async function preloadAddToCartModal(uuid) {
    alert(uuid);
    currentProd = products.find(prod => prod._uuid = uuid);
    document.getElementById('productIdAddModal').value = uuid;
    document.getElementById('productAmountAddModal').value = 1;
    //Usar la API de Bootstrap para abrir el modal
    let addToCartModal = new bootstrap.Modal(document.getElementById('addToCart'));
    addToCartModal.show();
}


// Función para agregar un producto al carrito
async function addProductToCart() {
    let uuid = document.getElementById('productIdAddModal').value;
    let amount = parseInt(document.getElementById('productAmountAddModal').value);

    
    // Recupera el carrito desde sessionStorage
    let cart = readShoppingCart();

    // Obtén el producto desde el servidor
    //const product = await fetchProduct(uuid);

    if (currentProd) {
        // Agrega el producto al carrito si la respuesta es válida
        cart.addItem(uuid, amount);
        cart.addProduct(currentProd);  // Agrega el objeto del producto
        writeShoppingCart(cart);  // Guarda el carrito actualizado
    } else {
        console.error('No se pudo agregar el producto al carrito debido a un error al obtenerlo.');
    }
}

// // Función de redireccionamiento al carrito
// Redireccionamiento.addEventListener('click', () => {
//     window.location.href = 'shopping_cart.html'; // Redirige al carrito
// });

// Carga la primera página de productos al iniciar
loadProductsPage(1);