import mongoose from "mongoose"
import billModel from "../model/BillModel.js"
import ticketModel from "../model/TIcketModel.js"
import tableModel from "../model/TableModel.js"
import productModel from "../model/ProductModel.js"
import moment from 'moment'; // Importa la librería moment.js para manejar fechas

export const generateBill = async (ticketId, tableId, userId) => {
  try {
    console.log(tableId)
    if (!tableId) {
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
    const allTickets = await ticketModel.find({ tableId })
   
    if (allTickets.some(ticket => ticket.tableId.toString() === tableId)) {
      const newBill = await billModel.create({ ticketId: allTickets, tableId, userId });
      await tableModel.findByIdAndUpdate(tableId, { available: true }, { new: true });
      allTickets.forEach(async (ticket) => {
        await ticketModel.findByIdAndUpdate(ticket._id, { completed: true, tableId: null }, { new: true });
      })
      if (!newBill) {
        return {
          msg: 'error al generar la factura'
        }
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
    if (showAll === "1") {
      let billsFiltered = await billModel.find()
        .populate('ticketId')
        .populate('tableId')
        .populate('userId')
        .sort({ createdAt: -1 });

      const totalBills = await billModel.countDocuments();

      return {
        totalBills,
        billsFiltered
      };
    }
    if (type === 'week') {
      startDate = currentDate.clone().subtract(1, 'week').startOf('week');
      endDate = currentDate.clone().subtract(1, 'week').endOf('week');
    } else if (type === 'currentWeek') {
      startDate = currentDate.clone().startOf('week');
      endDate = currentDate.clone().endOf('week').subtract(1, 'day'); // Saturday of current week
    }

    let query = {};

    if (startDate && endDate) {
      query.createdAt = {
        $gte: startDate.toDate(),
        $lte: endDate.toDate()
      };
    }

    if (name) {
      query['waiter'] = { $regex: new RegExp(name, 'i') };
      console.log(query)
    }

    let billsFiltered = await billModel.find(query)
      .populate('ticketId')
      .populate('tableId')
      .populate('userId')
      .limit(perPage)
      .skip(skip)
      .sort({ createdAt: -1 });

    const totalBills = await billModel.countDocuments(query);
    if (!billsFiltered) {
      return {
        billsFiltered: []
      }
    }
    return {
      totalBills,
      billsFiltered
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const bestWaiter = async (type) => {
  try {
    let startDate, endDate;

    // Determinar las fechas de inicio y fin según el tipo de consulta o si no se proporciona ningún tipo
    switch (type) {
      case 'week':
        const today = new Date();
        const dayOfWeek = today.getDay();
        const firstDayOfWeek = new Date(today);
        firstDayOfWeek.setDate(today.getDate() - dayOfWeek);
        startDate = new Date(firstDayOfWeek);
        endDate = new Date(firstDayOfWeek);
        endDate.setDate(endDate.getDate() + 6); // Fin de la semana
        break;
      case 'month':
        const currentDate = new Date();
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // Primer día del mes actual
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // Último día del mes actual
        break;
      case 'quarter':
        const currentQuarter = Math.floor((new Date().getMonth() + 3) / 3); // Determinar el trimestre actual
        startDate = new Date(new Date().getFullYear(), 3 * currentQuarter - 3, 1); // Primer día del trimestre actual
        endDate = new Date(new Date().getFullYear(), 3 * currentQuarter, 0); // Último día del trimestre actual
        break;
      case 'year':
        startDate = new Date(new Date().getFullYear(), 0, 1); // Primer día del año actual
        endDate = new Date(new Date().getFullYear(), 11, 31); // Último día del año actual
        break;
      default:
        // Si no se proporciona un tipo, no establecer fechas de inicio y fin para obtener todas las facturas
        startDate = null;
        endDate = null;
    }

    // Construir la consulta basada en las fechas si se proporciona un tipo válido
    const query = startDate && endDate ? {
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    } : {};

    const bills = await billModel.find(query)
      .populate('ticketId')
      .populate('userId')
      .populate('tableId');

    // Objeto para almacenar el conteo de camareros
    const waiterCount = {};

    // Iterar sobre las facturas y contar los camareros
    bills.forEach(bill => {
      const waiterName = bill.ticketId.waiter;

      // Verificar si ya existe una entrada para este camarero en el objeto waiterCount
      if (waiterCount[waiterName]) {
        waiterCount[waiterName]++; // Incrementar el contador si ya existe
      } else {
        waiterCount[waiterName] = 1; // Inicializar el contador en 1 si es la primera vez que se encuentra este camarero
      }
    });
    const waiterArray = Object.keys(waiterCount).map(waiterName => {
      return { name: waiterName, sell: waiterCount[waiterName] };
    });

    return waiterArray;
  } catch (error) {
    console.log(error);
    throw new Error('Ocurrió un error al obtener las facturas');
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

import { startOfWeek, endOfWeek, startOfDay, endOfDay } from 'date-fns';

export const sells = async (date) => {
  try {
    let query = {}; // Inicializamos la consulta como vacía

    if (date) {
      // Si se proporciona un tipo de consulta, construimos la consulta según el tipo
      switch (date) {
        case 'month':
          query = {
            // Filtrar por mes
            createdAt: {
              $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
              $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
            }
          };
          break;
        case 'year':
          query = {
            // Filtrar por año
            createdAt: {
              $gte: new Date(new Date().getFullYear(), 0, 1),
              $lt: new Date(new Date().getFullYear() + 1, 0, 1)
            }
          };
          break;
        case 'week':
          // Filtrar por semana
          const startOfWeekDate = startOfWeek(new Date(), { weekStartsOn: 1 }); // Empieza la semana el lunes
          const endOfWeekDate = endOfWeek(new Date(), { weekStartsOn: 1 }); // Termina la semana el domingo

          query = {
            createdAt: {
              $gte: startOfWeekDate,
              $lt: endOfWeekDate
            }
          };
          break;
        case 'day':
          // Filtrar por día (hoy)
          const startOfDayDate = startOfDay(new Date());
          const endOfDayDate = endOfDay(new Date());

          query = {
            createdAt: {
              $gte: startOfDayDate,
              $lt: endOfDayDate
            }
          };

          // Verificar si hay ventas para el día actual
          const bills = await billModel.find(query).populate('ticketId');
          if (bills.length === 0) {
            return 0; // No hay ventas para este día, devolver 0
          }
          break;
        default:
          break;
      }
    }

    const bills = await billModel.find(query).populate('ticketId');

    let totalSales = 0;
    bills.forEach(bill => {
      totalSales += bill.ticketId.total;
    });

    return totalSales;
  } catch (error) {
    console.log(error);
    throw new Error('Error al calcular las ventas.');
  }
};
