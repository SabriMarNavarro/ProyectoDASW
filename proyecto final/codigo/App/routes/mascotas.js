const express = require("express");
const router = express.Router();
const { 
    DataHandlerException, 
    getMascotas, 
    getMascotaById, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    findMascota
} = require('../controllers/data_handler');

const ShoppingCart = require('../controllers/shopping_cart');


// Rutas para mascotas
router.get('/', async (req, res) => {
    try {
        const query = req.query.category; // Obtiene la categoría si existe
        const page = parseInt(req.query.page) || 1; // Obtiene la página actual, por defecto es 1
        const itemsPerPage = 8; // Número de productos por página

        // Si hay una categoría, filtrar los productos por esa categoría
        let products = query ? await findMascota(query) : await getMascotas(); // Esperar la promesa de `getProducts`

        // Verifica si hay productos
        if (products.length === 0) {
            return res.json({
                Mascotas: [],
                totalPages: 0
            });
        }

        // Calcular el índice de inicio y fin según la página
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = page * itemsPerPage;

        // Devolver solo los productos de la página solicitada
        const paginatedProducts = products.slice(startIndex, endIndex);

        // Calcular el número total de páginas
        const totalPages = Math.ceil(products.length / itemsPerPage);

        // Enviar los productos paginados y el número total de páginas
        return res.json({
            products: paginatedProducts,
            totalPages: totalPages
        });
    } catch (error) {
        // Manejo de errores
        if (error instanceof DataHandlerException) {
            return res.status(404).json({ message: error.errorMessage });
        }

        return res.status(500).json({ message: "Error interno del servidor" });
    }
});

// Ruta para obtener un producto por su UUID
router.get('/:id', async (req, res) => {
    const productId = req.params.id; // Obtén el ID del producto de los parámetros de la ruta
    try {
        const product = await getMascotaById(productId); // Asegúrate de usar `await` aquí
        return res.json(product); // Envía el producto como respuesta en formato JSON
    } catch (error) {
        if (error instanceof DataHandlerException) {
            return res.status(404).json({ message: error.errorMessage });
        }
        return res.status(500).json({ message: "Error interno del servidor" });
    }
});
module.exports = router;