import { designTicket, getDesignTicketById } from "../services/designTicket.js"

export const designTicketController = async (req, res) => {
    const { name, email, address, phone, logo } = req.body
    const designModel = await designTicket(name, email, address, phone, logo)
    if (designModel.msg) {
        res.status(404).json(designModel)
        return
    }
    res.json(designModel)
}


export const getDesignTicketByIdController = async (req, res) => {
    const { id } = req.params
    const bill = await getDesignTicketById(id)
    if (bill.msg) {
        res.status(404).json(bill)
        return
    }
    res.json(bill)
}