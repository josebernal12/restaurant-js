import mongoose from 'mongoose'
const { Schema } = mongoose

const activitiesSchema = new Schema({
  activities: [{
    message: {
      type: String,
      required: true
    },
    date: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    timestamp: {
      type: Number,
      default: Date.now()
  }
  }]
},)

const activitiesModel = mongoose.model('activitiesRecently', activitiesSchema)
export default activitiesModel