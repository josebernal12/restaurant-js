import ticketModel from "../model/TIcketModel.js"
import tableModel from "../model/TableModel.js"

export const createTicket = async (products, subTotal, total, tableId, userId) => {
  try {
    const newTicket = await ticketModel.create({ products, subTotal, total, tableId, userId })
    if (!newTicket) {
      return 'error al crear el ticket'
    }
    await tableModel.findByIdAndUpdate(tableId, { available: false }, { new: true })
    return newTicket
  } catch (error) {
    console.log(error)
  }
}

export const updateTicket = async (id, products, subTotal, total, tableId, userId) => {
  try {
    const ticketUpdate = await ticketModel.findByIdAndUpdate(id, { products, subTotal, total, tableId, userId }, { new: true })
    if (!ticketUpdate) {
      return 'no se pudo actualizar'
    }
    return ticketUpdate
  } catch (error) {
    console.log(errp)
  }
}

export const getTickets = async () => {
  try {
    const tickets = await ticketModel.find()
    if (!tickets) {
      return {
        msg: 'no hay tickets creados'
      }
    }
    return tickets
  } catch (error) {
    console.log(error)
  }
}


export const getTicketById = async (id) => {
  try {
    const ticket = await ticketModel.findOne({ tableId: id })
    if (!ticket) {
      return {
        msg: 'no hay ticket con ese id'
      }
    }
    return ticket
  } catch (error) {
    console.log(error)
  }
}