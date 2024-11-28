document.getElementById('pagar').addEventListener('click', async () => {
    try {
        // Leer los productos del carrito desde sessionStorage
        const cart = readShoppingCart();
        const total = cart.calculateTotal() + 500;  // Asegúrate de incluir el costo de envío

        // Verificar si el carrito tiene productos
        if (cart.proxies.length === 0) {
            alert('Tu carrito está vacío.');
            return;
        }

        // Enviar el total de la compra al servidor para crear la sesión de pago
        const response = await fetch('http://localhost:3000/pagos/crear-sesion-pago', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ total }),  // Solo el total
        });

        if (!response.ok) {
            throw new Error('Error al crear la sesión de pago');
        }

        const session = await response.json();

        // Redirigir a Stripe Checkout
        const stripe = Stripe('pk_test_51QPaybAMM3kaRCJCLWxNGpGJhVxd2HFEsSC3cIV2eRtVsuLPoXJRFdMgNRWv73pyvZsugeNTO2SxutdgeZEvpdCb00rAFARu5H');
        const { error } = await stripe.redirectToCheckout({ sessionId: session.id });

        if (error) {
            console.error(error);
            alert('Hubo un error durante el proceso de pago.');
        }
    } catch (error) {
        console.error('Error:', error.message);
        alert('Hubo un problema al procesar tu pago. Por favor, inténtalo de nuevo.');
    }
});
