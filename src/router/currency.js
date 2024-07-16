import { Router } from 'express'
import { currencyController } from '../controllers/currencyController.js'

const router = Router()

router.get('/', currencyController)

export default router