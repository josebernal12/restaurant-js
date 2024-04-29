import { stripe } from "../stripe/stripe.js"

export const stripeController = async (req, res) => {
    const { id, amount } = req.body
    const payment = await stripe.paymentIntents.create({
        amount,
        currency: 'MXN',
        payment_method: id,
        confirm: true
    })
    res.json(payment)
}