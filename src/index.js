import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import { Server, Socket } from 'socket.io'
import 'dotenv/config'
import userRouter from './router/router.js'
import { connectDB } from './database/database.js'
import productRouter from './router/product.js'
import rolRouter from './router/rol.js'
import tableRouter from './router/table.js'
import ticketRouter from './router/ticket.js'
import billRouter from './router/bill.js'
import activitiesRouter from './router/activities.js'
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
app.use('/api/activities', activitiesRouter)
const server = app.listen(port, () => {
  connectDB()

  console.log('Connection has been established successfully.');
  console.log('server listening to port 8080')
})


// const io = new Server(server, {
//   pingTimeout: 60000,
//   // cors: {
//   //   origin: ['http://127.0.0.1:5174', 'http://localhost:5174'],

//   // }
// })

// io.on('connection', (socket) => {
//   console.log('conectacdo a socket io')


//   socket.on('crear ticket', ticket => {
//     // socket.to(ticket).emit('ticket creado', ticket)
//     console.log(ticket)
//   })


// })