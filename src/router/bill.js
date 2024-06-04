
import { Router } from 'express'
import {
    bestWaiterController,
    generateBillController,
    getBillByIdController,
    getBillLastWeekController,
    getBillsController,
    productSellController,
    sellsController,
    userSellByTableController,
    userSellController
} from '../controllers/billController.js'
import { checkJwt } from '../middleware/permission.js'
import { designTicketController, getDesignTicketController } from '../controllers/designTicketController.js'

const router = Router()
router.get('/', getBillsController)
router.get('/best-waiter', bestWaiterController)
router.get('/sells', sellsController)
router.post('/designTicket', designTicketController)
router.get('/getDesignTicket', [checkJwt], getDesignTicketController)
router.get('/type', [checkJwt], getBillLastWeekController)
router.get('/user/:id', userSellController)
router.get('/product/:id',  productSellController)
router.get('/table/:id', userSellByTableController)

router.post('/:id', [checkJwt], generateBillController)
router.get('/:id', [checkJwt], getBillByIdController)
export default router