

function initShoppingCart(){
    if( sessionStorage.getItem('shoppingCart') == null){
        let cart = new ShoppingCart();
        writeShoppingCart(cart);
    }
}


function readShoppingCart() {
    let cartData = sessionStorage.getItem('shoppingCart');
    if (cartData) {
        let parsedCart = JSON.parse(cartData);
        // Asegurarse de convertirlo en una instancia de ShoppingCart
        let cart = new ShoppingCart();
        cart.proxies = parsedCart.proxies || [];
        cart.products = parsedCart.products || [];
        return cart;
    } 
}


function writeShoppingCart(cart){
    sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
}

initShoppingCart();