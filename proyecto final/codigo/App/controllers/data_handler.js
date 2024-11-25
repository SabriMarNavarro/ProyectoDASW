const { Productos, Mascotas, Favoritos } = require('../data/db'); // Importamos los modelos

class DataHandlerException {
    constructor(errorMessage) {
        this.errorMessage = errorMessage;
    }
}

// Función genérica para obtener todos los elementos de un modelo
async function getAll(Model) {
    try {
        const result = await Model.find();
        return result;
    } catch (error) {
        throw new DataHandlerException(`Error al obtener datos de ${Model.modelName}: ${error.message}`);
    }
}

// Función genérica para obtener un elemento por su UUID
async function getById(Model, uuid) {
    try {
        const item = await Model.findOne({ _uuid: uuid });
        if (!item) throw new DataHandlerException(`${Model.modelName} con UUID no encontrado`);
        return item;
    } catch (error) {
        throw new DataHandlerException(`Error al obtener ${Model.modelName}: ${error.message}`);
    }
}

// Función genérica para crear un nuevo elemento
async function create(Model, values) {
    try {
        const existingItem = await Model.findOne({ _uuid: values._uuid });
        if (existingItem) throw new DataHandlerException(`Ya existe un ${Model.modelName} con ese UUID`);

        const newItem = new Model(values);
        return await newItem.save();
    } catch (error) {
        throw new DataHandlerException(`Error al crear ${Model.modelName}: ${error.message}`);
    }
}

// Función genérica para actualizar un elemento por su UUID
async function update(Model, uuid, updatedValues) {
    try {
        const updatedItem = await Model.findOneAndUpdate({ _uuid: uuid }, updatedValues, { new: true });
        if (!updatedItem) throw new DataHandlerException(`${Model.modelName} no encontrado`);
        return updatedItem;
    } catch (error) {
        throw new DataHandlerException(`Error al actualizar ${Model.modelName}: ${error.message}`);
    }
}

// Función genérica para eliminar un elemento por su UUID
async function remove(Model, uuid) {
    try {
        const deletedItem = await Model.findOneAndDelete({ _uuid: uuid });
        if (!deletedItem) throw new DataHandlerException(`${Model.modelName} no encontrado`);
        return deletedItem;
    } catch (error) {
        throw new DataHandlerException(`Error al eliminar ${Model.modelName}: ${error.message}`);
    }
}

// Función genérica para búsqueda
async function find(Model, query, fields) {
    try {
        const regexQuery = new RegExp(query, 'i'); // Búsqueda insensible a mayúsculas/minúsculas
        const conditions = fields.map(field => ({ [field]: regexQuery }));
        return await Model.find({ $or: conditions });
    } catch (error) {
        throw new DataHandlerException(`Error al buscar en ${Model.modelName}: ${error.message}`);
    }
}

// Funciones para manejar Favoritos

// Obtener todos los favoritos de un usuario
async function getFavoritosByUserId(userId) {
    try {
        const favoritos = await Favoritos.find({ _userId: userId });
        return favoritos;
    } catch (error) {
        throw new DataHandlerException(`Error al obtener favoritos: ${error.message}`);
    }
}

// Añadir un producto o mascota a los favoritos de un usuario
async function addFavorito(userId, itemId, itemType) {
    try {
        // Verificamos si ya existe este favorito para el usuario
        const existingFavorito = await Favoritos.findOne({ _userId: userId, "likeItems._itemId": itemId });
        if (existingFavorito) throw new DataHandlerException("Este ítem ya está en los favoritos");

        const newFavorito = new Favoritos({
            _userId: userId,
            _likeItems: [{ _itemId: itemId, _type: itemType }]
        });

        return await newFavorito.save(); // Guardamos el nuevo favorito en la base de datos
    } catch (error) {
        throw new DataHandlerException(`Error al agregar favorito: ${error.message}`);
    }
}

// Eliminar un favorito de un usuario
async function removeFavorito(userId, itemId) {
    try {
        const favorito = await Favoritos.findOneAndUpdate(
            { _userId: userId },
            { $pull: { _likeItems: { _itemId: itemId } } },
            { new: true }
        );
        if (!favorito) throw new DataHandlerException("Favorito no encontrado");
        return favorito;
    } catch (error) {
        throw new DataHandlerException(`Error al eliminar favorito: ${error.message}`);
    }
}

// Exportar funciones específicas para cada modelo
module.exports = {
    DataHandlerException,
    getProducts: () => getAll(Productos),
    getMascotas: () => getAll(Mascotas),
    getFavoritosByUserId,
    getProductById: (uuid) => getById(Productos, uuid),
    getMascotaById: (uuid) => getById(Mascotas, uuid),
    createProduct: (values) => create(Productos, values),
    createMascota: (values) => create(Mascotas, values),
    updateProduct: (uuid, values) => update(Productos, uuid, values),
    updateMascota: (uuid, values) => update(Mascotas, uuid, values),
    deleteProduct: (uuid) => remove(Productos, uuid),
    deleteMascota: (uuid) => remove(Mascotas, uuid),
    findProduct: (query) => find(Productos, query, ['_title', '_category']),
    findMascota: (query) => find(Mascotas, query, ['_Nombre', '_description', '_Status']),
    addFavorito,
    removeFavorito
};