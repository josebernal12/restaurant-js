import { Router } from 'express'
import {
  createTargetController,
  deleteTargetController,
  getAllTargetController,
  getTargetbyIdController,
  updateTargetController
} from '../controllers/targetController.js'

const router = Router()

router.get('/', getAllTargetController)
router.post('/', createTargetController)
router.get('/:id', getTargetbyIdController)
router.put('/update/:id', updateTargetController)
router.delete('/delete/:id', deleteTargetController)


export default router