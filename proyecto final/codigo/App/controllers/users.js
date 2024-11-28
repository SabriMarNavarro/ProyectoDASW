class UserException {
    constructor(errorMessage){
        this.errorMessage = errorMessage;
    }
}

// Clase users 
class User {
    constructor(uuid, email, password, rol){
        this._uuid = uuid;
        this._email = email;
        this._password = password;
        this._rol = rol;
    }

    // Getters 

    get uuid(){
        return this._uuid;
    }

    get email(){
        return this._email;
    }

    get rol(){
        return this._rol;
    }


    // Setters

    set uuid(value){
        throw new UserException("User uuds are auto-generated");
    }

    set email(value){
        if(!value){
            throw new UserException("El email del user esta vacio");
        }
        this._email = value;
    }

    set rol(value){
        if(!value){
            throw new UserException("El rol del user esta vacio");
        }
        this._rol = value;
    }


    // Funciones estaticas

    // Esta función debe limpiar el objeto recibido de todos aquellos
    // valores que no pertenezcan a la clase User. La debes utilizar en createFromObject
    // para poder “limpiar” el objeto y dejarle sólo los atributos del objeto que necesita un
    // Usero en caso de que recibas un objeto que tenga más cosas.


    static cleanObject(obj) {
        // Lista de atributos que pertenecen a la clase User
        let atributos = ["uuid", "email", "password", "rol"];
        
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
    // en una nueva instancia de user (utilizando la clase User)

    static createFromJson(valor_string){

        let convertir_JSON = JSON.parse(valor_string);

        let Objeto_limpio = User.cleanObject(convertir_JSON);

        return new User(
            Objeto_limpio.uuid,
            Objeto_limpio.email,
            Objeto_limpio.password,
            Objeto_limpio.rol
        );

    }

    // Esta función debe convertir el objeto recibido en una nueva
    // instancia de user (utilizando la clase User) y 
    // debe ser capaz de ignorar todos
    //aquellos valores que no pertenezcan a la clase User.
    
    static createFromObject(valor_objeto){
        
        let Objeto_limpio = User.cleanObject(valor_objeto);

        return new User(
            Objeto_limpio.uuid,
            Objeto_limpio.email,
            Objeto_limpio.password,
            Objeto_limpio.rol
        );
    }

}

