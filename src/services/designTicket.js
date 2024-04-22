import designModel from "../model/DesignTicket.js"

export const designTicket = async (name, email, logo, address, phone) => {
    try {
        const billModified = await designModel.create({ name, email, logo, address, phone })
        if (!billModified) {
            return {
                msg: 'error al modificar la factura'
            }
        }
        return billModified
    } catch (error) {
        console.log(error)
    }
}

export const getDesignTicket = async () => {
    try {
        const bill = await designModel.find()
        if(!bill) {
            return {
                design : []
            }
        }
        return bill
    } catch (error) {
        console.log(error)
    }
}