import { Router } from 'express'
import { checkJwt } from '../middleware/permission.js'
import {
  cancelTicketController,
  completedAllProductTicketController,
  completedProductController,
  createTicketController,
  deleteTicketController,
  finishedTicketController,
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
router.get('/:id', getTicketsByIdController)
router.delete('/delete/:id', deleteTicketController)
router.delete('/cancel/:id', cancelTicketController)
router.put('/received/:id', receivedTicketController)
router.put('/finished/:id', finishedTicketController)
router.put('/completed/:id', completedProductController)
router.put('/complete-all/:id', completedAllProductTicketController)
router.get('/join-product/:id', joinAllProductsTicketController)
export default router