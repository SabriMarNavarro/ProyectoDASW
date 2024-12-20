let users = [];
let count = 3;
const usersUrl = 'http://localhost:3000/admin/users';
// Función para cargar los usuarios desde el servidor
async function loadUsers(page) {
    const response = await fetch(`http://localhost:3000/users`);
    if (response.ok) {
        const data = await response.json();
        if (data.users && data.users.length) {
            users = data.users;  // Asigna el arreglo de usuarios
        } else {
            console.error('No se encontraron los usuarios');
        }
    } else {
        console.error('Error al obtener usuarios del servidor');
    }
}






async function crearCuenta() {
    const registerEmail = document.getElementById('registerEmail').value;
    const registerPassword = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validar que las contraseñas coincidan
    if (registerPassword !== confirmPassword || !registerPassword) {
        showAlert("Las contraseñas no coinciden o están vacías", "danger");
        return;
    }
    // Verificar si el email ya existe en el arreglo local `users`
    const existingUser = users.find(user => user._email === registerEmail);
    if (existingUser) {
        showAlert("¡Email ya existente!", "danger");
        return;
    }
    // Crear el objeto user para enviar al servidor
    const newUser = {
        _uuid: Math.random()*Date.now(),
        _email: registerEmail,
        _password: registerPassword,
        _rol: "CLIENTE" // Rol predeterminado
    };

    try {
        // Enviar los datos al servidor usando POST
        const response = await fetch(usersUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth': 'validacion'
            },
            body: JSON.stringify(newUser), 
        });
        

        // Manejar respuesta del servidor
        if (response.ok) { // `response.ok` es true si el estado HTTP está en el rango 200-299
            const data = await response.json();
            console.log(data);
            showAlert("Usuario creado exitosamente", "success");
            await loadUsers(); // Si tienes esta función para recargar usuarios
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



async function login() {
    const email = document.getElementById('email').value;
    const Password = document.getElementById('password').value;
    
    // Verificar si el email ya existe en el arreglo local `users`
    const existingUser = users.find(user => user._email === email);
    const validPassword = users.find(user => user._password === Password);
    
    if (existingUser && validPassword) {
        if(existingUser._rol === "ADMIN") {
            localStorage.setItem('rol', existingUser._rol);
            localStorage.setItem('email', existingUser._email);
        } else {
            localStorage.setItem('rol', existingUser._rol);
            localStorage.setItem('email', existingUser._email);
        }
        // toggleButtonVisibilityLogin()
        // toggleButtonVisibilitySalir()
    } else {
        showAlert("Usuario o contraseña incorrectos!", "danger");
    }
    // alert( localStorage.getItem('rol') );
}




async function logout() {
    delete localStorage.rol;
    delete localStorage.email;
    // toggleButtonVisibilityLogin()
    // toggleButtonVisibilitySalir()
}


function toggleButtonVisibilityLogin() {
    // Obtener el botónvar 
    button = document.getElementById("entrar");
        // Alternar la clase 'd-none' para ocultar o mostrar el botón    
        button.classList.toggle("d-none");
}

function toggleButtonVisibilitySalir() {
    // Obtener el botónvar 
    button = document.getElementById("salir");
        // Alternar la clase 'd-none' para ocultar o mostrar el botón    
        button.classList.toggle("d-none");
}

// Función para convertir un producto en HTML
function logueadoActive() {
    return `
    <li class="nav-item">
        <a class="nav-link" href="shop_animals.html" onclick="logout()">Salir</a>
    </li>
    `;
}
function logueadoInactive() {
    return `
    <!-- Botón de Persona -->
    <li class="nav-item">
        <a class="nav-link" data-bs-toggle="modal" href="#loginModal">
            <i class="fas fa-user" aria-hidden="true"></i>
        </a>
    </li>
    `;
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


loadUsers();

