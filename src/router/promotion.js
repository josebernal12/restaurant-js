import { Router } from 'express'
import { checkJwt } from '../middleware/permission'
import {
  createPromotionController,
  deletePromotionController,
  getAllPromotionController,
  getPromotionByIdController,
  updatePromotionController
} from '../controllers/promotionController'

const router = Router()

router.get('/', [checkJwt], getAllPromotionController)
router.post('/', [checkJwt], createPromotionController)
router.put('/update/:id', [checkJwt], updatePromotionController)
router.delete('/delete/:id', [checkJwt], deletePromotionController)
router.get('/:id', [checkJwt], getPromotionByIdController)

export default router