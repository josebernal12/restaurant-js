import { Router } from 'express'
import { addActivitiesController, getActivitiesController } from '../controllers/activitiesController.js'
const router = Router()

router.post('/', addActivitiesController)
router.get('/', getActivitiesController)
export default router