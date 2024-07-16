import { Router } from 'express'
import {
    findMethodOfPaymentByCompanyController,
    updateMethodOfPaymentController
} from '../controllers/methodOfPaymentController.js'
import { checkJwt } from '../middleware/permission.js'

const router = Router()

router.put('/', [checkJwt], updateMethodOfPaymentController)
router.get('/', [checkJwt], findMethodOfPaymentByCompanyController)

export default router