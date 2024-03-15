import { Router } from 'express'
import { generateBillController, getBillsController } from '../controllers/billController.js'
import { checkJwt } from '../middleware/permission.js'

const router = Router()

router.post('/:id', [checkJwt], generateBillController)
router.get('/', getBillsController)

export default router