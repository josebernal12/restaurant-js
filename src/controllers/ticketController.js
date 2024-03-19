import { createTicket, deleteTicket, getTicketById, getTickets, updateTicket } from "../services/ticket.js"

export const createTicketController = async (req, res) => {
  const { products, subtotal, total } = req.body
  const { id } = req.params
  const userId = req.user

  const ticket = await createTicket(products, subtotal, total, id, userId)
  res.json(ticket)
}

export const updateTicketController = async (req, res) => {
  const { products, subTotal, total, tableId } = req.body
  const { id } = req.params
  const user = req.user
  const ticket = await updateTicket(id, products, subTotal, total, tableId, user)

  res.json(ticket)
}

export const getTicketsController = async (req, res) => {
  const tickets = await getTickets()
  res.json(tickets)
}

export const getTicketsByIdController = async (req, res) => {
  const { id } = req.params

  const ticket = await getTicketById(id)

  res.json(ticket)
}

export const deleteTicketController = async (req, res) => {
  const { id } = req.params
  const ticket = await deleteTicket(id)
  res.json(ticket)
}