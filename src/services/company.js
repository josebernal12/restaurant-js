import companyModel from "../model/CompanyModel.js"
import userModel from "../model/UserModel.js"

export const createCompany = async (name, userId) => {
    try {
        const user = await userModel.findById(userId)

        if (!user) {
            return {
                msg: 'user id no existing'
            }
        }

        const company = await companyModel.create({ name })
        if (!company) {
            return {
                msg: 'error creating company'
            }
        }
        user.haveCompany = true
        await user.save()
        return company
    } catch (error) {
        console.log(error)
    }
}


export const updateCompany = async (id, name) => {
    try {
        const company = await companyModel.findByIdAndUpdate(id, { name }, { new: true })
        if (!company) {
            return {
                msg: 'error updating company'
            }
        }
        return company
    } catch (error) {
        console.log(error)
    }
}

export const findCompanyById = async (id) => {
    try {
        const company = await companyModel.findById(id)
        if (!company) {
            return {
                msg: 'error getting company'
            }
        }
        return company
    } catch (error) {
        console.log(error)
    }
}