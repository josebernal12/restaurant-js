import mongoose from "mongoose"
import billModel from "../model/BillModel.js"
import ticketModel from "../model/TIcketModel.js"
import tableModel from "../model/TableModel.js"
import productModel from "../model/ProductModel.js"
//TODO QUITAR EL PASSWORD EN USERSELL
//TODO REVISAR LO DE NOMBRE REPETIDOS PARA QUE TRAIGAN LOS 2
//TODO AGREGAR EL DE LA MESA ENTRE EL MIERCOLES O VIERNES
//TODO VE LO DEL HORARIO ENTRE EL MIERCOLES AL VIERNES
import moment from 'moment'; // Importa la librería moment.js para manejar fechas

export const generateBill = async (ticketId, tableId, userId, methodOfPayment) => {
  try {
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
      const newBill = await billModel.create({ ticketId: allTickets, tableId, userId, methodOfPayment });
      await tableModel.findByIdAndUpdate(tableId, { available: true }, { new: true });
      allTickets.forEach(async (ticket) => {
        await ticketModel.findByIdAndUpdate(ticket._id, { completed: true }, { new: true });
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


export const getBills = async (page, type, name, showAll, quantity, firstDate, secondDate, tableId) => {
  try {
    const perPage = 10;
    const pageQuery = parseInt(page) || 1;
    const skip = perPage * (pageQuery - 1);
    const currentDate = moment();

    let startDate, endDate;

    // Verifica si se debe mostrar todas las facturas
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

    // Establece las fechas de inicio y fin según los parámetros type, firstDate y secondDate
    if (type === 'week') {
      startDate = currentDate.clone().subtract(1, 'week').startOf('week');
      endDate = currentDate.clone().subtract(1, 'week').endOf('week');
    } else if (type === 'currentWeek') {
      startDate = currentDate.clone().startOf('week');
      endDate = currentDate.clone().endOf('week').subtract(1, 'day'); // Sábado de la semana actual
    } else if (firstDate && secondDate) {
      startDate = moment(firstDate).startOf('day');
      endDate = moment(secondDate).endOf('day');
    }

    let query = {};

    // Agrega las fechas a la consulta si están definidas
    if (startDate && endDate) {
      query.createdAt = {
        $gte: startDate.toDate(),
        $lte: endDate.toDate()
      };
    }

    // Realiza la búsqueda de facturas según la consulta definida
    let billsFiltered = await billModel.find(query)
      .populate({
        path: 'ticketId',
        populate: {
          path: 'waiterId',
          model: 'User' // el nombre del modelo relacionado
        }
      })
      .populate('tableId')
      .populate('userId');


    // Filtrar por cantidad si se proporciona
    if (quantity) {
      billsFiltered = billsFiltered.slice(0, quantity);
    }

    // Filtrar por ID de mesa si se proporciona
    if (tableId) {
      billsFiltered = billsFiltered.filter(bill => bill.tableId.number === Number(tableId));
    }

    // Filtrar por nombre de camarero si se proporciona
    if (name) {
      billsFiltered = billsFiltered.filter(bill =>
        bill.ticketId.some(ticket =>
          ticket.waiterId && ticket.waiterId.name.includes(name)
        )
      );
    }

    const totalBills = billsFiltered.length;

    // Paginar los resultados
    const paginatedBills = billsFiltered.slice(skip, skip + perPage);

    return {
      totalBills,
      billsFiltered: paginatedBills
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
    let bills = await billModel.find(query)
      .populate({
        path: 'ticketId',
        populate: {
          path: 'waiterId',
          model: 'User' // el nombre del modelo relacionado
        }
      })
      .populate('tableId')
      .populate('userId');

    // Objeto para almacenar el conteo de camareros
    const waiterCount = {};

    // Iterar sobre las facturas y contar los camareros
    bills.forEach(bill => {
      bill.ticketId.forEach(ticket => {
        const waiterName = ticket.waiterId?.name; // Accede al nombre del camarero

        if (waiterName) { // Asegúrate de que waiterName no sea undefined o null
          // Verificar si ya existe una entrada para este camarero en el objeto waiterCount
          if (waiterCount[waiterName]) {
            waiterCount[waiterName]++; // Incrementar el contador si ya existe
          } else {
            waiterCount[waiterName] = 1; // Inicializar el contador en 1 si es la primera vez que se encuentra este camarero
          }
        }
      });
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
import userModel from "../model/UserModel.js"

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
      bill.ticketId.forEach(value => {
        totalSales += value.total

      })
    });

    return { totalSales };
  } catch (error) {
    console.log(error);
    throw new Error('Error al calcular las ventas.');
  }
};

export const getBillLastWeek = async (type, page) => {
  const perPage = 10;
  const pageQuery = parseInt(page) || 1;
  const skip = perPage * (pageQuery - 1);
  let startDate, endDate;
  const currentDate = moment();

  try {
    if (type === 'week') {
      startDate = currentDate.clone().subtract(1, 'week').startOf('week');
      endDate = currentDate.clone().subtract(1, 'week').endOf('week');
    } else if (type === 'currentWeek') {
      startDate = currentDate.clone().startOf('week');
      endDate = currentDate.clone().endOf('week').subtract(1, 'day'); // Sábado de la semana actual
    }
    let query = {};

    if (startDate && endDate) {
      query.createdAt = {
        $gte: startDate.toDate(),
        $lte: endDate.toDate()
      };
    }
    // Realiza la búsqueda de facturas según la consulta definida
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
      };
    }

    return {
      totalBills,
      billsFiltered
    };
  } catch (error) {
    console.log(error)
  }
}


export const userSell = async (id, name, date) => {
  try {
    // let query = {}; // Inicializamos la consulta como vacía

    // if (date) {
    //   // Si se proporciona un tipo de consulta, construimos la consulta según el tipo
    //   switch (date) {
    //     case 'month':
    //       query = {
    //         // Filtrar por mes
    //         createdAt: {
    //           $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    //           $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
    //         }
    //       };
    //       break;
    //     case 'year':
    //       query = {
    //         // Filtrar por año
    //         createdAt: {
    //           $gte: new Date(new Date().getFullYear(), 0, 1),
    //           $lt: new Date(new Date().getFullYear() + 1, 0, 1)
    //         }
    //       };
    //       break;
    //     case 'week':
    //       // Filtrar por semana
    //       const startOfWeekDate = startOfWeek(new Date(), { weekStartsOn: 1 }); // Empieza la semana el lunes
    //       const endOfWeekDate = endOfWeek(new Date(), { weekStartsOn: 1 }); // Termina la semana el domingo

    //       query = {
    //         createdAt: {
    //           $gte: startOfWeekDate,
    //           $lt: endOfWeekDate
    //         }
    //       };
    //       break;
    //     case 'day':
    //       // Filtrar por día (hoy)
    //       const startOfDayDate = startOfDay(new Date());
    //       const endOfDayDate = endOfDay(new Date());
    //       query = {
    //         createdAt: {
    //           $gte: startOfDayDate,
    //           $lt: endOfDayDate
    //         }
    //       };

    //       // Verificar si hay ventas para el día actual
    //       const bills = await billModel.find(query).populate('ticketId');
    //       if (bills.length === 0) {
    //         return 0; // No hay ventas para este día, devolver 0
    //       }
    //       break;
    //     default:
    //       break;
    //   }
    // }
    const year = {
      // Filtrar por año
      createdAt: {
        $gte: new Date(new Date().getFullYear(), 0, 1),
        $lt: new Date(new Date().getFullYear() + 1, 0, 1)
      }
    };
    const month = {
      // Filtrar por mes
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
      }
    };
    const startOfWeekDate = startOfWeek(new Date(), { weekStartsOn: 1 }); // Empieza la semana el lunes
    const endOfWeekDate = endOfWeek(new Date(), { weekStartsOn: 1 }); // Termina la semana el domingo

    const week = {
      createdAt: {
        $gte: startOfWeekDate,
        $lt: endOfWeekDate
      }
    };
    const startOfDayDate = startOfDay(new Date());
    const endOfDayDate = endOfDay(new Date());
    const day = {
      createdAt: {
        $gte: startOfDayDate,
        $lt: endOfDayDate
      }
    };
    let [valorAño, valorMes, valorSemana, valorDia, valorTodos] = await Promise.all([
      billModel.find(year).populate({
        path: 'ticketId',
        populate: {
          path: 'waiterId',
          model: 'User' // Asegúrate de que 'User' es el modelo correcto
        }
      })
        .populate('tableId')
        .populate('userId'),
      billModel.find(month).populate({
        path: 'ticketId',
        populate: {
          path: 'waiterId',
          model: 'User' // Asegúrate de que 'User' es el modelo correcto
        }
      })
        .populate('tableId')
        .populate('userId'),
      billModel.find(week).populate({
        path: 'ticketId',
        populate: {
          path: 'waiterId',
          model: 'User' // Asegúrate de que 'User' es el modelo correcto
        }
      })
        .populate('tableId')
        .populate('userId'),
      billModel.find(day).populate({
        path: 'ticketId',
        populate: {
          path: 'waiterId',
          model: 'User' // Asegúrate de que 'User' es el modelo correcto
        }
      })
        .populate('tableId')
        .populate('userId'),
      billModel.find().populate({
        path: 'ticketId',
        populate: {
          path: 'waiterId',
          model: 'User' // Asegúrate de que 'User' es el modelo correcto
        }
      })
        .populate('tableId')
        .populate('userId'),

    ]);

    // let bills = await billModel.find(query)
    //   .populate({
    //     path: 'ticketId',
    //     populate: {
    //       path: 'waiterId',
    //       model: 'User' // Asegúrate de que 'User' es el modelo correcto
    //     }
    //   })
    //   .populate('tableId')
    //   .populate('userId');

    valorAño = valorAño.filter(bill =>
      bill.ticketId.some(ticket =>
        ticket.waiterId && ticket.waiterId._id.toString() === id)
    );
    valorMes = valorMes.filter(bill =>
      bill.ticketId.some(ticket =>
        ticket.waiterId && ticket.waiterId._id.toString() === id)
    );
    valorSemana = valorSemana.filter(bill =>
      bill.ticketId.some(ticket =>
        ticket.waiterId && ticket.waiterId._id.toString() === id)
    );
    valorDia = valorDia.filter(bill =>
      bill.ticketId.some(ticket =>
        ticket.waiterId && ticket.waiterId._id.toString() === id)
    );
    valorTodos = valorTodos.filter(bill =>
      bill.ticketId.some(ticket =>
        ticket.waiterId && ticket.waiterId._id.toString() === id)
    );
    return {
      valorAño: valorAño.length,
      valorMes: valorMes.length,
      valorSemana: valorSemana.length,
      valorDia: valorDia.length,
      valorTodos: valorTodos.length
    }
  } catch (error) {
    console.log(error)
  }
}


export const productSell = async (id, name, date) => {
  try {
    // let query = {}; // Inicializamos la consulta como vacía

    // if (date) {
    //   // Si se proporciona un tipo de consulta, construimos la consulta según el tipo
    //   switch (date) {
    //     case 'month':
    //       query = {
    //         // Filtrar por mes
    //         createdAt: {
    //           $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    //           $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
    //         }
    //       };
    //       break;
    //     case 'year':
    //       query = {
    //         // Filtrar por año
    //         createdAt: {
    //           $gte: new Date(new Date().getFullYear(), 0, 1),
    //           $lt: new Date(new Date().getFullYear() + 1, 0, 1)
    //         }
    //       };
    //       break;
    //     case 'week':
    //       // Filtrar por semana
    //       const startOfWeekDate = startOfWeek(new Date(), { weekStartsOn: 1 }); // Empieza la semana el lunes
    //       const endOfWeekDate = endOfWeek(new Date(), { weekStartsOn: 1 }); // Termina la semana el domingo

    //       query = {
    //         createdAt: {
    //           $gte: startOfWeekDate,
    //           $lt: endOfWeekDate
    //         }
    //       };
    //       break;
    //     case 'day':
    //       // Filtrar por día (hoy)
    //       const startOfDayDate = startOfDay(new Date());
    //       const endOfDayDate = endOfDay(new Date());
    //       query = {
    //         createdAt: {
    //           $gte: startOfDayDate,
    //           $lt: endOfDayDate
    //         }
    //       };

    //       // Verificar si hay ventas para el día actual
    //       const bills = await billModel.find(query).populate('ticketId');
    //       if (bills.length === 0) {
    //         return 0; // No hay ventas para este día, devolver 0
    //       }
    //       break;
    //     default:
    //       break;
    //   }
    // }
    const year = {
      // Filtrar por año
      createdAt: {
        $gte: new Date(new Date().getFullYear(), 0, 1),
        $lt: new Date(new Date().getFullYear() + 1, 0, 1)
      }
    };
    const month = {
      // Filtrar por mes
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
      }
    };
    const startOfWeekDate = startOfWeek(new Date(), { weekStartsOn: 1 }); // Empieza la semana el lunes
    const endOfWeekDate = endOfWeek(new Date(), { weekStartsOn: 1 }); // Termina la semana el domingo

    const week = {
      createdAt: {
        $gte: startOfWeekDate,
        $lt: endOfWeekDate
      }
    };
    const startOfDayDate = startOfDay(new Date());
    const endOfDayDate = endOfDay(new Date());
    const day = {
      createdAt: {
        $gte: startOfDayDate,
        $lt: endOfDayDate
      }
    };
    let [valorAño, valorMes, valorSemana, valorDia, valorTodos] = await Promise.all([
      billModel.find(year).populate({
        path: 'ticketId',
        populate: {
          path: 'waiterId',
          model: 'User' // Asegúrate de que 'User' es el modelo correcto
        }
      })
        .populate('tableId')
        .populate('userId'),
      billModel.find(month).populate({
        path: 'ticketId',
        populate: {
          path: 'waiterId',
          model: 'User' // Asegúrate de que 'User' es el modelo correcto
        }
      })
        .populate('tableId')
        .populate('userId'),
      billModel.find(week).populate({
        path: 'ticketId',
        populate: {
          path: 'waiterId',
          model: 'User' // Asegúrate de que 'User' es el modelo correcto
        }
      })
        .populate('tableId')
        .populate('userId'),
      billModel.find(day).populate({
        path: 'ticketId',
        populate: {
          path: 'waiterId',
          model: 'User' // Asegúrate de que 'User' es el modelo correcto
        }
      })
        .populate('tableId')
        .populate('userId'),
      billModel.find().populate({
        path: 'ticketId',
        populate: {
          path: 'waiterId',
          model: 'User' // Asegúrate de que 'User' es el modelo correcto
        }
      })
        .populate('tableId')
        .populate('userId'),

    ]);

    let totalAño = 0;
    let totalMes = 0;
    let totalSemana = 0;
    let totalDia = 0;
    let totalStock = 0;
    valorAño.forEach(bill => {
      bill.ticketId.forEach(ticket => {
        ticket.products.forEach(product => {
          if (product._id.toString() === id) {
            totalAño += product.stock;
          }
        });
      });
    });
    valorMes.forEach(bill => {
      bill.ticketId.forEach(ticket => {
        ticket.products.forEach(product => {
          if (product._id.toString() === id) {
            totalMes += product.stock;
          }
        });
      });
    });
    valorSemana.forEach(bill => {
      bill.ticketId.forEach(ticket => {
        ticket.products.forEach(product => {
          if (product._id.toString() === id) {
            totalSemana += product.stock;
          }
        });
      });
    });
    valorDia.forEach(bill => {
      bill.ticketId.forEach(ticket => {
        ticket.products.forEach(product => {
          if (product._id.toString() === id) {
            totalDia += product.stock;
          }
        });
      });
    });
    valorTodos.forEach(bill => {
      bill.ticketId.forEach(ticket => {
        ticket.products.forEach(product => {
          if (product._id.toString() === id) {
            totalStock += product.stock;
          }
        });
      });
    });

    return {
      valorAño: totalAño,
      valorMes: totalMes,
      valorSemana: totalSemana,
      valorDia: totalDia,
      valorTodos: totalStock
    }


   
  } catch (error) {
    console.log(error)
  }
}