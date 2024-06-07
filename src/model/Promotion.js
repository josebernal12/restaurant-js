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
  days: [
    {
      type: String,
    }
  ],
  startHour: {
    type: String,
  },
  endHour: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  type: {
    type: String,
    required: true
  },
  discount: {
    type: Number,
  },
  active: {
    type: Boolean,
    default: true
  },
  image: {
    type: String,
    default: null
  }
}, {
  timestamps: true
})

const promotionModel = mongoose.model('promotion', promotionSchema)

export default promotionModel