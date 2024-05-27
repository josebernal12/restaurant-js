
import { Router } from 'express'
import { bestWaiterController, generateBillController, getBillByIdController, getBillLastWeekController, getBillsController, sellsController } from '../controllers/billController.js'
import { checkJwt } from '../middleware/permission.js'
import { designTicketController, getDesignTicketController } from '../controllers/designTicketController.js'

const router = Router()
router.get('/',  getBillsController)
router.get('/best-waiter', [checkJwt], bestWaiterController)
router.get('/sells', [checkJwt], sellsController)
router.post('/designTicket', [checkJwt], designTicketController)
router.get('/getDesignTicket', [checkJwt], getDesignTicketController)
router.get('/type', getBillLastWeekController )
router.get('/success', () => {
    res.send('listo')
})
router.get('/cancel', () => {
    console.log('error')
})
router.post('/:id', [checkJwt], generateBillController)
router.get('/:id', [checkJwt], getBillByIdController)
export default router