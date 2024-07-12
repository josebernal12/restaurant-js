import supplierModel from "../model/Suppliers.js"

export const createSupplier = async (name, address, phone, email) => {
    try {
        if (!name) {
            return {
                msg: 'error, name is required'
            }
        }
        const supplier = await supplierModel.create({ name, address, phone, email })
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

export const getSuppliers = async (query, showAll, quantity, page) => {
    const perPage = 10;
    const pageQuery = parseInt(page) || 1;
    const skip = perPage * (pageQuery - 1);
    try {
        let suppliers;
        let totalSuppliers
        if (showAll === 'true') {
            suppliers = await supplierModel.find();
            totalSuppliers = await supplierModel.countDocuments()
        } else {
            suppliers = await supplierModel.find(query).limit(quantity).skip(skip);
            totalSuppliers = await supplierModel.countDocuments()
        }

        if (!suppliers.length) {
            return {
                suppliers: []
            };
        }

        return { suppliers, totalSuppliers };
    } catch (error) {
        console.log(error);
        return {
            msg: 'Error finding suppliers',
            error: error.message
        };
    }
}

export const createMultipleSuppliers = async (suppliers) => {
    let supplierArray = []
    try {
        suppliers.forEach(async (supplier) => {
            const newSuppliers = await supplierModel.create(supplier)
            supplierArray.push(newSuppliers)
        })
        const suppliersTotal = await supplierModel.countDocuments()
        return { supplierArray, suppliersTotal }
    } catch (error) {
        console.log(error)
    }
}

export const deleteMultipleSuppliers = async (ids) => {
    try {
        ids.forEach(async (id) => {
            await supplierModel.findByIdAndDelete(id, { new: true })
        })
        const totalSupplier = await supplierModel.countDocuments()

        return { totalSupplier }
    } catch (error) {
        console.log(error)
    }
}