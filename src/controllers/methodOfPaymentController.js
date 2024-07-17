import { 
    findMethodOfPaymentByCompany, 
    updateMethodOfPayment 
} from "../services/methodOfPayment.js"

export const updateMethodOfPaymentController = async (req, res) => {

    const { cash, transfer, creditCard, creditDebit } = req.body
   
    const methodOfPayment = await updateMethodOfPayment(req.user.companyId.toString(), cash, transfer, creditCard, creditDebit)
    if (methodOfPayment?.msg) {
        return res.status(400).json(methodOfPayment)
    }
    res.json(methodOfPayment)

}

export const findMethodOfPaymentByCompanyController = async (req, res) => {

    const methodOfPayment = await findMethodOfPaymentByCompany(req.user.companyId.toString())
    if (methodOfPayment?.msg) {
        return res.status(400).json(methodOfPayment)
    }
    res.json(methodOfPayment)
}