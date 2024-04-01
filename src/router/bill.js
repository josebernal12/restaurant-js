import { Router } from 'express'
import { generateBillController, getBillByIdController, getBillsController } from '../controllers/billController.js'
import { checkJwt } from '../middleware/permission.js'

const router = Router()

router.post('/:id',  generateBillController)
router.get('/',  getBillsController)
router.get('/:id',  getBillByIdController)

export default router