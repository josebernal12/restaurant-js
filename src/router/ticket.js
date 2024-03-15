import { Router } from 'express'
import { checkJwt } from '../middleware/permission.js'
import { createTicketController } from '../controllers/ticketController.js'

const router = Router()

router.post('/:id', [checkJwt, createTicketController])

export default router