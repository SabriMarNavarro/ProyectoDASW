const express = require("express");
const router = express.Router();
const { 
    DataHandlerException, 
    getUsers, 
    getUserById, 
    createUser, 
    updateUser, 
    deleteUser, 
    findUser 
} = require('../controllers/data_handler');

// Ruta para crear un usero
router.post('/', async (req, res) => {
    let user = req.body;

    const requiredAttributes = ['_email', '_password', '_rol']; 
    const missingAttributes = requiredAttributes.filter(attr => !user[attr]);

    if (missingAttributes.length > 0) {
        return res.status(400).json({ 
            message: `Faltan los siguientes atributos: ${missingAttributes.join(', ')}` 
        });
    }

    try {
        // Usa await para esperar que la promesa de crear el usero se resuelva
        await createUser(user);
        return res.status(201).json({ message: `User creado: ${user._email}` });
    } catch (error) {
        if (error instanceof DataHandlerException) {
            return res.status(404).json({ message: error.errorMessage });
        }

        return res.status(500).json({ message: "Error interno del servidor" });
    }
});

// Ruta para actualizar un user
router.route('/:id')
    .put(async (req, res) => { // Cambiado a 'async' para usar 'await'
        let id = req.params.id;
        let user = req.body;

        try {
            const updatedUser = await updateUser(id, user); // Usa 'await' aquí
            return res.status(200).json({ message: `User actualizado: ${updatedUser._email}` });
        } catch (error) {
            if (error instanceof DataHandlerException) {
                return res.status(404).json({ message: error.errorMessage });
            }
    
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    }) 
    // Ruta para eliminar un user
    .delete(async (req, res) => { // Cambiado a 'async' para usar 'await'
        let id = req.params.id;

        try {
            const deletedUser = await deleteUser(id); // Usa 'await' aquí
            return res.status(200).json({ message: `User eliminado: ${deletedUser._email}` });
        } catch (error) {
            if (error instanceof DataHandlerException) {
                return res.status(404).json({ message: error.errorMessage });
            }
    
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    });

// Exportar la ruta del router
module.exports = router;