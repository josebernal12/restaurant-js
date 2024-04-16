import { cancelAccount, completedProduct, createTicket, deleteTicket, finishedTicket, getTicketById, getTickets, receivedTicket, updateTicket } from "../services/ticket.js"

export const createTicketController = async (req, res) => {
  const { products, subtotal, total, userId, waiter } = req.body
  const { id } = req.params

  const ticket = await createTicket(products, subtotal, total, id, userId, waiter)
  if (ticket.msg) {
    res.status(404).json(ticket)
    return
  }
  res.json(ticket)
}

export const updateTicketController = async (req, res) => {
  const { products, subTotal, total, tableId, userId } = req.body
  const { id } = req.params
  const ticket = await updateTicket(id, products, subTotal, total, tableId, userId)

  if (ticket.msg) {
    res.status(404).json(ticket)
    return
  }
  res.json(ticket)
}

export const getTicketsController = async (req, res) => {
  const tickets = await getTickets()
  if (tickets.msg) {
    res.status(404).json(tickets)
    return
  }
  res.json(tickets)
}

export const getTicketsByIdController = async (req, res) => {
  const { id } = req.params

  const ticket = await getTicketById(id)

  if (ticket.msg) {
    res.status(404).json(ticket)
    return
  }
  res.json(ticket)
}

export const deleteTicketController = async (req, res) => {
  const { id } = req.params
  const ticket = await deleteTicket(id)
  if (ticket.msg) {
    res.status(404).json(ticket)
    return
  }
  res.json(ticket)
}

export const cancelTicketController = async (req, res) => {
  const { id } = req.params
  const { tableId } = req.body
  const message = await cancelAccount(id, tableId)
  if (message.msg) {
    res.status(404).json(message)
    return
  }
  res.json(message)
}

export const receivedTicketController = async (req, res) => {
  const { id } = req.params

  const ticket = await receivedTicket(id)
  if (ticket.msg) {
    res.status(404).json(ticket)
    return
  }
  res.json(ticket)
}
export const finishedTicketController = async (req, res) => {
  const { id } = req.params

  const ticket = await finishedTicket(id)
  if (ticket.msg) {
    res.status(404).json(ticket)
    return
  }
  res.json(ticket)
}

export const completedProductController = async (req, res) => {
  const { id } = req.params
  const ticket = await completedProduct(id)
  if (ticket.msg) {
    res.status(404).json(ticket)
    return
  }
  res.json(ticket)
}