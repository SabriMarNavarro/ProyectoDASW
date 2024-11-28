let productContainer = document.getElementById("Cards_products");
const productsUrl = 'http://localhost:3000/mascotas';
let Redireccionamiento = document.getElementById('icono_carrito');
let Redireccionamiento2 = document.getElementById('navbarNav');
let products = [];  // Variable para almacenar todos los productos
let totalPages = 0;  // Variable para almacenar el total de páginas
let currentPage = 1;  // Página actual
let adminPetsUrl = 'http://localhost:3000/admin/mascotas'; 

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
                                        <p class="card-text" style="font-weight: 700; color: rgba(54, 41, 41, 0.699); font-size: 1.1rem;">Edad: ${product._edad} años </p>
                                        <button type="button" class="btn mb-2" style="border: 2px solid #94694C; border-radius: 19px; width: 145px; color: #94694C; background-color: transparent; font-weight: 650; font-size: 16px;"
                                        onclick="preloadModal(${product._uuid})">
                                            Adoptar
                                        </button>
                                    </div>
                                </div>
        </div>
    `;
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

// Añade eventListeners dinámicamente a los filtros
const filters = [
    'filterDog', 'filterCat', 'filterBird', 'filterFish',
    'filterSmall', 'filterMed', 'filterBig',
    'filterLessThanYear', 'filter1To3Years', 'filter3To5Years', 'filterMoreAge'
];

filters.forEach(filterId => {
    document.getElementById(filterId).addEventListener('change', applyFilters);
});

function applyFilters() {
    // Obtener los valores de los filtros seleccionados
    const filterStates = filters.reduce((acc, filterId) => {
        acc[filterId] = document.getElementById(filterId).checked;
        return acc;
    }, {});

    // Verificar si al menos un filtro está seleccionado
    const anyFilterSelected = Object.values(filterStates).some(isChecked => isChecked);

    // Si no hay filtros seleccionados, cargar todos los productos
    if (!anyFilterSelected) {
        productListToHtml(products); // Muestra todos los productos
        return; // Salir de la función si no hay filtros
    }

    // Filtrar los productos con base en los filtros seleccionados
    const filteredProducts = products.filter(product => {
        const matchesMascotas = 
            (filterStates.filterDog && product._especie === 'perro') ||
            (filterStates.filterCat && product._especie === 'gato') ||
            (filterStates.filterBird && product._especie === 'ave') ||
            (filterStates.filterFish && product._especie === 'pez');

        const matchesSize = 
            (filterStates.filterSmall && product._tamano === 'pequeno') ||
            (filterStates.filterMed && product._tamano === 'mediano') ||
            (filterStates.filterBig && product._tamano === 'grande');
    
        const matchesAge = 
            (filterStates.filterLessThanYear && product._edad < 1) ||
            (filterStates.filter1To3Years && (product._edad >= 1 && product._edad <= 3)) ||
            (filterStates.filter3To5Years && (product._edad >= 3 && product._edad <= 5)) ||
            (filterStates.filterMoreAge && product._edad > 5);
    
        // El producto pasa si cumple al menos un filtro activo de cada categoría
        return (!filterStates.filterDog && !filterStates.filterCat && !filterStates.filterBird && !filterStates.filterFish || matchesMascotas) &&
               (!filterStates.filterSmall && !filterStates.filterMed && !filterStates.filterBig || matchesSize) &&
               (!filterStates.filterLessThanYear && !filterStates.filter1To3Years && !filterStates.filter3To5Years && !filterStates.filterMoreAge || matchesAge);
    });
    if (filteredProducts.length === 0) {
        // Si no hay productos que coincidan, mostrar mensaje
        productContainer.innerHTML = '<p style="margin-top: 20%; text-align: center; font-size: 18px; color: #333;">No hay mascotas con esas características</p>';
    } else {
        // Mostrar los productos filtrados
        productListToHtml(filteredProducts);
    }
}



async function preloadModal(uuid) {
    currentProd = products.find(prod => prod._uuid == uuid);
    document.getElementById('productIdAddModal').value = uuid;
    //Usar la API de Bootstrap para abrir el modal
    let adoptionModal = new bootstrap.Modal(document.getElementById('adoptionModal'));
    adoptionModal.show();
}

function productListToHtml(productList) {
    productContainer.innerHTML = `<div class="row mt-5 d-flex justify-content-center">\n` + productList.map(productToHtml).join("\n") + `\n</div>`;
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
    setupHeartIcons();
}
// Configura los eventos de la paginación
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
    document.getElementById('productIdAddModal').value = uuid;
    document.getElementById('productAmountAddModal').value = 1;
}

// Función para obtener un producto desde el servidor por uuid
async function fetchProduct(uuid) {
    try {
        const response = await fetch(`http://localhost:3000/products/${uuid}`);
        if (response.ok) {
            return await response.json(); // Retorna el producto como objeto JSON
        } else {
            console.error(`Error al obtener el producto con uuid: ${uuid}`);
            return null; // Si hay un error, retorna null
        }
    } catch (error) {
        console.error(`Error de servidor al obtener el producto con uuid: ${uuid}`, error);
        return null; // Retorna null en caso de error de red
    }
}

// Función para agregar un producto al carrito
async function addProductToCart() {
    let uuid = document.getElementById('productIdAddModal').value;
    let amount = parseInt(document.getElementById('productAmountAddModal').value);

    // Recupera el carrito desde sessionStorage
    let cart = readShoppingCart();

    // Obtén el producto desde el servidor
    const product = await fetchProduct(uuid);

    if (product) {
        // Agrega el producto al carrito si la respuesta es válida
        cart.addItem(uuid, amount);
        cart.addProduct(product);  // Agrega el objeto del producto
        writeShoppingCart(cart);  // Guarda el carrito actualizado
    } else {
        console.error('No se pudo agregar el producto al carrito debido a un error al obtenerlo.');
    }
}

document.getElementById('submitAdoption').addEventListener('click', function () {
    // Obtener el estado del checkbox de aceptación de políticas
    const agreePolicies = document.getElementById('agreePolicies').checked;

    if (!agreePolicies) {
        // Mostrar alerta o mensaje de error si no está marcado
        alert('Por favor, acepta las políticas de adopción antes de continuar.');
        return; // Salir de la función para evitar acciones adicionales
    }

    // Si está marcado, continuar con el envío del formulario
    const adoptionForm = document.getElementById('adoptionForm');
    if (adoptionForm.checkValidity()) {
        showAlert('Tu solicitud esta en proceso, los siguientes pasos seran enviados a tu correo', 'success');
        const adoptionModal = bootstrap.Modal.getInstance(document.getElementById('adoptionModal'));
        adoptionModal.hide();

    } else {
        // Mostrar los mensajes de validación estándar si faltan datos
        adoptionForm.reportValidity();
    }

    // Función para mostrar el mensaje tipo alert
    function showAlert(message, type) {
        const alert = document.createElement('div');
        alert.classList.add('alert', type);
        alert.innerText = message;

        // Insertar el mensaje de alerta en el cuerpo de la página
        document.body.prepend(alert); // Muestra el alert en la parte superior de la página

        // Remover el mensaje después de 5 segundos
        setTimeout(() => {
            alert.remove();
        }, 5000); // El mensaje desaparece después de 5 segundos
    }

    // Añadir el estilo para el mensaje tipo alert (puedes colocarlo en tu archivo de CSS)
    document.head.insertAdjacentHTML('beforeend', `
    <style>
        .alert {
            position: fixed;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 25px;
            border-radius: 5px;
            font-size: 16px;
            color: white;
            z-index: 9999;
            width: 80%;
            max-width: 600px;
            text-align: center;
        }

        .alert.success {
            background-color: #28a745; /* Verde para éxito */
        }

        .alert.danger {
            background-color: #dc3545; /* Rojo para error */
        }
    </style>
    `);
});

// Función de redireccionamiento al carrito
Redireccionamiento.addEventListener('click', () => {
    window.location.href = 'shopping_cart.html'; // Redirige al carrito
});

async function addPetToDataBase() {
    let petUUID  = document.getElementById('petUUID').value;
    let petTitle = document.getElementById('petTitle').value;
    let petDescription = document.getElementById('petDescription').value;
    let petImageURL = document.getElementById('petImageURL').value;
    let petAge = document.getElementById('petAge').value;
    let petSpecies = document.getElementById('petSpecies').value;
    let petSize = document.getElementById('petSize').value;

    const existingPet = products.find(pet => pet._uuid === petUUID);
    if (existingPet) {
        showAlert("Uuid ya existente", "danger");
        return;
    }
    // Crear el objeto user para enviar al servidor
    const newPet = {
        _uuid: petUUID,
        _title: petTitle,
        _description: petDescription,
        _imageUrl: petImageURL,
        _especie: petSpecies,
        _edad: petAge,
        tamano: petSize,
        _tamano: petSize,
        _type: 'Mascota',
    };

    try {
        // Enviar los datos al servidor usando POST
        const response = await fetch(adminPetsUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth': 'validacion'
            },
            body: JSON.stringify(newPet), 
        });

        // Manejar respuesta del servidor
        if (response.ok) { // `response.ok` es true si el estado HTTP está en el rango 200-299
            const data = await response.json();
            console.log(data);
            showAlert("Mascota añadido exitosamente", "success");
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

function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.classList.add('alert', type);
    alert.innerText = message;

    // Insertar el mensaje de alerta en el cuerpo de la página
    document.body.prepend(alert); // Muestra el alert en la parte superior de la página

    // Remover el mensaje después de 5 segundos
    setTimeout(() => {
        alert.remove();
    }, 5000); // El mensaje desaparece después de 5 segundos
}

// Añadir el estilo para el mensaje tipo alert (puedes colocarlo en tu archivo de CSS)
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .alert {
            position: fixed;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 25px;
            border-radius: 5px;
            font-size: 16px;
            color: white;
            z-index: 9999;
            width: 80%;
            max-width: 600px;
            text-align: center;
        }
    
        .alert.success {
            background-color: #28a745; /* Verde para éxito */
        }
    
        .alert.danger {
            background-color: #dc3545; /* Rojo para error */
        }
    </style>
`);


// Carga la primera página de productos al iniciar
loadProductsPage(1);