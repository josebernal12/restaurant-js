import billModel from "../model/BillModel.js"
import methodOfPaymentModel from "../model/methodOfPayment.js"
import moment from 'moment';

export const updateMethodOfPayment = async (id, cash, transfer, creditCard, creditDebit) => {
    try {
        console.log(id)
        const methodOfPayment = await methodOfPaymentModel.findOne({ companyId: id })
        console.log(methodOfPayment)
        methodOfPayment.cash = cash
        methodOfPayment.transfer = transfer
        methodOfPayment.creditCard = creditCard
        methodOfPayment.creditDebit = creditDebit
        await methodOfPayment.save()
        if (!methodOfPayment) {
            return {
                msg: 'error updating method of payment'
            }
        }
        return methodOfPayment
    } catch (error) {
        console.log(error)
    }
}

export const findMethodOfPaymentByCompany = async (companyId) => {
    try {
        const methodOfPayment = await methodOfPaymentModel.findOne({ companyId })
        if (!methodOfPayment) {
            return {
                msg: 'error updating method of payment'
            }
        }
        return methodOfPayment
    } catch (error) {
        console.log(error)
    }
}


export const totalSellCash = async (date, companyId) => {
    try {
        const bills = await billModel.find({ companyId }).populate({
            path: 'ticketId',
            populate: {
                path: 'waiterId',
                model: 'User'
            }
        }).populate('tableId').populate('userId');
        bills.forEach(bill => {
            bill.ticketId.forEach(ticket => {
                console.log(ticket)
            })
        })
    } catch (error) {
        console.log(error)
    }
}

export const totalSellTransfer = async (date, companyId) => {
    try {

    } catch (error) {
        console.log(error)
    }
}

export const totalSellCreditCard = async (date, companyId) => {
    try {

    } catch (error) {
        console.log(error)
    }
}

export const totalSellCreditDebit = async (date, companyId) => {
    try {

    } catch (error) {
        console.log(error)
    }
}


export const quantitySellMethodOfPayment = async (dateFilter, companyId) => {
    let cash = 0;
    let transfer = 0;
    let creditCard = 0;
    let creditDebit = 0;

    try {
        const query = { companyId };
        
        if (dateFilter) {
            let startDate;
            let endDate;

            switch (dateFilter) {
                case 'day':
                    startDate = moment().startOf('day').toDate();
                    endDate = moment().endOf('day').toDate();
                    break;
                case 'week':
                    startDate = moment().startOf('isoWeek').toDate();
                    endDate = moment().endOf('isoWeek').toDate();
                    break;
                case 'month':
                    startDate = moment().startOf('month').toDate();
                    endDate = moment().endOf('month').toDate();
                    break;
                case 'year':
                    startDate = moment().startOf('year').toDate();
                    endDate = moment().endOf('year').toDate();
                    break;
                default:
                    throw new Error('Invalid date filter');
            }

            query.createdAt = { $gte: startDate, $lte: endDate };
        }

        const bills = await billModel.find(query).populate({
            path: 'ticketId',
            populate: {
                path: 'waiterId',
                model: 'User' // Asegúrate de que 'User' es el modelo correcto
            }
        }).populate('tableId').populate('userId');

        bills.forEach(bill => {
            bill.methodOfPayment.forEach(method => {
                switch (method.name) {
                    case 'cash':
                        cash++;
                        break;
                    case 'transfer':
                        transfer++;
                        break;
                    case 'creditCard':
                        creditCard++;
                        break;
                    case 'creditDebit':
                        creditDebit++;
                        break;
                }
            });
        });
        
        return { cash, transfer, creditCard, creditDebit };
    } catch (error) {
        console.log(error);
    }
};