import { designTicket, getDesignTicket } from "../services/designTicket.js"

export const    designTicketController = async (req, res) => {
    const { name, email, address, phone, logo, measures } = req.body
    const designModel = await designTicket(name, email, logo, address, phone,measures)
    if (designModel?.msg) {
        res.status(404).json(designModel)
        return
    }
    res.json(designModel)
}


export const getDesignTicketController = async (req, res) => {
    const bill = await getDesignTicket()
    if (bill?.msg) {
        res.status(404).json(bill)
        return
    }
    res.json(bill)
}