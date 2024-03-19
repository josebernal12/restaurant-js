import { Router } from 'express'
import { generateBillController, getBillByIdController, getBillsController } from '../controllers/billController.js'
import { checkJwt } from '../middleware/permission.js'

const router = Router()

router.post('/:id', [checkJwt], generateBillController)
router.get('/', [checkJwt], getBillsController)
router.get('/:id', [checkJwt], getBillByIdController)

export default router