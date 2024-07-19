import { Router } from 'express'
import {
    findMethodOfPaymentByCompanyController,
    quantitySellMethodOfPaymentController,
    totalSellCashController,
    updateMethodOfPaymentController
} from '../controllers/methodOfPaymentController.js'
import { checkJwt } from '../middleware/permission.js'

const router = Router()

router.put('/', [checkJwt], updateMethodOfPaymentController)
router.get('/', [checkJwt], findMethodOfPaymentByCompanyController)
router.get('/quantity', [checkJwt], quantitySellMethodOfPaymentController)
router.get('/totalSellCash', [checkJwt], totalSellCashController)

export default router