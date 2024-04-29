
import { Router } from 'express'
import { bestWaiterController, generateBillController, getBillByIdController, getBillsController, sellsController } from '../controllers/billController.js'
import { checkJwt } from '../middleware/permission.js'
import { designTicketController,getDesignTicketController } from '../controllers/designTicketController.js'
import { stripeController } from '../controllers/stripeController.js'

const router = Router()
router.get('/', getBillsController)
router.get('/best-waiter', bestWaiterController)
router.get('/sells', sellsController)
router.post('/designTicket', designTicketController)
router.get('/getDesignTicket', getDesignTicketController)
router.post('/checkout', stripeController)
router.post('/:id', generateBillController)
router.get('/:id', getBillByIdController)
export default router