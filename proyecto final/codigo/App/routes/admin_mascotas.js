const express = require("express");
const router = express.Router();
const { 
    DataHandlerException, 
    getMascotas, 
    getMascotaById, 
    createMascota, 
    updateMascota, 
    deleteMascota, 
    findMascota 
} = require('../controllers/data_handler');

// Ruta para crear un producto
router.post('/', async (req, res) => {
    let product = req.body;

    const requiredAttributes = ['_uuid', '_title', '_description','_imageUrl','_status','_edad','_type']; 
    const missingAttributes = requiredAttributes.filter(attr => !product[attr]);

    if (missingAttributes.length > 0) {
        return res.status(400).json({ 
            message: `Faltan los siguientes atributos: ${missingAttributes.join(', ')}` 
        });
    }

    try {
        // Usa await para esperar que la promesa de crear el producto se resuelva
        await createMascota(product);
        return res.status(201).json({ message: `Producto creado: ${product._title}` });
    } catch (error) {
        if (error instanceof DataHandlerException) {
            return res.status(404).json({ message: error.errorMessage });
        }

        return res.status(500).json({ message: "Error interno del servidor" });
    }
});

// Ruta para actualizar un producto
router.route('/:id')
    .put(async (req, res) => { // Cambiado a 'async' para usar 'await'
        let id = req.params.id;
        let product = req.body;

        try {
            const updateMascota = await updateMascota(id, product); // Usa 'await' aquí
            return res.status(200).json({ message: `Producto actualizado: ${updateMascota._title}` });
        } catch (error) {
            if (error instanceof DataHandlerException) {
                return res.status(404).json({ message: error.errorMessage });
            }
    
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    }) 
    // Ruta para eliminar un producto
    .delete(async (req, res) => { // Cambiado a 'async' para usar 'await'
        let id = req.params.id;

        try {
            const deleteMascota = await deleteMascota(id); // Usa 'await' aquí
            return res.status(200).json({ message: `Producto eliminado: ${deleteMascota._title}` });
        } catch (error) {
            if (error instanceof DataHandlerException) {
                return res.status(404).json({ message: error.errorMessage });
            }
    
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    });

// Exportar la ruta del router
module.exports = router;