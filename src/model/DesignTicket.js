import mongoose from 'mongoose'

const { Schema } = mongoose

const designTicketSchema = new Schema({
    name: {
        type: String,
    },
    logo: {
        type: String
    },
    address: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    measures: {
        type: String
    }
}, {
    timestamps: true
})

const designModel = mongoose.model('Design Ticket', designTicketSchema)

export default designModel