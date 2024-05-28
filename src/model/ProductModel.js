import mongoose, { mongo } from 'mongoose'

const { Schema } = mongoose

const productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
  },
  promotion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'promotion',
    default: false,
  },
  recipe: [{
    name: String,
    stock: Number,
    unit: String
  }]
}, {
  timestamps: true
})

const productModel = mongoose.model('Product', productSchema)

export default productModel