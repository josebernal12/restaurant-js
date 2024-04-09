import mongoose from "mongoose"
import billModel from "../model/BillModel.js"
import ticketModel from "../model/TIcketModel.js"
import tableModel from "../model/TableModel.js"
import productModel from "../model/ProductModel.js"
import moment from 'moment'; // Importa la librería moment.js para manejar fechas

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
      await ticketModel.findByIdAndUpdate(ticketId, { completed: true, tableId: null }, { new: true });

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

export const getBills = async (page, type, name, showAll, quantity) => {
  try {
    const perPage = 10;
    const pageQuery = parseInt(page) || 1;
    const skip = perPage * (pageQuery - 1);
    const currentDate = moment();

    let startDate, endDate;

    if (type === 'week') {
      startDate = currentDate.clone().subtract(1, 'week').startOf('week');
      endDate = currentDate.clone().subtract(1, 'week').endOf('week');
    }

    let query = {};

    if (startDate && endDate) {
      query.createdAt = {
        $gte: startDate.toDate(),
        $lte: endDate.toDate()
      };
    }

    if (name) {
      query['userId.name'] = { $regex: new RegExp(name, 'i') };
    }

    let billsFiltered = await billModel.find(query)
      .populate('ticketId')
      .populate('tableId')
      .populate('userId')
      .limit(perPage)
      .skip(skip)
      .sort({ createdAt: -1 });

    const totalBills = await billModel.countDocuments(query);

    return {
      totalBills,
      billsFiltered
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};







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