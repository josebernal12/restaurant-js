import { Router } from 'express'
import { checkJwt } from '../middleware/permission.js'
import {
  cancelTicketController,
  completedAllProductTicketController,
  completedProductController,
  createTicketController,
  deleteTicketController,
  finishedTicketController,
  getAllTicketsController,
  getTicketsByIdController,
  getTicketsController,
  joinAllProductsTicketController,
  receivedTicketController,
  updateTicketController
} from '../controllers/ticketController.js'

const router = Router()

router.post('/:id', createTicketController)
router.put('/update/:id', updateTicketController)
router.get('/', getTicketsController)
router.delete('/delete/:id', deleteTicketController)
router.delete('/cancel/:id', cancelTicketController)
router.put('/received/:id', receivedTicketController)
router.put('/finished/:id', finishedTicketController)
router.put('/completed/:id', completedProductController)
router.put('/complete-all/:id', completedAllProductTicketController)
router.get('/join-product/:id', joinAllProductsTicketController)
router.get('/tickets', getAllTicketsController)
router.get('/:id', getTicketsByIdController)

export default router