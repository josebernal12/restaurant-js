import { Router } from 'express'
import { addProductController, deleteProductController, getProductByIdController, getProductsController, updateProductController } from '../controllers/productController.js'

const router = Router()

router.get('/', getProductsController)
router.post('/', addProductController)
router.get('/:id', getProductByIdController)
router.put('/update/:id', updateProductController)
router.delete('/delete/:id', deleteProductController)



export default router