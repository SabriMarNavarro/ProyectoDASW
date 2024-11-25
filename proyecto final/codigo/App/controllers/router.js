// Importaciones:
const express = require('express');
const path = require('path');
const productRouter = require('../routes/products');
const mascotasRouter = require('../routes/mascotas');
const favoritosRouter = require('../routes/favoritos');

const adminProductRouter = require('../routes/admin_products'); 
const adminMascotasRouter = require('../routes/admin_mascotas'); 

const router = express.Router();

function validateAdmin(req, res, next) {
    if (req.get('x-auth')) {
        console.log("Permiso concedido");
        next();
    } else {
        console.log("Acceso no autorizado, no se cuenta con privilegios de administrador");
        return res.status(403).json({ message: "Acceso no autorizado, no se cuenta con privilegios de administrador" });
    }
}

// Usa el router para las rutas de productos
router.use('/products', productRouter);
router.use('/mascotas', mascotasRouter);


// Rutas administradas por el middleware de validación
router.use('/admin/products', validateAdmin, adminProductRouter);

router.use('/admin/mascotas', validateAdmin, adminMascotasRouter);




// Rutas para los archivos HTML
router.get('/', (req, res) => res.sendFile(path.resolve(__dirname, '../views/home.html')));
router.get('/home', (req, res) => res.sendFile(path.resolve(__dirname, '../views/home.html')));
router.get('/shopping_cart', (req, res) => res.sendFile(path.resolve(__dirname, '../views/shopping_cart.html')));

module.exports = router;