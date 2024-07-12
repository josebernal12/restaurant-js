import {
    createSupplier,
    deleteSupplier,
    getSupplierById,
    getSuppliers,
    updateSupplier
} from "../services/suppliers.js"

export const createSupplierController = async (req, res) => {
    const { name, address, phone, email } = req.body

    const supplier = await createSupplier(name, address, phone, email)
    if (supplier?.msg) {
        return res.status(400).json(supplier)
    }
    res.json(supplier)
}

export const getSupplierByIdController = async (req, res) => {
    const { id } = req.params

    const supplier = await getSupplierById(id)
    if (supplier?.msg) {
        return res.status(400).json(supplier)
    }
    res.json(supplier)
}

export const updateSupplierController = async (req, res) => {
    const { id } = req.params
    const { name, address, phone } = req.body

    const supplier = await updateSupplier(id, name, address, phone)
    if (supplier?.msg) {
        return res.status(400).json(supplier)
    }
    res.json(supplier)
}

export const deleteSupplierController = async (req, res) => {
    const { id } = req.params

    const supplier = await deleteSupplier(id)
    if (supplier?.msg) {
        return res.status(400).json(supplier)
    }
    res.json(supplier)
}

export const getSuppliersController = async (req, res) => {
    let query = {};
    const { name, phone, address, email } = req.query;


    if (name) {
        query.name = { $regex: name, $options: 'i' }; // Búsqueda parcial y case insensitive
    }
    if (phone) {
        query.phone = { $regex: phone, $options: 'i' };
    }
    if (address) {
        query.address = { $regex: address, $options: 'i' };
    }
    if (email) {
        query.email = { $regex: email, $options: 'i' };
    }


    const showAll = req.query.showAll
    const quantity = req.query.quantity
    const supplier = await getSuppliers(query, showAll, quantity)

    if (supplier?.msg) {
        return res.status(400).json(supplier)
    }
    res.json(supplier)
}