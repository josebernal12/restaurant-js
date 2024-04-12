import { Router } from 'express'
import { addProductController, bestProductController, deleteProductController, getProductByIdController, getProductsController, searchProductController, updateProductController } from '../controllers/productController.js'
import {
  addProductPermission,
  deleteProductPermission,
  updateProductPermission
} from '../middleware/productPermission.js'
import { checkJwt } from '../middleware/permission.js'

const router = Router()

router.get('/', getProductsController)
router.post('/', [addProductPermission], addProductController)
router.get('/bestSeller', bestProductController)
router.get('/:id', [addProductPermission], getProductByIdController)
router.put('/update/:id', [updateProductPermission], updateProductController)
router.delete('/delete/:id', [deleteProductPermission], deleteProductController)
router.post('/search', searchProductController)


export default router