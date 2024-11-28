

class ProductException {
    constructor(errorMessage){
        this.errorMessage = errorMessage;
    }
}

// Clase productos 
class Mascotas {
    constructor(title, description, imageUrl, especie, edad, tamano, type){
        this._uuid = generateUUID();
        this._title = title;
        this._description = description;
        this._imageUrl = imageUrl;
        this._especie = especie;
        this._edad = edad;
        this._tamano = tamano;
        this._type = type;
    }

    // Getters 

    get uuid(){
        return this._uuid;
    }

    get title(){
        return this._title;
    }

    get description(){
        return this._description;
    }

    get imageUrl(){
        return this._imageUrl;
    }

    get especie(){
        return this._especie;
    }

    get edad(){
        return this._edad;
    }

    get tamano(){
        return this._tamano;
    }

    get type(){
        return this._type;
    }


    // Setters

    set uuid(value){
        throw new ProductException("Product uuds are auto-generated");
    }

    set title(value){
        if(!value){
            throw new ProductException("El nombre de la mascota esta vacio");
        }
        this._title = value;
    }

    set description(value){
        if(!value){
            throw new ProductException("La Descripción de la mascota esta vacio");
        }
        this._description = value;
    }

    set imageUrl(value){
        if(!value){
            throw new ProductException("El link de la imagen esta vacio");
        }
        this._imageUrl= value;
    }

    set especie(value){
        if(!especie){
            throw new ProductException("El estatus de la mascota esta vacio");
        }
        this._especie= value;
    }

    set edad(value){
        if(!estatus){
            throw new ProductException("la edad de la mascota esta vacio");
        }
        this._edad= value;
    }

    set tamano(value){
        if(!tamano){
            throw new ProductException("la edad de la mascota esta vacio");
        }
        this._tamano= tamano;
    }


    set type(value){
        if(!value){
            throw new ProductException("El nombre del type esta vacio");
        }
        this._type = value;
    }

    // Funciones estaticas

    // Esta función debe limpiar el objeto recibido de todos aquellos
    // valores que no pertenezcan a la clase Product. La debes utilizar en createFromObject
    // para poder “limpiar” el objeto y dejarle sólo los atributos del objeto que necesita un
    // Producto en caso de que recibas un objeto que tenga más cosas.


    static cleanObject(obj) {
        // Lista de atributos que pertenecen a la clase Product
        let atributos = ["uuid","title", "description", "imageUrl", "especie", "edad", "tamano", "type"];
        
        // Objeto limpio que contendrá solo las propiedades válidas
        let objeto_limpio = {};
        
        for(let propiedad of atributos){
            if(obj[propiedad] !== undefined){
                objeto_limpio[propiedad] = obj[propiedad];
            }
        }
        
    
        return objeto_limpio;
    }

    

    // Esta función debe convertir el String de JSON recibido
    // en una nueva instancia de producto (utilizando la clase Product)

    static createFromJson( valor_string){

        let convertir_JSON = JSON.parse(valor_string);

        let Objeto_limpio = Mascotas.cleanObject(convertir_JSON);

        return new Mascotas(
            Objeto_limpio.title,
            Objeto_limpio.description,
            Objeto_limpio.imageUrl,
            Objeto_limpio.especie,
            Objeto_limpio.edad,
            Objeto_limpio.tamano,
            Objeto_limpio.type
        );

    }

    // Esta función debe convertir el objeto recibido en una nueva
    // instancia de producto (utilizando la clase Product) y 
    // debe ser capaz de ignorar todos
    //aquellos valores que no pertenezcan a la clase Product.
    
    static createFromObject(valor_objeto){
        
        let Objeto_limpio2 = Mascotas.cleanObject(valor_objeto);

        let Mascotas = new Mascotas(
            Objeto_limpio2.title,
            Objeto_limpio2.description,
            Objeto_limpio2.imageUrl,
            Objeto_limpio2.especie,
            Objeto_limpio2.edad,
            Objeto_limpio.tamano,
            Objeto_limpio2.type
        );


        return Mascotas;
    }

}
