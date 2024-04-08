import mongoose from 'mongoose'
const { Schema } = mongoose

const ticketSchema = new Schema({
  products: [
    {
      name: String,
      price: Number,
      stock: Number,

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
  completed: {
    type: Boolean,
    default: false
  },
  tableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'table'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  waiter: {
    type: String
  },
  status: {
    type: String,
  },

}, {
  timestamps: true
})

const ticketModel = mongoose.model('ticket', ticketSchema)

export default ticketModel