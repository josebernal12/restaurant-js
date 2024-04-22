
import { Router } from 'express'
import { bestWaiterController, generateBillController, getBillByIdController, getBillsController, sellsController } from '../controllers/billController.js'
import { checkJwt } from '../middleware/permission.js'
import { designTicketController, getDesignTicketByIdController } from '../controllers/designTicketController.js'

const router = Router()

router.get('/best-waiter', bestWaiterController)
router.get('/sells', sellsController)
router.post('/designTicket', designTicketController)
router.get('/designTicket/:id', getDesignTicketByIdController)
router.post('/:id', generateBillController)
router.get('/', getBillsController)
router.get('/:id', getBillByIdController)
export default router