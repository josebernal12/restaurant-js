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

export const getBills = async (page, type, name, showAll) => {
  try {
    const perPage = 10;
    const pageQuery = parseInt(page) || 1;
    const skip = perPage * (pageQuery - 1);
    const totalBills = await billModel.countDocuments();
    console.log("Total de facturas en la base de datos:", totalBills);

    // Obtener la fecha actual
    const currentDate = moment();

    console.log("Fecha actual:", currentDate.format());

    let billsFiltered;
    if (showAll === "1") {
      billsFiltered = await billModel.find()
        .populate('ticketId')
        .populate('tableId')
        .populate('userId')
        .sort({ createdAt: -1 });

      return {
        totalBills,
        billsFiltered
      }
    }
    if (type === 'day') {
      // Filtrar las facturas creadas hace un día
      const oneDayAgo = currentDate.clone().subtract(1, 'day');
      console.log("Filtrando facturas creadas hace un día:", oneDayAgo.format());
      billsFiltered = await billModel.find({ createdAt: { $gte: oneDayAgo.toDate() } })
        .populate('ticketId')
        .populate('tableId')
        .limit(10)
        .skip(skip)
        .sort({ createdAt: -1 });
    } else if (type === 'week') {
      // Filtrar las facturas creadas hace una semana
      const oneWeekAgo = currentDate.clone().subtract(1, 'week');
      console.log("Filtrando facturas creadas hace una semana:", oneWeekAgo.format());
      billsFiltered = await billModel.find({ createdAt: { $gte: oneWeekAgo.toDate(), $lt: currentDate.toDate() } })
        .populate('ticketId')
        .populate('tableId')
        .limit(10)
        .skip(skip)
        .sort({ createdAt: -1 });
    } else if (type === 'year') {
      // Filtrar las facturas creadas hace un año
      const oneYearAgo = currentDate.clone().subtract(1, 'year');
      console.log("Filtrando facturas creadas hace un año:", oneYearAgo.format());
      billsFiltered = await billModel.find({ createdAt: { $gte: oneYearAgo.toDate(), $lt: currentDate.toDate() } })
        .populate('ticketId')
        .populate('tableId')
        .limit(10)
        .skip(skip)
        .sort({ createdAt: -1 });
    } else {
      // No se proporcionó un tipo de filtro válido, devolver todas las facturas sin filtrar por fecha
      console.log("No se proporcionó un tipo de filtro válido. Obteniendo todas las facturas.");
      billsFiltered = await billModel.find()
        .populate('ticketId')
        .populate('tableId')
        .populate('userId')
        .limit(10)
        .skip(skip)
        .sort({ createdAt: -1 });
    }
    const search = billsFiltered.filter(value => value.userId.name.includes(name))
    if (!name) {
      return {
        totalBills,
        billsFiltered
      }
    }
    return {
      totalBills,
      billsFiltered: search,
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