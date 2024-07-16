import { currency } from "../services/currency.js"


export const currencyController = async (req, res) => {

    const coin = await currency()
    res.json(coin)
}