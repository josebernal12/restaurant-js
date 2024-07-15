import { Schema, model } from 'mongoose'

const CompanySchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    }
}, { timestamps: true })

const companyModel = model('Company', CompanySchema)

export default companyModel