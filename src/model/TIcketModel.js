import mongoose from 'mongoose'
const { Schema } = mongoose
import { uid } from 'uid'
const ticketSchema = new Schema({
  products: [
    {
      name: String,
      price: Number,
      stock: Number,
      discount: Number,
      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
      },
      uid: {
        type: String,
        default: uid(16)
      },
      completed: {
        type: Boolean,
        default: false
      },
      recipe: [{
        name: String,
        stock: Number,
        unit: {
          name: {
            type: String
          },
          clave: {
            type: String
          }
        },
        // max: Number,
        // min: Number,        

      }],
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
  waiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
  },
  promotion: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'promotion',
      default: false,
    }
  ],
  folio: {
    type: Number
  }
}, {
  timestamps: true
})

const ticketModel = mongoose.model('ticket', ticketSchema)

export default ticketModel