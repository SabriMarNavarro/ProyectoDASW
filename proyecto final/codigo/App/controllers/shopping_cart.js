


// Clase ShoppingCartException

class ShoppingCartException {
    constructor(ErrorMessage){
        this.ErrorMessage = ErrorMessage;
    }
}

class ProductProxy {
    // Constructor
    constructor(productUuid, amount){
        this.productUuid = productUuid;
        this.amount = amount;
    }
}

class ProductFavoritos {
    // Constructor
    constructor(productUuid){
        this.productUuid = productUuid;
    }
}


class ShoppingCart {
   
    constructor(){
        this.proxies = [];
        this.products = [];
        this.favoritos = [];
    }

    addItem(productUuid, amount){
        
        let producto = this.proxies.find(item => item.productUuid === productUuid);

        if( amount < 0){
            throw new ShoppingCartException("La cantidad no puede ser menor a 0");
        } else if( producto ){
            producto.amount += amount;
        } else {
            this.proxies.push(new ProductProxy (productUuid, amount));
        }
    }

    addFavoritos(productUuid){
        this.favoritos.push(new ProductFavoritos (productUuid));
    }

    updateItem(productUuid, newAmount){

        let producto_1 = this.proxies.find(item => item.productUuid === productUuid);
        
        if(newAmount<0){
            throw new ShoppingCartException("La cantidad no puede ser menor a 0")
        }else if ( newAmount == 0){
            let uuid_eliminar = this.proxies.findIndex(item => item.productUuid == productUuid);
             proxies.splice(uuid_eliminar,1);
        } else {
            producto_1.amount = newAmount;
        }

    }

    removelItem(productUuid){
        let uuid_eliminar_2 = this.proxies.findIndex(item => item.productUuid == productUuid);
        this.proxies.splice(uuid_eliminar_2,1);
    }

    removeFavorito(productUuid){
        let uuid_eliminar  = this.favoritos.findIndex(item => item.productUuid == productUuid);
        this.favoritos.splice(uuid_eliminar,1);
    }

    calculateTotal(){

        let total = 0;

        for(let proxy of this.proxies){
            
            let producto = this.products.find(item  => item._uuid === proxy.productUuid);

            total += producto._pricePerUnit * proxy.amount;
        }

        return total;

    }

    addProduct(product){
        this.products.push(product);
    }

    getProxies(){
        return [...this.proxies];;
    }

    getFavoritos(){
        return [...this.favoritos];
    }


}



