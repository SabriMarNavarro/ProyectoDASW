

class ProductException {
    constructor(errorMessage){
        this.errorMessage = errorMessage;
    }
}

// Clase productos 
class Product {
    constructor(title, description, imageUrl, unit, stock, pricePerUnit, category, type){
        this._uuid = generateUUID();
        this._title = title;
        this._description = description;
        this._imageUrl = imageUrl;
        this._unit = unit;
        this._stock = stock;
        this._pricePerUnit = pricePerUnit;
        this._category = category;
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

    get unit(){
        return this._unit;
    }

    get stock(){
        return this._stock;
    }

    get pricePerUnit(){
        return this._pricePerUnit;
    }

    get category(){
        return this._category;
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
            throw new ProductException("El nombre del producto esta vacio");
        }
        this._title = value;
    }

    set description(value){
        if(!value){
            throw new ProductException("La Descripción del producto esta vacio");
        }
        this._description = value;
    }

    set imageUrl(value){
        if(!value){
            throw new ProductException("El link de la imagen esta vacio");
        }
        this._imageUrl= value;
    }

    set unit(value){
        if(!value){
            throw new ProductException("las unidades de la imagen estan vacio");
        }
        this._unit = value;
    }

    set stock(value){
        if(value< 0){
            throw new ProductException("El stock debe de ser igual o mayor a 0");
        }
        this._stock = value;
    }

    set pricePerUnit(value){
        if(value< 0){
            throw new ProductException("El pricePerUnit debe de ser igual o mayor a 0");
        }
        this._pricePerUnit = value;
    }

    set category(value){
        if(!value){
            throw new ProductException("El nombre de la categoria esta vacio");
        }
        this._category = value;
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
        let atributos = ["uuid", "title", "description", "imageUrl", "unit", "stock", "pricePerUnit", "category", "type"];
        
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

        let Objeto_limpio = Product.cleanObject(convertir_JSON);

        return new Product(
            Objeto_limpio.title,
            Objeto_limpio.description,
            Objeto_limpio.imageUrl,
            Objeto_limpio.unit,
            Objeto_limpio.stock,
            Objeto_limpio.pricePerUnit,
            Objeto_limpio.category,
            Objeto_limpio.type
        );

    }

    // Esta función debe convertir el objeto recibido en una nueva
    // instancia de producto (utilizando la clase Product) y 
    // debe ser capaz de ignorar todos
    //aquellos valores que no pertenezcan a la clase Product.
    
    static createFromObject(valor_objeto){
        
        let Objeto_limpio2 = Product.cleanObject(valor_objeto);

        let producto = new Product(
            Objeto_limpio2.title,
            Objeto_limpio2.description,
            Objeto_limpio2.imageUrl,
            Objeto_limpio2.unit,
            Objeto_limpio2.stock,
            Objeto_limpio2.pricePerUnit,
            Objeto_limpio2.category,
            Objeto_limpio2.type

        );


        return producto;
    }

}

