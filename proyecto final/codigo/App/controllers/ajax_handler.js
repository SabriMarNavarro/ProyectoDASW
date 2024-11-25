
async function loadProducts(url, page = 1) {
    try {
        const response = await fetch(`${url}?page=${page}`);
        if (response.status !== 200) {
            console.error('Error en la solicitud:', response.status, response.statusText);
            return { products: [], totalPages: 0 };
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al cargar los productos:', error);
        return { products: [], totalPages: 0 };
    }
}

function loadCartProducts(url, productList, onSuccess, onError){

    let xhr= new XMLHttpRequest();

    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.send(JSON.stringify(productList));
    xhr.onload= () => {
        if( xhr.status == 200){
            onSuccess(xhr.responseText);
        } else {
            onError(xhr.status + ': ' + xhr.statusText);
        }

    }
    
    getXhrResponse(xhr,onSuccess, onError);
}