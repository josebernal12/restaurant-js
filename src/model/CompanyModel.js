import { Schema, model } from 'mongoose'

const CompanySchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    number: {
        type: Number,
        trim: true
    },
    pais: {
        type: String,
        trim: true
    }
}, { timestamps: true })

const companyModel = model('Company', CompanySchema)

export default companyModel