import billModel from "../model/BillModel.js"
import tableModel from "../model/TableModel.js"

export const generateBill = async (ticketId, tableId, userId) => {
  try {

    if (!ticketId || !tableId) {
      return 'error al generar facturas (te falta datos por proporcionar)'
    }
    const newBill = await billModel.create({ ticketId, tableId, userId })
    await tableModel.findByIdAndUpdate(tableId, { available: true }, { new: true })
    if (!newBill) {
      return 'error al generar la factura'
    }
    return newBill
  } catch (error) {
    console.log(error)
  }
}

export const getBills = async () => {
  try {
    const bill = await billModel.find().populate('ticketId').populate('tableId')
    if (!bill) {
      return 'no hay facturas'
    }
    return bill
  } catch (error) {
    console.log(error)
  }
}

export const getBIllById = async (id) => {
  try {
    const bill = await billModel.findById(id).populate('ticketId').populate('tableId').populate('userId')
      
    if (!bill) {
      return {
        msg: 'esa factura con ese id no existe'
      }
    }
    return bill

  } catch (error) {
    console.log(error)
  }
}