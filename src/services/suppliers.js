import supplierModel from "../model/Suppliers.js"

export const createSupplier = async (name, address, phone, email, companyId) => {
    try {
        if (!name) {
            return {
                msg: 'error, name is required'
            }
        }
        const supplier = await supplierModel.create({ name, address, phone, email, companyId })
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


export const updateSupplier = async (id, name, address, phone, companyId) => {
    try {
        const supplier = await supplierModel.findByIdAndUpdate(id, { name, address, phone, companyId }, { new: true })
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

export const getSuppliers = async (query, showAll, quantity, page, companyId, sortName, sortEmail) => {
    const perPage = 10;
    const pageQuery = parseInt(page) || 1;
    const skip = perPage * (pageQuery - 1);
    let sortOptions = {};
    if (sortName) {
        sortOptions.name = sortName === 'asc' ? 1 : -1; // 1 para ascendente, -1 para descendente
    }
    if (sortEmail) {
        sortOptions.email = sortEmail === 'asc' ? 1 : -1; // 1 para ascendente, -1 para descendente
    }
    try {
        let suppliers;
        let totalSuppliers
        if (showAll === 'true') {
            suppliers = await supplierModel.find({ companyId }).sort(sortOptions);
            totalSuppliers = await supplierModel.countDocuments({ companyId })
        } else {
            suppliers = await supplierModel.find({ ...query, companyId }).limit(quantity).skip(skip).sort(sortOptions);
            totalSuppliers = await supplierModel.countDocuments({ companyId })
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
    try {
        const supplierPromises = suppliers.map((supplier) => supplierModel.create(supplier));
        const supplierArray = await Promise.all(supplierPromises);
        const suppliersTotal = await supplierModel.countDocuments();
        return { supplierArray, suppliersTotal };
    } catch (error) {
        console.log(error);
    }
};


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