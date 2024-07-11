import { Schema, model } from 'mongoose'

const suppliersSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    address: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    }
}, { timestamps: true })

const supplierModel = model('supplier', suppliersSchema)

export default supplierModel