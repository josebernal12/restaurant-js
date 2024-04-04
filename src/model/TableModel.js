import mongoose from 'mongoose'
const { Schema } = mongoose

const tableSchema = new Schema({
  available: {
    type: Boolean,
    default: false
  },
  number: {
    type: Number
  }
},
  { timestamps: true })

const tableModel = mongoose.model('table', tableSchema)

export default tableModel