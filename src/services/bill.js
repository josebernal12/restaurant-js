import mongoose from "mongoose"
import billModel from "../model/BillModel.js"
import ticketModel from "../model/TIcketModel.js"
import tableModel from "../model/TableModel.js"
import productModel from "../model/ProductModel.js"
//TODO ARREGLAR QUE CUANDO TENGO 2 PRODUCTOS EN EL TICKET FALLA POR QUE HAY 2 IDS. PRODUCTS SI ME TRAE LOS 2
export const generateBill = async (ticketId, tableId, userId) => {
  try {

    if (!ticketId || !tableId) {
      return 'error al generar facturas (te falta datos por proporcionar)'
    }
    const tableObjectId = mongoose.Types.ObjectId(tableId);

    const table = await tableModel.findById(tableObjectId);
    if (!table) {
      return {
        msg: 'la mesa con ese id no existe'
      }
    }
    const ticket = await ticketModel.findById(ticketId)
    if (ticket.tableId.toString() === tableId) {
      const newBill = await billModel.create({ ticketId, tableId, userId });
      await tableModel.findByIdAndUpdate(tableId, { available: true }, { new: true });
      const ticketUpdate = await ticketModel.findByIdAndUpdate(ticketId, { completed: true, tableId: null }, { new: true });
      for (const product of ticketUpdate.products) {
        await productModel.findByIdAndUpdate(product._id, { $inc: { stock: -product.stock } });
      }
      if (!newBill) {
        return 'error al generar la factura'
      }
      return newBill
    }
    return {
      msg: 'el ticket no coincide con la mesa'
    }

  } catch (error) {
    console.log(error)
  }
}

export const getBills = async (page) => {
  try {
    const perPage = 10;
    const pageQuery = parseInt(page) || 1;
    const skip = perPage * (pageQuery - 1);
    const totalBills = await billModel.countDocuments()
    const bill = await billModel.find().populate('ticketId').populate('tableId').limit(10).skip(skip)
    if (!bill) {
      return 'no hay facturas'
    }
    return {
      totalBills,
      bill
    }
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