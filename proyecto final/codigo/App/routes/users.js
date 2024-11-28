const express = require("express");
const router = express.Router();
const { 
    DataHandlerException, 
    getUsers, 
    getUserById, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    findUser
} = require('../controllers/data_handler');


// Rutas para users
router.get('/', async (req, res) => {
    try {
        const query = req.query.category; // Obtiene la categoría si existe
        
        // Si hay una categoría, filtrar los users por esa categoría
        let users = query ? await findUser(query) : await getUsers(); // Esperar la promesa de `getProducts`

        // Verifica si hay users
        if (users.length === 0) {
            return res.json({
                Users: []
            });
        }

        // Enviar los users 
        return res.json({
            users: users,
        });
    } catch (error) {
        // Manejo de errores
        if (error instanceof DataHandlerException) {
            return res.status(404).json({ message: error.errorMessage });
        }

        return res.status(500).json({ message: "Error interno del servidor" });
    }
});

// Ruta para obtener un user por su UUID
router.get('/:id', async (req, res) => {
    const userId = req.params.id; // Obtén el ID del user de los parámetros de la ruta
    try {
        const user = await getUserById(userId); // Asegúrate de usar `await` aquí
        return res.json(user); // Envía el user como respuesta en formato JSON
    } catch (error) {
        if (error instanceof DataHandlerException) {
            return res.status(404).json({ message: error.errorMessage });
        }
        return res.status(500).json({ message: "Error interno del servidor" });
    }
});
module.exports = router;