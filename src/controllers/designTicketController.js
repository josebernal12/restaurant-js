import { designTicket } from "../services/designTicket.js"

export const designTicketController = async (req, res) => {
    const { name, email, address, phone, logo } = req.body
    const designModel = await designTicket(name, email, address, phone, logo)
    if (designModel.msg) {
        res.status(404).json(designModel)
        return
    }
    res.json(designModel)
}