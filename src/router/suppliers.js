import { Router } from 'express'
import {
    createSupplierController,
    deleteSupplierController,
    getSupplierByIdController,
    getSuppliersController,
    updateSupplierController
} from '../controllers/supplierController.js'


const router = Router()

router.post('/', createSupplierController)
router.get('/', getSuppliersController)
router.put('/:id', updateSupplierController)
router.delete('/:id', deleteSupplierController)
router.get('/:id', getSupplierByIdController)

export default router