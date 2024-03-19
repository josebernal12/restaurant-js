import mongoose from "mongoose";
import ticketModel from "../model/TIcketModel.js"
import tableModel from "../model/TableModel.js"

export const createTicket = async (products, subTotal, total, tableId, userId) => {
  try {
    const tableObjectId = mongoose.Types.ObjectId(tableId);
    const table = await tableModel.findById(tableObjectId)
    if (table) {
      const newTicket = await ticketModel.create({ products, subTotal, total, tableId, userId })
      if (!newTicket) {
        return 'error al crear el ticket'
      }
      await tableModel.findByIdAndUpdate(tableId, { available: false }, { new: true })
      return newTicket
    }
    return {
      msg: 'no existen mesas con ese id'
    }

  } catch (error) {
    console.log(error)
  }
}

export const updateTicket = async (id, products, subTotal, total, tableId, userId) => {
  try {
    const ticketId = await ticketModel.findOne({ tableId: id })
    const ticketUpdate = await ticketModel.findByIdAndUpdate(ticketId._id, { products, subTotal, total, tableId, userId }, { new: true })
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

export const deleteTicket = async (id) => {
  try {
    const ticketDeleted = await ticketModel.findByIdAndDelete(id, { new: true })
    if (!ticketDeleted) {
      return {
        msg: 'no hay tickets con ese id'
      }
    }
    return ticketDeleted
  } catch (error) {
    console.log(error)
  }
}

export const joinTable = async (idsTables) => {
  try {
   const ticket =  await ticketModel.create()
  } catch (error) {
    console.log(error)
  }
}