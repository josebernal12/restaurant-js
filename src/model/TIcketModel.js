import mongoose from 'mongoose'
const { Schema } = mongoose
import { uid } from 'uid'
const ticketSchema = new Schema({
  products: [
    {
      name: String,
      price: Number,
      stock: Number,
      uid: {
        type: String,
        default: uid(16)
      },
      completed: {
        type: Boolean,
        default: false
      },
      recipe: [{
        type: Schema.Types.ObjectId,
        ref: 'Inventary'
      }]

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