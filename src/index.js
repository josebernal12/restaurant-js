import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import morgan from 'morgan'
import compression from 'compression'
import { Server, Socket } from 'socket.io'
import userRouter from './router/router.js'
import { connectDB } from './database/database.js'
import productRouter from './router/product.js'
import rolRouter from './router/rol.js'
import tableRouter from './router/table.js'
import ticketRouter from './router/ticket.js'
import billRouter from './router/bill.js'
import activitiesRouter from './router/activities.js'
import noteRouter from './router/note.js'
import targetRouter from './router/target.js'
import inventaryRouter from './router/inventary.js'
import promotionRouter from './router/promotion.js'
import categoryRouter from './router/category.js'
import questionsRouter from './router/questions.js'
const app = express()
const port = process.env.PORT || 3000
const corsOptions = {
  origin: [process.env.FRONTEND_URL1, process.env.FRONTEND_URL2, process.env.FRONTEND_URL3, process.env.FRONTEND_URL4, process.env.FRONTEND_PRODUCTION],
  credentials: true,
  optionSuccessStatus: 200
}
app.use(cors(corsOptions))
app.use(express.json())
app.use(morgan('combined'))
app.use(compression())
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/rol', rolRouter)
app.use('/api/table', tableRouter)
app.use('/api/ticket', ticketRouter)
app.use('/api/bill', billRouter)
app.use('/api/activities', activitiesRouter)
app.use('/api/note', noteRouter)
app.use('/api/target', targetRouter)
app.use('/api/inventory', inventaryRouter)
app.use('/api/promotion', promotionRouter)
app.use('/api/category', categoryRouter)
app.use('/api/questions', questionsRouter)
const server = app.listen(port, () => {
  connectDB()

  console.log('Connection has been established successfully.');
  console.log('server listening to port 8080')
})


const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: [process.env.FRONTEND_URL1, process.env.FRONTEND_URL2, process.env.FRONTEND_URL3, process.env.FRONTEND_URL4, process.env.FRONTEND_PRODUCTION],

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
  socket.on('finalizar ticket', ticket => {
    io.emit('ticket finalizado', ticket)
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