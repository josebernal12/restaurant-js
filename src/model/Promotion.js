import mongoose from 'mongoose'

const { Schema } = mongoose

const promotionSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
}, {
  timestamps: true
})

const promotionModel = mongoose.model('promotion', promotionSchema)

export default promotionModel