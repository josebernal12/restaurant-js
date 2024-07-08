
import { Router } from 'express'
import {
    bestWaiterController,
    generateBillController,
    getBillByIdController,
    getBillLastWeekController,
    getBillsController,
    hourProductController,
    productSellController,
    sellsController,
    userSellByTableController,
    userSellController,
    inventorySellController,
    billSellController,
    productsSellAllController,
    billSellByQuerysController,
    createMultipleBillsController
} from '../controllers/billController.js'
import { checkJwt } from '../middleware/permission.js'
import { designTicketController, getDesignTicketController } from '../controllers/designTicketController.js'
import { createMultipleTicketsControlller } from '../controllers/ticketController.js'

const router = Router()
router.get('/',  getBillsController)
router.get('/best-waiter', [checkJwt], bestWaiterController)
router.get('/sells',  sellsController)
router.post('/designTicket', [checkJwt], designTicketController)
router.get('/getDesignTicket', [checkJwt], getDesignTicketController)
router.get('/type', [checkJwt], getBillLastWeekController)
router.get('/user/:id', [checkJwt], userSellController)
router.get('/product/:id', [checkJwt], productSellController)
router.get('/table/:id', [checkJwt], userSellByTableController)
router.get('/hour/:id', [checkJwt], hourProductController)
router.get('/inventory/:id', [checkJwt], inventorySellController)
router.get('/bill',  billSellController)
router.get('/products', [checkJwt], productsSellAllController)
router.get('/bill/query', [checkJwt], billSellByQuerysController) //
router.post('/create/multiple-bills', createMultipleBillsController)
router.post('/:id', [checkJwt], generateBillController)
router.get('/:id', [checkJwt], getBillByIdController)
export default router