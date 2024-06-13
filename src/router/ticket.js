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
router.put('/update/:id',  updateTicketController)
router.get('/', [checkJwt], getTicketsController)
router.delete('/delete/:id', [checkJwt], deleteTicketController)
router.delete('/cancel/:id',  cancelTicketController)
router.put('/received/:id', [checkJwt], receivedTicketController)
router.put('/finished/:id', [checkJwt], finishedTicketController)
router.put('/completed/:id', [checkJwt], completedProductController)
router.put('/complete-all/:id', [checkJwt], completedAllProductTicketController)
router.get('/join-product/:id', [checkJwt], joinAllProductsTicketController)
router.get('/tickets', [checkJwt], getAllTicketsController)
router.get('/:id', [checkJwt], getTicketsByIdController)

export default router