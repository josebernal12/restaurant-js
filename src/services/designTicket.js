import designModel from "../model/DesignTicket.js"

export const designTicket = async (name, email, logo, address, phone, measures) => {
    try {
        // Eliminar el diseño anterior si existe
        await designModel.deleteMany();

        // Crear el nuevo diseño
        const billModified = await designModel.create({ name, email, logo, address, phone });

        if (!billModified) {
            return {
                msg: 'error al modificar la factura'
            };
        }
        return billModified;
    } catch (error) {
        console.log(error);
        return {
            msg: 'error al modificar la factura'
        };
    }
};


export const getDesignTicket = async () => {
    try {
        const bill = await designModel.find()
        if (!bill) {
            return {
                design: []
            }
        }
        return bill[0]
    } catch (error) {
        console.log(error)
    }
}