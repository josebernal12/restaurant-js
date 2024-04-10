import { Router } from 'express'
import { bestWaiterController, generateBillController, getBillByIdController, getBillsController } from '../controllers/billController.js'
import { checkJwt } from '../middleware/permission.js'

const router = Router()

router.get('/best-waiter', bestWaiterController)
router.post('/:id',  generateBillController)
router.get('/',  getBillsController)
router.get('/:id',  getBillByIdController)

export default router