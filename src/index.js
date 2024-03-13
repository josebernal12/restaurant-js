import express from 'express'
import 'dotenv/config'
import cors from 'cors'

import 'dotenv/config'
import userRouter from './router/router.js'
import sequelize from './database/database.js'
// import router from './router/router.js'
// router
// // import productRouter from './routes/products'
const app = express()
const port = process.env.PORT || 8080
app.use(cors())
app.use(express.json())
app.use('/api/user', userRouter)
// app.use('/api/product', productRouter)
app.listen(port, () => {
  sequelize.authenticate()
  console.log('Connection has been established successfully.');
  console.log('server listening to port 8080')
})