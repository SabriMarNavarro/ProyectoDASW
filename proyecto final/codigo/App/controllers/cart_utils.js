// Obtener referencias a los elementos del DOM
let productContainer2 = document.getElementById('resumen_cart');


// Función para convertir un producto en HTML
function productToHtml(product, amount) {
    return `
    <div class="media border d-flex align-items-center" data-uuid="${product.productUuid}">
        <div class="row p-4">
            <div class="media-right col-4">
                <img class="rounded" src="${product._imageUrl}" alt="Product Image" width="150px" height="150px">
            </div>
            <div class="media-body col-8 p-4">
                <div class="row">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h5>${product._title}</h5>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <div class="form-group">
                            <div class="input-group mb-2">
                                <div class="input-group-prepend">
                                    <!--<a name="cantidad" id="cantidad" class="btn btn-secondary" href="#numProd1" role="button">
                                        <i class="fas fa-minus"></i>
                                    </a>-->
                                </div>
                                <input type="number" class="form-control" name="numProd1" id="numProd1" value="${amount}" 
                                    , this.value)" disabled>
                                <div class="input-group-append">
                                    <a href="#" class="btn btn-white edit-btn" data-uuid="${product.productUuid}">
                                        <i class="fas fa-pen"></i>
                                    </a>
                                </div>

                                <div class="input-group-append">
                                    <a href="#" class="btn btn-success confirm-btn" style="display: none;"><i class="fas fa-check"></i></a>
                                    <a href="#" class="btn btn-danger cancel-btn" style="display: none;"><i class="fas fa-times"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="form-group">
                            <div class="input-group">
                                <div class=" mt-2">$${product._pricePerUnit}</div>
                                <div class="input-group-append">
                                    <button class="btn btn-white remove-btn" value="${product.productUuid}" >
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
        
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
            <div style="margin-top: -5%; display: flex; flex-direction: column;" >
                <h4 class="card-title mb-3">Resumen de compra</h4>
                <div class="mb-4 card-text ">
              
                ${cart.proxies.map(proxy => {
                        let product = cart.products.find(item => item._uuid === proxy.productUuid);
                        return `<p class="card-text m-0">${product._title}: ${proxy.amount} x $${product._pricePerUnit.toFixed(2)}</p>`;
                    }).join('')}
                </div>
                <p class="card-text">Costo de envío: $500.00</p>
                <div class="dropdown-divider"></div>
                <h5 class="card-text">Total a pagar: $${(total + 500).toFixed(2)}</h5>

            </div>
        `;
    } else {
        resumenCompraContainer.innerHTML = '<p>No hay recargos por el momento</p>';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Obtener los parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');

    // Mostrar el mensaje adecuado solo si el estado es 'success'
    if (status === 'success') {
        showAlert('¡El pago fue procesado exitosamente! Tu comprobante se envía por correo.', 'success');

        // Eliminar todos los productos del carrito
        let cart = readShoppingCart();

        // Si hay productos en el carrito, eliminarlos
        if (cart && cart.proxies.length > 0) {
            cart.proxies.forEach(proxy => {
                // Eliminar el producto del carrito
                removeProductFromCart(proxy.productUuid);
            });

            // Actualizar el resumen del carrito y la compra
            updateCartSummary();
            updatePurchaseSummary();
        }
    }
});


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




// Llamadas iniciales para mostrar el resumen
updateCartSummary();
updatePurchaseSummary();