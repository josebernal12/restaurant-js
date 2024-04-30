import { stripe } from '../stripe/stripe.js'
export const stripeController = async (req, res) => {
    const products = req.body;

    const lineItems = products.map((product) => ({
        price_data: {
            currency: 'mxn',
            product_data: {
                name: product.name,
            },
            unit_amount: product.price * 100, // Multiplicamos por 100 para convertir el precio a centavos
        },
        quantity: product.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: 'payment',
        success_url: "http://localhost:5173/#/home/sells",
        cancel_url: "http://localhost:5173/#/home/sells",
    });

    return res.json({ id: session.id });
};
