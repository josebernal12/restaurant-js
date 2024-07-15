import mongoose from 'mongoose'

const { Schema } = mongoose

const billSchema = new Schema({
  ticketId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ticket'
    }
  ],
  tableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'table'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  methodOfPayment: {
    type: String,
    required: true
  },
  folio: {
    type: Number
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  }

}, {
  timestamps: true
})
const billModel = mongoose.model('bill', billSchema)
export default billModel
