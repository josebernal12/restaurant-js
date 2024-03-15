import express from 'express'
import 'dotenv/config'
import cors from 'cors'

import 'dotenv/config'
import userRouter from './router/router.js'

import { connectDB } from './database/database.js'
import productRouter from './router/product.js'
import rolRouter from './router/rol.js'
import tableRouter from './router/table.js'
import ticketRouter from './router/ticket.js'
import billRouter from './router/bill.js'

const app = express()
const port = process.env.PORT || 8080
app.use(cors())
app.use(express.json())
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/rol', rolRouter)
app.use('/api/table', tableRouter)
app.use('/api/ticket', ticketRouter)
app.use('/api/bill', billRouter)
app.listen(port, () => {
  connectDB()

  console.log('Connection has been established successfully.');
  console.log('server listening to port 8080')
})