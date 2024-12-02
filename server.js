// Importar módulos
const express = require('express');
const path = require('path');
const cors = require('cors');

// Crear una instancia de Express
const app = express();

// Definir el puerto; usar el puerto proporcionado por el entorno o el 3000 por defecto
const port = process.env.PORT || 3000;

// Middleware para habilitar CORS
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

// Importar el router principal
const router = require(path.join(__dirname, 'App', 'controllers', 'router'));

// Usar el router principal para todas las rutas
app.use('/', router);

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'App')));
app.use('/Views', express.static(path.join(__dirname, 'Views')));

// Iniciar el servidor y escuchar en el puerto especificado
app.listen(port, () => {
    console.log(`Aplicación de ejemplo corriendo en el puerto ${port}`);
});
