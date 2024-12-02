// Importaciones:
const express = require('express');
const path = require('path');
const productRouter = require('../routes/products');
const mascotasRouter = require('../routes/mascotas');
const pagoRouter = require('../routes/pagos');
const favoritosRouter = require('../routes/favoritos');
const usersRouter = require('../routes/users');

const adminProductRouter = require('../routes/admin_products'); 
const adminMascotasRouter = require('../routes/admin_mascotas');
const adminUsersRouter = require('../routes/admin_users'); 


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
router.use('/users', usersRouter);
router.use('/pagos', pagoRouter);


// Rutas administradas por el middleware de validación
router.use('/admin/products', validateAdmin, adminProductRouter);

router.use('/admin/mascotas', validateAdmin, adminMascotasRouter);

router.use('/admin/users', validateAdmin, adminUsersRouter);




// Rutas para los archivos HTML
router.get('/', (req, res) => res.sendFile(path.resolve(__dirname, '../Views/proyecto_final_primeraEntrega.html')));
router.get('/home', (req, res) => res.sendFile(path.resolve(__dirname, '../views/home.html')));
router.get('/shopping_cart', (req, res) => res.sendFile(path.resolve(__dirname, '../views/shopping_cart.html')));

module.exports = router;
