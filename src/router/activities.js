import { Router } from 'express'
import { addActivitiesController } from '../controllers/activitiesController.js'
const router = Router()

router.post('/', addActivitiesController)

export default router