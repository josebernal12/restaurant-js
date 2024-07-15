import { Router } from 'express'
import {
    createCompanyController,
    findCompanyByIdController,
    updateCompanyController
} from '../controllers/companyController.js'

const router = Router()

router.post('/', createCompanyController)
router.put('/:id', updateCompanyController)
router.get('/:id', findCompanyByIdController)

export default router