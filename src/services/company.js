import companyModel from "../model/CompanyModel.js"
import methodOfPaymentModel from "../model/methodOfPayment.js"
import RolModel from "../model/RolModel.js"
import userModel from "../model/UserModel.js"

export const createCompany = async (name, email, address, phone, country, userId) => {
    try {
        console.log(userId)
        const user = await userModel.findById(userId)

        if (!user) {
            return {
                msg: 'user id no existing'
            }
        }

        const company = await companyModel.create({ name, email, address, phone, country })
        if (!company) {
            return {
                msg: 'error creating company'
            }
        }
        user.haveCompany = true
        user.companyId = company._id
        const rol = await RolModel.find({ userId: user._id })

        await user.save()
        await methodOfPaymentModel.create({ companyId: company._id })
        rol.forEach(async (value) => {
            value.companyId = company._id
            await value.save()
        })
        return company
    } catch (error) {
        console.log(error)
    }
}


export const updateCompany = async (id, name, email, address, phone, country, companyId, userId) => {
    try {
        const company = await companyModel.findByIdAndUpdate(id, { name, email, address, phone, country, companyId, userId }, { new: true })
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