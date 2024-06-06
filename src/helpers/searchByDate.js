import { startOfWeek, endOfWeek, startOfDay, endOfDay } from 'date-fns';
import moment2 from 'moment-timezone'
import billModel from '../model/BillModel.js';

export const searchByDate = () => {
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
    const timeZone = 'America/Mazatlan';
    const startOfDayDate = moment2.tz(timeZone).startOf('day').toDate();
    const endOfDayDate = moment2.tz(timeZone).endOf('day').toDate();

    const day = {
        createdAt: {
            $gte: startOfDayDate,
            $lt: endOfDayDate
        }
    };
    return {
        year,
        month,
        week,
        day
    }
}


export const searchByDatabase = async (year, month, week, day, database, id) => {
  const billQueries = [
    billModel.find(year).populate({
      path: 'ticketId',
      populate: {
        path: 'waiterId',
        model: 'User' // Asegúrate de que 'User' es el modelo correcto
      }
    }).populate('tableId').populate('userId'),
    
    billModel.find(month).populate({
      path: 'ticketId',
      populate: {
        path: 'waiterId',
        model: 'User' // Asegúrate de que 'User' es el modelo correcto
      }
    }).populate('tableId').populate('userId'),
    
    billModel.find(week).populate({
      path: 'ticketId',
      populate: {
        path: 'waiterId',
        model: 'User' // Asegúrate de que 'User' es el modelo correcto
      }
    }).populate('tableId').populate('userId'),
    
    billModel.find(day).populate({
      path: 'ticketId',
      populate: {
        path: 'waiterId',
        model: 'User' // Asegúrate de que 'User' es el modelo correcto
      }
    }).populate('tableId').populate('userId'),
    
    billModel.find().populate({
      path: 'ticketId',
      populate: {
        path: 'waiterId',
        model: 'User' // Asegúrate de que 'User' es el modelo correcto
      }
    }).populate('tableId').populate('userId')
  ];

  if (database) {
    billQueries.push(database.findById(id));
  }

  const results = await Promise.all(billQueries);

  return {
    valorAño: results[0],
    valorMes: results[1],
    valorSemana: results[2],
    valorDia: results[3],
    valorTodos: results[4],
    name: database ? results[5] : null
  };
};
