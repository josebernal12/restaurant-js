import { Sequelize } from 'sequelize'
import mongoose from 'mongoose'

export const connectDB = async () => {
  await mongoose.connect('mongodb+srv://jose:LTM9UyDPkPKzReZO@cluster0.vkevaq2.mongodb.net/restaurant?retryWrites=true&w=majority&appName=Cluster0')
}
// const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
//   dialect: 'postgres',
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT
// })

// export default sequelize