import methodOfPaymentModel from "../model/methodOfPayment.js"

export const updateMethodOfPayment = async (id, { cash, transfer, creditCard, creditDebit }) => {
    try {
        const methodOfPayment = await methodOfPaymentModel.findByIdAndUpdate(id, { cash, transfer, creditCard, creditDebit }, { new: true })
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