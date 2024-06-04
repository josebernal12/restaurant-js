import billModel from "../model/BillModel.js";

export const userSellByTable = async (id, name, date) => {
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
        let bills = await billModel.find(query)
            .populate({
                path: 'ticketId',
                populate: [
                    { path: 'waiterId', model: 'User' },
                    { path: 'tableId', model: 'table' } // Asegúrate de que 'Table' es el modelo correcto
                ]
            })
            .populate('tableId')
            .populate('userId');

            const userTables = bills.filter(bill => {
                return bill.ticketId.some(value => value.waiterId._id.toString() === id);
            }).map(bill => bill.tableId);
            
        return userTables.length 
    } catch (error) {
        console.log(error)
    }
}