import supplierModel from "../model/Suppliers.js"

export const createSupplier = async (name, address, phone) => {
    try {
        if (!name) {
            return {
                msg: 'error, name is required'
            }
        }
        const supplier = await supplierModel.create({ name, address, phone })
        if (!supplier) {
            return {
                msg: 'error creating supplier'
            }
        }
        return supplier
    } catch (error) {
        console.log(error)
    }
}

export const getSupplierById = async (id) => {
    try {
        const supplier = await supplierModel.findById(id)
        if (!supplier) {
            return {
                msg: 'error finding a supplier'
            }
        }
        return supplier
    } catch (error) {
        console.log(error)
    }
}


export const updateSupplier = async (id, name, address, phone) => {
    try {
        const supplier = await supplierModel.findByIdAndUpdate(id, { name, address, phone }, { new: true })
        if (!supplier) {
            return {
                msg: 'error updating supplier'
            }
        }
        return supplier
    } catch (error) {
        console.log(error)
    }
}

export const deleteSupplier = async (id) => {
    try {
        const supplier = await supplierModel.findByIdAndDelete(id, { new: true })
        if (!supplier) {
            return {
                msg: 'error deleting supplier'
            }
        }
        return supplier
    } catch (error) {
        console.log(error)
    }
}

export const getSuppliers = async (name, phone, address) => {
    try {
        const supplier = await supplierModel.find()
        if (!supplier) {
            return {
                msg: 'error finding supplier'
            }
        }
        return supplier
    } catch (error) {
        console.log(error)
    }
}