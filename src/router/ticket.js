import { Router } from 'express'
import { checkJwt } from '../middleware/permission.js'
import {
  cancelTicketController,
  createTicketController,
  deleteTicketController,
  finishedTicketController,
  getTicketsByIdController,
  getTicketsController,
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
export default router