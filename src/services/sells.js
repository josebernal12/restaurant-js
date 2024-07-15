import { searchByDatabase, searchByDate } from "../helpers/searchByDate.js";
import billModel from "../model/BillModel.js";
import inventaryModel from "../model/Inventary.js";
import productModel from "../model/ProductModel.js";
import userModel from "../model/UserModel.js";
import { subDays, subWeeks, subMonths, subYears } from 'date-fns';
import { startOfWeek, endOfWeek, startOfDay, endOfDay } from 'date-fns';
import moment2 from 'moment-timezone'

export const userSellByTable = async (id, name, date, companyId) => {
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
          const timeZone = 'America/Mazatlan';
          const startOfDayDate = moment2.tz(timeZone).startOf('day').toDate();
          const endOfDayDate = moment2.tz(timeZone).endOf('day').toDate();

          query = {
            createdAt: {
              $gte: startOfDayDate,
              $lt: endOfDayDate
            }
          };

          // Verificar si hay ventas para el día actual
          const bills = await billModel.find({ ...query, companyId }).populate('ticketId');
          if (bills.length === 0) {
            return 0; // No hay ventas para este día, devolver 0
          }
          break;
        default:
          break;
      }
    }
    const [bills, user] = await Promise.all([
      billModel.find({ ...query, companyId })
        .populate({
          path: 'ticketId',
          populate: [
            { path: 'waiterId', model: 'User' },
            { path: 'tableId', model: 'table' } // Asegúrate de que 'Table' es el modelo correcto
          ]
        })
        .populate('tableId')
        .populate('userId'),
      userModel.findById(id)
    ])

    const userTables = bills.filter(bill => {
      return bill.ticketId.some(value => value.waiterId._id.toString() === id);
    }).map(bill => bill.tableId);

    return {
      name: user.name,
      tables: userTables.length
    }
  } catch (error) {
    console.log(error)
  }
}


export const hourProduct = async (id, companyId) => {
  try {
    const [bills, product] = await Promise.all([
      billModel.find({ companyId }).populate('ticketId'),
      productModel.findById(id)
    ]);

    if (!bills || bills.length === 0) {
      return {
        product: [],
        message: 'No se encontraron facturas.'
      };
    }

    const now = new Date();

    const filterBillsByTime = (bills, timePeriod) => {
      return bills.filter(bill => bill.createdAt >= timePeriod);
    };

    const getHoursFromBills = (filteredBills) => {
      return filteredBills.flatMap(bill =>
        bill.ticketId.flatMap(ticket =>
          ticket.products.filter(product => product._id.toString() === id).map(() => bill.createdAt.getHours())
        )
      );
    };

    const calculateSalesByHour = (hours) => {
      return hours.reduce((acc, hour) => {
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {});
    };

    const getPeakHour = (salesByHour) => {
      return Object.keys(salesByHour).reduce((a, b) => salesByHour[a] > salesByHour[b] ? a : b, 0);
    };

    const timeFrames = {
      'lastDay': subDays(now, 1),
      'lastWeek': subWeeks(now, 1),
      'lastMonth': subMonths(now, 1),
      'lastYear': subYears(now, 1)
    };

    const result = {};

    for (const [key, timePeriod] of Object.entries(timeFrames)) {
      const filteredBills = filterBillsByTime(bills, timePeriod);
      const hours = getHoursFromBills(filteredBills);
      if (hours.length === 0) {
        result[key] = {
          peakHour: null,
          salesByHour: {}
        };
      } else {
        const salesByHour = calculateSalesByHour(hours);
        const peakHour = getPeakHour(salesByHour);
        result[key] = {
          peakHour: parseInt(peakHour),
          salesByHour
        };
      }
    }

    return {
      product: product.name,
      timeFrames: result
    };
  } catch (error) {
    console.error(error);
    return {
      product: [],
      message: 'Ocurrió un error al procesar las facturas.'
    };
  }
};

export const inventorySell = async (id, companyId) => {
  try {

    const { year, month, week, day } = searchByDate();

    const { valorAño, valorMes, valorSemana, valorDia, valorTodos, name } = await searchByDatabase(year, month, week, day, inventaryModel, id, companyId)

    let totalAño = 0;
    let totalMes = 0;
    let totalSemana = 0;
    let totalDia = 0;
    let totalStock = 0;
    valorAño.forEach(bill =>
      bill.ticketId.some(ticket => {
        ticket.products.some(value => {
          value.recipe.some(recipe => {
            if (recipe.id === id) {
              totalAño += recipe.stock;

            }
          });
        });
      })
    );
    valorMes.forEach(bill =>
      bill.ticketId.some(ticket => {
        ticket.products.some(value => {
          value.recipe.some(recipe => {
            if (recipe.id === id) {
              totalMes += recipe.stock;

            }
          });
        });
      })
    );
    valorSemana.forEach(bill =>
      bill.ticketId.some(ticket => {
        ticket.products.some(value => {
          value.recipe.some(recipe => {
            if (recipe.id === id) {
              totalSemana += recipe.stock;

            }
          });
        });
      })
    );
    valorDia.forEach(bill =>
      bill.ticketId.some(ticket => {
        ticket.products.some(value => {
          value.recipe.some(recipe => {
            if (recipe.id === id) {
              totalDia += recipe.stock;

            }
          });
        });
      })
    );
    valorTodos.forEach(bill =>
      bill.ticketId.some(ticket => {
        ticket.products.some(value => {
          value.recipe.some(recipe => {
            if (recipe.id === id) {
              totalStock += recipe.stock;

            }
          });
        });
      })
    );

    return {
      valorAño: totalAño,
      valorMes: totalMes,
      valorSemana: totalSemana,
      valorDia: totalDia,
      valorTodos: totalStock,
      name: name.name,
    }
  } catch (error) {
    console.log(error)
  }
}

export const billSell = async (companyId) => {
  try {
    const { year, month, week, day } = searchByDate();
    const { valorAño, valorMes, valorSemana, valorDia, valorTodos } = await searchByDatabase(year, month, week, day, null, null, companyId)
    let totalAño = valorAño.length;
    let totalMes = valorMes.length;
    let totalSemana = valorSemana.length;
    let totalDia = valorDia.length;
    let totalStock = valorTodos.length;

    return {
      totalAño,
      totalMes,
      totalSemana,
      totalDia,
      totalStock,
    }
  } catch (error) {
    console.log(error)
  }
}


export const productSellAll = async (companyId) => {
  try {
    const { year, month, week, day } = searchByDate();

    const [valorAño, valorMes, valorSemana, valorDia, valorTodos, products] = await Promise.all(
      [
        billModel.find({ ...year, companyId }).populate({
          path: 'ticketId',
          populate: {
            path: 'waiterId',
            model: 'User' // Asegúrate de que 'User' es el modelo correcto
          }
        }).populate('tableId').populate('userId'),

        billModel.find({ ...month, companyId }).populate({
          path: 'ticketId',
          populate: {
            path: 'waiterId',
            model: 'User' // Asegúrate de que 'User' es el modelo correcto
          }
        }).populate('tableId').populate('userId'),

        billModel.find({ ...week, companyId }).populate({
          path: 'ticketId',
          populate: {
            path: 'waiterId',
            model: 'User' // Asegúrate de que 'User' es el modelo correcto
          }
        }).populate('tableId').populate('userId'),

        billModel.find({ ...day, companyId }).populate({
          path: 'ticketId',
          populate: {
            path: 'waiterId',
            model: 'User' // Asegúrate de que 'User' es el modelo correcto
          }
        }).populate('tableId').populate('userId'),

        billModel.find({ companyId }).populate({
          path: 'ticketId',
          populate: {
            path: 'waiterId',
            model: 'User' // Asegúrate de que 'User' es el modelo correcto
          }
        }).populate('tableId').populate('userId'),
        productModel.find({ companyId })
      ]
    )
    let totalAño = 0;
    let totalMes = 0;
    let totalSemana = 0;
    let totalDia = 0;
    let totalStock = 0;
    valorAño.forEach(bill => {
      bill.ticketId.some(ticket => {
        ticket.products.some(product => {
          totalAño += product.stock
        })
      })
    })
    valorMes.forEach(bill => {
      bill.ticketId.some(ticket => {
        ticket.products.some(product => {
          totalMes += product.stock
        })
      })
    })
    valorSemana.forEach(bill => {
      bill.ticketId.some(ticket => {
        ticket.products.some(product => {
          totalSemana += product.stock
        })
      })
    })
    valorDia.forEach(bill => {
      bill.ticketId.some(ticket => {
        ticket.products.some(product => {
          totalDia += product.stock
        })
      })
    })
    valorTodos.forEach(bill => {
      bill.ticketId.some(ticket => {
        ticket.products.some(product => {
          totalStock += product.stock
        })
      })
    })
    return {
      totalAño,
      totalMes,
      totalSemana,
      totalDia,
      totalStock,
    }
  } catch (error) {
    console.log(error)
  }
}

export const billSellByQuery = async (date, companyId) => {
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
          const bills = await billModel.find({ ...query, companyId }).populate('ticketId');
          if (bills.length === 0) {
            return { bills: 0 }; // No hay ventas para este día, devolver 0
          }
          break;
        default:
          break;
      }
    }

    const bills = await billModel.find({ ...query, companyId }).populate({
      path: 'ticketId',
      populate: {
        path: 'waiterId',
        model: 'User' // Asegúrate de que 'User' es el modelo correcto
      }
    }).populate('tableId').populate('userId')

    return {
      bills: bills.length
    }
  } catch (error) {
    console.log(error)
  }
}


export const sellsCategory = async (categoryId) => {
  try {
    const bills = await billModel.find().populate('ticketId')
    bills.forEach(bill => {
      bill.ticketId.forEach(value => {
        console.log(value)
        value.products.forEach(product => {
          console.log(product)
          if (product.category === categoryId) {
            console.log(product)
          }
        })
      })
    })
  } catch (error) {
    console.log(error)
  }
}