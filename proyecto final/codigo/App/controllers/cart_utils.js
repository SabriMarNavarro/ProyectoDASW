// Obtener referencias a los elementos del DOM
let productContainer2 = document.getElementById('resumen_cart');
let productContainer3 = document.getElementById('resumen_compra');

// Función para convertir un producto en HTML
function productToHtml(product, amount) {
    return `
    <div class="media border d-flex align-items-center" data-uuid="${product.productUuid}">
        <div class="media-body m-4">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h5>${product._title}</h5>
                <button class="btn btn-danger remove-btn" value="${product.productUuid}" >
                    <i class="fas fa-trash"></i>
                </button>
            </div>

            <div class="form-group">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <a name="cantidad" id="cantidad" class="btn btn-secondary" href="#numProd1" role="button">Cantidad</a>
                    </div>
                    <input type="number" class="form-control" name="numProd1" id="numProd1" value="${amount}" 
                        , this.value)" disabled>
                    <div class="input-group-append">
                        <a href="#" class="btn btn-info edit-btn" data-uuid="${product.productUuid}">
                            <i class="fas fa-pencil-alt"></i>
                        </a>
                    </div>

                    <div class="input-group-append">
                        <a href="#" class="btn btn-success confirm-btn" style="display: none;">Confirmar</a>
                        <a href="#" class="btn btn-danger cancel-btn" style="display: none;">Cancelar</a>
                    </div>
                </div>
            </div>

            <div class="form-group">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <a name="cantidad" id="cantidad" class="btn btn-secondary" href="" role="button">Precio</a>
                    </div>
                    <div class="form-control">${product._pricePerUnit}</div>
                    <div class="input-group-append">
                        <a name="cantidadlbl" id="cantidadlbl" class="btn btn-secondary" href="" role="button">$ m.n.</a>
                    </div>
                </div>
            </div>
        </div>

        <div class="media-right">
            <img class="rounded" src="${product._imageUrl}" alt="Product Image" width="150px" height="150px">
        </div>
    </div>
    `;
}

function toggleEditMode(productContainer) {
    // Obtener los elementos dentro del contenedor del producto
    let inputElement = productContainer.querySelector('input');
    let editBtn = productContainer.querySelector('.edit-btn');
    let confirmBtn = productContainer.querySelector('.confirm-btn');
    let cancelBtn = productContainer.querySelector('.cancel-btn');
    
    // Deshabilitar el campo de cantidad
    inputElement.disabled = true;

    // Ocultar los botones de confirmación y cancelación
    confirmBtn.style.display = 'none';
    cancelBtn.style.display = 'none';

    // Mostrar el botón de edición
    editBtn.style.display = 'inline-block';
}


// Función para actualizar la cantidad del producto en el carrito
function updateProductAmount(uuid, newAmount) {
   
    let cart = readShoppingCart();

    
    if (cart) {
        cart.updateItem(uuid, newAmount);
        writeShoppingCart(cart);
        updateCartSummary();
        updatePurchaseSummary();
    }
}

// Función para eliminar producto del carrito y DOM
function removeProductFromCart(uuid) {
    let cart = readShoppingCart();
    cart.removelItem(uuid); 
    writeShoppingCart(cart);
    updateCartSummary();
    updatePurchaseSummary();
}

// Actualizar el resumen del carrito en el DOM
function updateCartSummary() {
    let cart = readShoppingCart();
    let cartProducts = cart.proxies;
    productContainer2.innerHTML = '';  // Limpiar el contenedor de productos

    if (cartProducts.length > 0) {
        cartProducts.forEach(proxy => {
            let product = cart.products.find(item => item._uuid === proxy.productUuid);
            if (product) {
                let productHtml = productToHtml(product, proxy.amount);
                let productElement = document.createElement('div');
                productElement.innerHTML = productHtml;

                // Añadir el producto al contenedor
                productContainer2.appendChild(productElement);

                // Asignar el manejador de edición al botón de lápiz
                const editBtn = productElement.querySelector('.edit-btn');
                // Asignar el evento click a cada botón de edición
                editBtn.addEventListener('click', function(event) {
                    
                    // Obtener el contenedor del producto usando el evento
                    let productContainer = event.target.closest('.media'); // Encontrar el contenedor del producto desde el botón
                    let inputElement = productContainer.querySelector('input');
                    let editBtn = productContainer.querySelector('.edit-btn');
                    let confirmBtn = productContainer.querySelector('.confirm-btn');
                    let cancelBtn = productContainer.querySelector('.cancel-btn');
                    
                    // Habilitar el campo de cantidad
                    inputElement.disabled = false;
                
                    // Mostrar los botones de confirmación y cancelación
                    confirmBtn.style.display = 'inline-block';
                    cancelBtn.style.display = 'inline-block';
                
                    // Ocultar el botón de edición
                    editBtn.style.display = 'none';
                
                    // Guardar el valor original del input para cancelación
                    const originalValue = inputElement.value;
                
                    // Función para manejar la cancelación
                    const cancelHandler = () => {
                        inputElement.value = originalValue;  // Restaurar el valor original
                        toggleEditMode(productContainer);  // Desactivar el modo de edición
                    };

                    // Función para manejar la confirmación
                    const confirmHandler = () => {
    
                        let newAmount = parseInt(inputElement.value);
                        if (newAmount <= 0) {
                            removeProductFromCart(product._uuid); // Eliminar producto si la cantidad es <= 0
                        } else {
                            updateProductAmount(product._uuid, newAmount); // Actualizar la cantidad
                            toggleEditMode(productContainer);  // Desactivar el modo de edición
                        }
                    };
                
                    // Asignar manejadores a los botones de confirmación y cancelación
                    confirmBtn.addEventListener('click', confirmHandler);
                    cancelBtn.addEventListener('click', cancelHandler);
                });

                // Asignar el manejador de eliminación al botón de eliminación
                const removeBtn = productElement.querySelector('.remove-btn');
                removeBtn.addEventListener('click', function() {
                    removeProductFromCart(product._uuid);  // Eliminar el producto del carrito
                });
            }
        });
    } else {
        productContainer2.innerHTML = '<p>No hay productos en tu carrito.</p>';
    }
}

// Función para actualizar el resumen de la compra
function updatePurchaseSummary() {
    let cart = readShoppingCart();
    let cartProducts = cart.proxies;
    let total = cart.calculateTotal();
    
    const resumenCompraContainer = document.getElementById('resumen_compra');
    if (cartProducts.length > 0) {
        resumenCompraContainer.innerHTML = `
            <h5 class="card-title">Total de compra</h5>
            ${cart.proxies.map(proxy => {
                let product = cart.products.find(item => item._uuid === proxy.productUuid);
                return `<p class="card-text">${product._title}: ${proxy.amount} x $${product._pricePerUnit.toFixed(2)}</p>`;
            }).join('')}
            <p class="card-text">Costo de envío: $500.00</p>
            <div class="dropdown-divider"></div>
            <p class="card-text">Total a pagar: $${(total + 500).toFixed(2)}</p>
            <a class="btn btn-outline-success w-100" href="#">Pagar</a>
            <a class="btn btn-outline-danger w-100 mt-2" href="#">Cancelar</a>
        `;
    } else {
        resumenCompraContainer.innerHTML = '<p>No hay recargos por el momento</p>';
    }
}


// Llamadas iniciales para mostrar el resumen
updateCartSummary();
updatePurchaseSummary();