import { Router } from 'express'
import { checkJwt } from '../middleware/permission.js'
import { createTicketController, getTicketsByIdController, getTicketsController, updateTicketController } from '../controllers/ticketController.js'

const router = Router()

router.post('/:id', [checkJwt, createTicketController])
router.put('/update/:id', [checkJwt], updateTicketController)
router.get('/', getTicketsController)
router.get('/:id', getTicketsByIdController)
export default router