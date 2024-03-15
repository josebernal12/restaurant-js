import mongoose from 'mongoose'
mongoose.set('strictQuery', false); 
export const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI)
}
