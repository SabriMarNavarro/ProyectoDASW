const express = require('express');
const router = express.Router();
const stripe = require('stripe')('sk_test_51QPaybAMM3kaRCJCzNZnVc7ouIwUJMRzYcOjitAu2tpcGXUIasOBerLdpRZiLjc53Ewc1tH8gPlTy7HgkNlrOMWK00V6VoZF3p'); // Clave secreta de Stripe

// Ruta para crear una sesión de pago
// Ruta para crear una sesión de pago
router.post('/crear-sesion-pago', async (req, res) => {
    try {
        const { total } = req.body; // Solo recibimos el total

        // Crear la sesión de pago en Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'mxn',
                    product_data: { name: 'Total de compra' }, // Solo un producto genérico
                    unit_amount: parseInt(total)*100, // Stripe usa centavos
                },
                quantity: 1, // Solo un producto (el total)
            }],
            mode: 'payment',
            success_url: 'http://127.0.0.1:5501/proyecto%20final/codigo/App/Views/shopping_cart.html?status=success', // Cambia la URL si es necesario
            cancel_url: 'http://127.0.0.1:5501/proyecto%20final/codigo/App/Views/shopping_cart.html?error=payment_failed',  // Cambia la URL si es necesario
        });

        res.json({ id: session.id }); // Devolver el ID de la sesión al cliente
    } catch (error) {
        console.error('Error al crear la sesión de pago:', error.message);
        res.status(500).json({ error: error.message });
    }
});


// Ruta para confirmar el pago
router.get('/confirmar-pago', async (req, res) => {
    try {
        const { session_id } = req.query;  // Obtener el session_id de la query string

        // Obtener la sesión de pago desde Stripe
        const session = await stripe.checkout.sessions.retrieve(session_id);

        // Verificar si la sesión fue pagada
        if (session.payment_status === 'paid') {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        console.error('Error al verificar el pago:', error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
