import {
    createSupplier,
    deleteSupplier,
    getSupplierById,
    getSuppliers,
    updateSupplier
} from "../services/suppliers.js"

export const createSupplierController = async (req, res) => {
    const { name, address, phone } = req.body
    const supplier = await createSupplier(name, address, phone)
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
    const supplier = await getSuppliers()

    if (supplier?.msg) {
        return res.status(400).json(supplier)
    }
    res.json(supplier)
}