import billModel from "../model/BillModel.js"

export const generateBill = async (products, ticketId, tableId, userId) => {
  try {

    if (!ticketId || !tableId || !userId) {
      return 'error al generar facturas (te falta datos por proporcionar)'
    }
    const newBill = await billModel.create({ products, ticketId, tableId, userId })
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
    const bill = await billModel.find()
    if (!bill) {
      return 'no hay facturas'
    }
    return bill
  } catch (error) {
    console.log(error)
  }
}