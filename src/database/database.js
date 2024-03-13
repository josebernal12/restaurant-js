import { Sequelize } from 'sequelize'
import mongoose from 'mongoose'

export const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI)
}
// const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
//   dialect: 'postgres',
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT
// })

// export default sequelize