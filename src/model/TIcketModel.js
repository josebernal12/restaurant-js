import mongoose from 'mongoose'
const { Schema } = mongoose

const ticketSchema = new Schema({
  products: [
    {
      name: String,
      price: Number,
      stock: Number
    }
  ],
  subTotal: {
    type: Number,
    // required: true,
  },
  total: {
    type: Number,
    // required: true,
  },
  tableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'table'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }

}, {
  timestamps: true
})

const ticketModel = mongoose.model('ticket', ticketSchema)

export default ticketModel