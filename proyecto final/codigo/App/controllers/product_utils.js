let productContainer = document.getElementById("Cards_products");
const productsUrl = 'http://localhost:3000/products';
const adminProductsUrl = 'http://localhost:3000/admin/products';
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
                                        <button class="heart-icon onclick="favoritosadd()" position-absolute top-0 end-0 p-2" aria-label="Add to favorites" style="background: none; border: none; cursor: pointer;">
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

//  manejador de eventos al corazón para que cambie el color cuando se hace clic
function setupHeartIcons() {
    const heartIcons = document.querySelectorAll('.heart-icon');
    heartIcons.forEach(icon => {
        icon.addEventListener('click', function () {
            const heart = icon.querySelector('i');
            if (heart.classList.contains('fa-solid')) {
                // Si ya está relleno, lo cambiamos al corazón vacío
                heart.classList.remove('fa-solid');
                heart.style.color = ''; // Restaura el color original
            } else {
                // Si está vacío, lo rellenamos y cambiamos a rojo
                heart.classList.add('fa-solid');
                heart.style.color = 'red';
            }
        });
    });
}


// Añade un eventListener a todos los checkboxes dinámicamente
document.querySelectorAll('.form-check-input').forEach(checkbox => {
    checkbox.addEventListener('change', applyFilters);
});

function applyFilters() {
    // Selecciona todos los checkboxes y obtiene los filtros activos
    const filters = Array.from(document.querySelectorAll('.form-check-input')).reduce((acc, checkbox) => {
        acc[checkbox.id] = checkbox.checked;
        return acc;
    }, {});

    // Verificar si al menos un filtro está seleccionado
    const anyFilterSelected = Object.values(filters).some(isChecked => isChecked);

    // Si no hay filtros seleccionados, cargar todos los productos
    if (!anyFilterSelected) {
        productListToHtml(products); // Muestra todos los productos
        return;
    }

    // Filtrar los productos basados en los filtros activos
    const filteredProducts = products.filter(product => {
        const matchesMascotas =
            (filters.filterDog && product._description === 'perros') ||
            (filters.filterCat && product._description === 'gatos') ||
            (filters.filterBird && product._description === 'ave') ||
            (filters.filterFish && product._description === 'pez');

        const matchesCategory =
            (filters.filterAccesorios && product._category === 'accesorios') ||
            (filters.filterFood && product._category === 'alimentos') ||
            (filters.filterShampoo && product._category === 'Jabones y acondicionadores');

        const matchesPrice =
            (filters.filter0Cost && product._pricePerUnit >= 0 && product._pricePerUnit <= 99) ||
            (filters.filter100Cost && product._pricePerUnit >= 100 && product._pricePerUnit <= 299) ||
            (filters.filter300Cost && product._pricePerUnit >= 300 && product._pricePerUnit <= 599) ||
            (filters.filter600Cost && product._pricePerUnit >= 600 && product._pricePerUnit <= 999) ||
            (filters.filter1000Cost && product._pricePerUnit > 1000);

        const matchesAvailability =
            (filters.filterPhisicStore && product._unit.includes('fisica')) ||
            (filters.filterOnLine && product._unit.includes('linea'));

        // El producto cumple al menos un filtro de cada categoría activa
        return (!filters.filterDog && !filters.filterCat && !filters.filterBird && !filters.filterFish || matchesMascotas) &&
               (!filters.filterAccesorios && !filters.filterFood && !filters.filterShampoo || matchesCategory) &&
               (!filters.filter0Cost && !filters.filter100Cost && !filters.filter300Cost && !filters.filter600Cost && !filters.filter1000Cost || matchesPrice) &&
               (!filters.filterPhisicStore && !filters.filterOnLine || matchesAvailability);
    });

    // Mostrar resultados o mensaje si no hay coincidencias
    if (filteredProducts.length === 0) {
        productContainer.innerHTML = 
            '<p style="margin-top: 20%; text-align: center; font-size: 18px; color: #333;">No hay productos con esas características</p>';
    } else {
        productListToHtml(filteredProducts);
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
    setupHeartIcons(); // Configura los íconos del corazón
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
    currentProd = products.find(prod => prod._uuid == uuid);
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

    if (currentProd) {
        // Agrega el producto al carrito si la respuesta es válida
        cart.addItem(uuid, amount);
        cart.addProduct(currentProd);  // Agrega el objeto del producto
        writeShoppingCart(cart);  // Guarda el carrito actualizado
    } else {
        console.error('No se pudo agregar el producto al carrito debido a un error al obtenerlo.');
    }
}


async function addProductToDataBase() {
    let productName  = document.getElementById('productName').value.value;
    let uuid = document.getElementById('uuid').value;
    let unitType = document.getElementById('unitType').value;
    let price = document.getElementById('price').value;
    let description = document.getElementById('description').value;
    let stock = document.getElementById('stock').value;
    let imageUrl = document.getElementById('imageUrl').value;
    let category = document.getElementById('category').value;

    const existingProduct = products.find(prod => prod._uuid === uuid);
    if (existingProduct) {
        showAlert("Uuid ya existente", "danger");
        return;
    }
    // Crear el objeto user para enviar al servidor
    const newProd = {
        _uuid: uuid,
        _title: productName,
        _description: description,
        _imageUrl: imageUrl,
        _unit: unitType,
        _stock: stock,
        _pricePerUnit: price,
        _category: category,
        _type: 'Producto'
    };

    try {
        // Enviar los datos al servidor usando POST
        
        const response = await fetch(adminProductsUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth': 'validacion'
            },
            body: JSON.stringify(newProd), 
        });

        // Manejar respuesta del servidor
        if (response.ok) { // `response.ok` es true si el estado HTTP está en el rango 200-299
            const data = await response.json();
            console.log(data);
            showAlert("Producto añadido exitosamente", "success");
            await loadProductsPage(currentPage);
        } else if (response.status === 400) {
            const error = await response.json();
            showAlert(`Error: ${error.message}`, "danger");
        } else {
            showAlert("Error desconocido al crear usuario", "danger");
        }
        
    } catch (error) {
        console.error("Error al conectar con el servidor:", error);
        showAlert("No se pudo conectar al servidor", "danger");
    }


}



function hideButton() {
    var buttonDiv = document.getElementById("botonagregarmascotas");
    buttonDiv.style.display = "none";  // Ocultar el div y todo su contenido
}
function showButton() {
    var buttonDiv = document.getElementById("botonagregarmascotas");
    buttonDiv.style.display = "block";  // Ocultar el div y todo su contenido
}

// Llamada a la función para ocultar el botón
//hideButton();


function checkUserRole() {
    const isAdmin = localStorage.getItem('rol');  // Aquí pones tu lógica para verificar si el usuario es administrador

    if (isAdmin == 'ADMIN') {
        showButton();
    } else {
        hideButton();
    }
}

// Llamada a la función para verificar el rol del usuario y posiblemente ocultar el botón
checkUserRole();
// // Función de redireccionamiento al carrito
// Redireccionamiento.addEventListener('click', () => {
//     window.location.href = 'shopping_cart.html'; // Redirige al carrito
// });

// Carga la primera página de productos al iniciar
loadProductsPage(1);