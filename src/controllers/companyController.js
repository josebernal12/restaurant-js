import {
    createCompany,
    findCompanyById,
    updateCompany
} from "../services/company.js"


export const createCompanyController = async (req, res) => {
    const { name } = req.body
    const company = await createCompany(name)
    if (company?.msg) {
        return res.status(400).json(company)
    }
    res.json(company)
}

export const updateCompanyController = async (req, res) => {
    const { id } = req.params
    const { name } = req.body

    const company = await updateCompany(id, name)

    if (company?.msg) {
        return res.status(400).json(company)
    }
    res.json(company)
}

export const findCompanyByIdController = async (req, res) => {
    const { id } = req.params
    const company = await findCompanyById(id)
    if (company?.msg) {
        return res.status(400).json(company)
    }
    res.json(company)
}