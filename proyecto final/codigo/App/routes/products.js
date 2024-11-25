const express = require("express");
const router = express.Router();
const { 
    DataHandlerException, 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    findProduct 
} = require('../controllers/data_handler');

const ShoppingCart = require('../controllers/shopping_cart');


/* router.get('/', (req, res) => {
    try {
        const query = req.query.category; // Busca el query en query o params
        

        if (query) {
            const filteredProducts = findProduct(query);
            return res.json(filteredProducts);
        }

        const products = getProducts();
        return res.json(products);
    } catch (error) {
        if (error instanceof DataHandlerException) {
            return res.status(404).json({ message: error.errorMessage });
        }

        return res.status(500).json({ message: "Error interno del servidor" });
    }
}); */

// Ruta para obtener productos (con paginación)
router.get('/', async (req, res) => {
    try {
        const query = req.query.category; // Obtiene la categoría si existe
        const page = parseInt(req.query.page) || 1; // Obtiene la página actual, por defecto es 1
        const itemsPerPage = 8; // Número de productos por página

        // Si hay una categoría, filtrar los productos por esa categoría
        let products = query ? await findProduct(query) : await getProducts(); // Esperar la promesa de `getProducts`

        // Verifica si hay productos
        if (products.length === 0) {
            return res.json({
                products: [],
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
        const product = await getProductById(productId); // Asegúrate de usar `await` aquí
        return res.json(product); // Envía el producto como respuesta en formato JSON
    } catch (error) {
        if (error instanceof DataHandlerException) {
            return res.status(404).json({ message: error.errorMessage });
        }
        return res.status(500).json({ message: "Error interno del servidor" });
    }
});

router.route('/cart')
    .post(async (req, res) => {
        let proxies = req.body;

        // 1. Validar que el cuerpo sea un arreglo
        if (!Array.isArray(proxies)) {
            return res.status(400).json({ message: "El body debe ser un arreglo" });
        }

        // 2. Crear un carrito de compras
        const shoppingCart = new ShoppingCart();
        let productsNotFound = [];

        // 3. Iterar por el arreglo de proxies
        for (let proxy of proxies) {
            try {
                // Obtener el producto por su UUID
                let product = await getProductById(proxy._uuid); // Asegúrate de usar `await` aquí

                if (product) {
                    // Agregar el producto al carrito si fue encontrado
                    shoppingCart.addProduct(product); // Primero lo añadimos a los productos del carrito
                    shoppingCart.addItem(proxy._uuid, proxy._amount); // Luego añadimos el proxy (UUID + cantidad)
                }
            } catch (error) {
                // Si no se encuentra el producto, añadirlo a la lista de productos no encontrados
                if (error instanceof DataHandlerException) {
                    productsNotFound.push(proxy._uuid);
                } else if (error instanceof ShoppingCartException) {
                    // Si hay un error en el carrito de compras (ej: cantidad negativa)
                    return res.status(400).json({ message: error.ErrorMessage });
                } else {
                    return res.status(500).json({ message: "Error interno del servidor" });
                }
            }
        }

        // 4. Si hay productos no encontrados, retornar un error 404
        if (productsNotFound.length > 0) {
            return res.status(404).json({
                message: `No se encontraron los siguientes uuid en ningun producto: ${productsNotFound.join(', ')}`
            });
        }

        // 5. Si todos los productos fueron encontrados y agregados correctamente, retornar el carrito
        return res.status(200).json({
            message: "Productos agregados al carrito exitosamente",
            cart: shoppingCart.getProxies() // Regresa los proxies del carrito
        });
});

module.exports = router;