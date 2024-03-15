import ticketModel from "../model/TIcketModel.js"

export const createTicket = async (products, subTotal, total, tableId, userId) => {
  try {
    const newTicket = await ticketModel.create({ products, subTotal, total, tableId, userId })
    if (!newTicket) {
      return 'error al crear el ticket'
    }
    return newTicket
  } catch (error) {
    console.log(error)
  }
}