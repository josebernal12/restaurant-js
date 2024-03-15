import { createTicket } from "../services/ticket.js"

export const createTicketController = async (req, res) => {
  const { products, subtotal, total } = req.body
  const { id } = req.params
  const userId = req.user

  const ticket = await createTicket(products, subtotal, total, id, userId)
  res.json(ticket)
}