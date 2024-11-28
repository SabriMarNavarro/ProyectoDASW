const mongoose = require("mongoose");

//Conexion con Bd 
let mongoConnection = "mongodb+srv://Daniel:Indiano501@myapp.uq3iv.mongodb.net/Proyecto_Final"
let db = mongoose.connection;

db.on('connecting', ()=>{
    console.log('Conectando...')
    console.log(mongoose.connection.readyState)
})

db.on('connected', ()=>{
    console.log('¡Conectado exitosamete!')
    console.log(mongoose.connection.readyState)
})

mongoose.connect(mongoConnection);

//Definimos esquema para Productos

let ProductosSchema = mongoose.Schema ({
    _uuid: {
        type: String,
        required: true,
        unique: true
    },
    _title: {
        type: String,
        required: true
    },
    _description: {
        type: String,
        required: true
    },
    _imageUrl: {
        type: String,
        required: true
    },
    _unit: {
        type: String,
        required: true
    },
    _stock: {
        type: Number,
        required: true
    },
    _pricePerUnit: {
        type: Number,
        required: true
    },
    _category: {
        type: String,
        required: true
    },
    _type: {
        type: String,
        required: true
    }

});

let MascotasSchema = mongoose.Schema ({
    _uuid: {
        type: String,
        required: true,
        unique: true
    },
    _title: {
        type: String,
        required: true
    },
    _description: {
        type: String,
        required: true
    },
    _imageUrl: {
        type: String,
        required: true
    },
    _especie:{
        type: String,
        required: true
    },
    _edad:{
        type: Number,
        required: true
    },
    _tamano:{
        type: String,
        required: true
    },
    _type: {
        type: String,
        required: true
    }

});

let FavoritosSchema = mongoose.Schema ({
    _userId: {
        type: String,
        required: true
    },
    _likeItems: {
        _type: {
            type: String,
            required: true
        },_itemId: {
            type: String,
            required: true
        }

    }
});

let UserSchema = mongoose.Schema ({
    _uuid: {
        type: String,
        required: true
    },
    _email: {
        type: String,
        required: true
    },
    _password: {
            type: String,
            required: true
    },
    _rol: {
        type: String,
        required: true
    },
    _favoritos: {
        type: Array,
        required: false
    }
});


//Creamos modelo
let Productos = mongoose.model('productos', ProductosSchema);

//Creamos modelo
let Mascotas = mongoose.model('mascotas', MascotasSchema);

let Favoritos = mongoose.model('favoritos', FavoritosSchema);

let Users = mongoose.model('usuarios', UserSchema);

// Exportamos los modelos y la conexión
module.exports = { Productos, Mascotas, Favoritos, mongoose, Users };