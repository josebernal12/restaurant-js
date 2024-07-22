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

export const totalSellCash = async (dateFilter, companyId) => {
    let cash = 0;

    try {
        const query = { companyId };

        if (dateFilter) {
            let startDate;
            let endDate;

            switch (dateFilter) {
                case 'day':
                    startDate = moment().utc().subtract(1, 'days').startOf('day').toDate();
                    endDate = moment().utc().subtract(1, 'days').endOf('day').toDate();
                    break;
                case 'week':
                    startDate = moment().utc().subtract(1, 'weeks').startOf('isoWeek').toDate();
                    endDate = moment().utc().subtract(1, 'weeks').endOf('isoWeek').toDate();
                    break;
                case 'month':
                    startDate = moment().utc().subtract(1, 'months').startOf('month').toDate();
                    endDate = moment().utc().subtract(1, 'months').endOf('month').toDate();
                    break;
                case 'year':
                    startDate = moment().utc().subtract(1, 'years').startOf('year').toDate();
                    endDate = moment().utc().subtract(1, 'years').endOf('year').toDate();
                    break;
                default:
                    throw new Error('Invalid date filter');
            }

            console.log(`Date Filter: ${dateFilter}`);
            console.log(`Start Date: ${startDate}`);
            console.log(`End Date: ${endDate}`);

            query.createdAt = { $gte: startDate, $lte: endDate };
        }

        const bills = await billModel.find(query).populate({
            path: 'ticketId',
            populate: {
                path: 'waiterId',
                model: 'User'
            }
        }).populate('tableId').populate('userId');

        bills.forEach(bill => {
            bill.methodOfPayment.forEach(method => {
                if (method.name === 'cash') {
                    cash += method.sell;
                }
            });
        });

        return cash;
    } catch (error) {
        console.log(error);
    }
};

export const totalSellTransfer = async (dateFilter, companyId) => {
    let transfer = 0;

    try {
        const query = { companyId };

        if (dateFilter) {
            let startDate;
            let endDate;

            switch (dateFilter) {
                case 'day':
                    startDate = moment().utc().subtract(1, 'days').startOf('day').toDate();
                    endDate = moment().utc().subtract(1, 'days').endOf('day').toDate();
                    break;
                case 'week':
                    startDate = moment().utc().subtract(1, 'weeks').startOf('isoWeek').toDate();
                    endDate = moment().utc().subtract(1, 'weeks').endOf('isoWeek').toDate();
                    break;
                case 'month':
                    startDate = moment().utc().subtract(1, 'months').startOf('month').toDate();
                    endDate = moment().utc().subtract(1, 'months').endOf('month').toDate();
                    break;
                case 'year':
                    startDate = moment().utc().subtract(1, 'years').startOf('year').toDate();
                    endDate = moment().utc().subtract(1, 'years').endOf('year').toDate();
                    break;
                default:
                    throw new Error('Invalid date filter');
            }

            console.log(`Date Filter: ${dateFilter}`);
            console.log(`Start Date: ${startDate}`);
            console.log(`End Date: ${endDate}`);

            query.createdAt = { $gte: startDate, $lte: endDate };
        }
        const bills = await billModel.find(query).populate({
            path: 'ticketId',
            populate: {
                path: 'waiterId',
                model: 'User'
            }
        }).populate('tableId').populate('userId');

        bills.forEach(bill => {
            bill.methodOfPayment.forEach(method => {
                if (method?.name === 'transfer') {
                    transfer += method.sell;
                }
            });
        });

        return transfer;
    } catch (error) {
        console.log(error);
    }
}

export const totalSellCreditCard = async (dateFilter, companyId) => {
    let creditCard = 0;

    try {
        const query = { companyId };

        if (dateFilter) {
            let startDate;
            let endDate;

            switch (dateFilter) {
                case 'day':
                    startDate = moment().utc().subtract(1, 'days').startOf('day').toDate();
                    endDate = moment().utc().subtract(1, 'days').endOf('day').toDate();
                    break;
                case 'week':
                    startDate = moment().utc().subtract(1, 'weeks').startOf('isoWeek').toDate();
                    endDate = moment().utc().subtract(1, 'weeks').endOf('isoWeek').toDate();
                    break;
                case 'month':
                    startDate = moment().utc().subtract(1, 'months').startOf('month').toDate();
                    endDate = moment().utc().subtract(1, 'months').endOf('month').toDate();
                    break;
                case 'year':
                    startDate = moment().utc().subtract(1, 'years').startOf('year').toDate();
                    endDate = moment().utc().subtract(1, 'years').endOf('year').toDate();
                    break;
                default:
                    throw new Error('Invalid date filter');
            }

            console.log(`Date Filter: ${dateFilter}`);
            console.log(`Start Date: ${startDate}`);
            console.log(`End Date: ${endDate}`);

            query.createdAt = { $gte: startDate, $lte: endDate };
        }
        const bills = await billModel.find(query).populate({
            path: 'ticketId',
            populate: {
                path: 'waiterId',
                model: 'User'
            }
        }).populate('tableId').populate('userId');

        bills.forEach(bill => {
            bill.methodOfPayment.forEach(method => {
                if (method.name === 'creditCard') {
                    creditCard += method.sell;
                }
            });
        });

        return creditCard;
    } catch (error) {
        console.log(error);
    }
}

export const totalSellCreditDebit = async (dateFilter, companyId) => {
    let creditDebit = 0;

    try {
        const query = { companyId };

        if (dateFilter) {
            let startDate;
            let endDate;

            switch (dateFilter) {
                case 'day':
                    startDate = moment().utc().subtract(1, 'days').startOf('day').toDate();
                    endDate = moment().utc().subtract(1, 'days').endOf('day').toDate();
                    break;
                case 'week':
                    startDate = moment().utc().subtract(1, 'weeks').startOf('isoWeek').toDate();
                    endDate = moment().utc().subtract(1, 'weeks').endOf('isoWeek').toDate();
                    break;
                case 'month':
                    startDate = moment().utc().subtract(1, 'months').startOf('month').toDate();
                    endDate = moment().utc().subtract(1, 'months').endOf('month').toDate();
                    break;
                case 'year':
                    startDate = moment().utc().subtract(1, 'years').startOf('year').toDate();
                    endDate = moment().utc().subtract(1, 'years').endOf('year').toDate();
                    break;
                default:
                    throw new Error('Invalid date filter');
            }

            console.log(`Date Filter: ${dateFilter}`);
            console.log(`Start Date: ${startDate}`);
            console.log(`End Date: ${endDate}`);

            query.createdAt = { $gte: startDate, $lte: endDate };
        }

        const bills = await billModel.find(query).populate({
            path: 'ticketId',
            populate: {
                path: 'waiterId',
                model: 'User'
            }
        }).populate('tableId').populate('userId');

        bills.forEach(bill => {
            bill.methodOfPayment.forEach(method => {
                if (method.name === 'creditDebit') {
                    creditDebit += method.sell;
                }
            });
        });

        return creditDebit;
    } catch (error) {
        console.log(error);
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
                    startDate = moment().utc().subtract(1, 'days').startOf('day').toDate();
                    endDate = moment().utc().subtract(1, 'days').endOf('day').toDate();
                    break;
                case 'week':
                    startDate = moment().utc().subtract(1, 'weeks').startOf('isoWeek').toDate();
                    endDate = moment().utc().subtract(1, 'weeks').endOf('isoWeek').toDate();
                    break;
                case 'month':
                    startDate = moment().utc().subtract(1, 'months').startOf('month').toDate();
                    endDate = moment().utc().subtract(1, 'months').endOf('month').toDate();
                    break;
                case 'year':
                    startDate = moment().utc().subtract(1, 'years').startOf('year').toDate();
                    endDate = moment().utc().subtract(1, 'years').endOf('year').toDate();
                    break;
                default:
                    throw new Error('Invalid date filter');
            }

            console.log(`Date Filter: ${dateFilter}`);
            console.log(`Start Date: ${startDate}`);
            console.log(`End Date: ${endDate}`);

            query.createdAt = { $gte: startDate, $lte: endDate };
        }

        const bills = await billModel.find(query).populate({
            path: 'ticketId',
            populate: {
                path: 'waiterId',
                model: 'User'
            }
        }).populate('tableId').populate('userId');

        bills.forEach(bill => {
            bill.methodOfPayment.forEach(method => {
                if (method.name === 'cash') {
                    cash++;
                }
                if (method.name === 'transfer') {
                    transfer++;
                }
                if (method.name === 'creditCard') {
                    creditCard++;
                }
                if (method.name === 'creditDebit') {
                    creditDebit++;
                }
            });
        });

        return { cash, transfer, creditCard, creditDebit };
    } catch (error) {
        console.log(error);
    }
};