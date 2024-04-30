
import { Router } from 'express'
import { bestWaiterController, generateBillController, getBillByIdController, getBillsController, sellsController } from '../controllers/billController.js'
import { checkJwt } from '../middleware/permission.js'
import { designTicketController, getDesignTicketController } from '../controllers/designTicketController.js'
import { stripeController } from '../controllers/stripeController.js'

const router = Router()
router.get('/', [checkJwt], getBillsController)
router.get('/best-waiter', [checkJwt], bestWaiterController)
router.get('/sells', [checkJwt], sellsController)
router.post('/designTicket', [checkJwt], designTicketController)
router.get('/getDesignTicket', [checkJwt], getDesignTicketController)
router.post('/checkout', [checkJwt], stripeController)
router.get('/success', () => {
    res.send('listo')
})
router.get('/cancel', () => {
    console.log('error')
})
router.post('/:id', [checkJwt], generateBillController)
router.get('/:id', [checkJwt], getBillByIdController)
export default router