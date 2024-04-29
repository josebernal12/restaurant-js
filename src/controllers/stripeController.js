import { stripe } from "../stripe/stripe.js"

export const stripeController = async (req, res) => {
    const { id, amount, products } = req.body
    console.log(products)
    const session = await stripe.checkout.sessions.create({
        line_items:products,
        mode: 'payment',
        success_url: 'http://localhost:8080/api/bill/success',
        cancel_url: 'http://localhost:8080/api/bill/cancel',
    })
    return res.json(session)
}