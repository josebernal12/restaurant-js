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
import noteRouter from './router/note.js'

const app = express()
const port = process.env.PORT || 8080
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5174', 'http://127.0.0.1:5173'],
  credentials: true,
  optionSuccessStatus: 200
}
app.use(cors(corsOptions))
app.use(express.json())
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/rol', rolRouter)
app.use('/api/table', tableRouter)
app.use('/api/ticket', ticketRouter)
app.use('/api/bill', billRouter)
app.use('/api/activities', activitiesRouter)
app.use('/api/note', noteRouter)
const server = app.listen(port, () => {
  connectDB()

  console.log('Connection has been established successfully.');
  console.log('server listening to port 8080')
})


const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174', 'https://table-main-master-master-3.onrender.com'],

  }
})

io.on('connection', (socket) => {
  console.log('conectacdo a socket io')

  socket.on('crear ticket', ticket => {
    io.emit('ticket creado', ticket)
  })
  socket.on('actualizar ticket', ticket => {
    io.emit('ticket actualizado', ticket)
  })
  socket.on('eliminar ticket', ticket => {
    io.emit('ticket eliminado', ticket)
  })
  socket.on('recibir ticket', ticket => {
    io.emit('ticket recibido', ticket)
  })
  socket.on('finalizar ticket', ticker => {
    io.emit('ticket finalizado')
  })
  socket.on('crear nota', nota => {
    io.emit('nota creada', nota)
  })
  socket.on('actualizar nota', nota => {
    io.emit('nota actualizada', nota)
  })
  socket.on('eliminar nota', nota => {
    io.emit('nota eliminada', nota)
  })
})