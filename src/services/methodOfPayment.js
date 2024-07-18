import methodOfPaymentModel from "../model/methodOfPayment.js"

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


export const totalSellCash = async () => {
    try {

    } catch (error) {
        console.log(error)
    }
}

export const totalSellTransfer = async () => {
    try {

    } catch (error) {
        console.log(error)
    }
}

export const totalSellCreditCard = async () => {
    try {

    } catch (error) {
        console.log(error)
    }
}

export const totalSellCreditDebit = async () => {
    try {

    } catch (error) {
        console.log(error)
    }
}