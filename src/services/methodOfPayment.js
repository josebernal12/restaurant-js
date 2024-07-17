import methodOfPaymentModel from "../model/methodOfPayment.js"

export const updateMethodOfPayment = async (id,  cash, transfer, creditCard, creditDebit ) => {
    try {
        const methodOfPayment = await methodOfPaymentModel.findOne({ companyId: id })
       
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