import { Router } from 'express'
import {
  addProductController,
  bestProductController,
  deleteProductController,
  getProductByIdController,
  getProductsController,
  searchProductController,
  updateProductController
} from '../controllers/productController.js'
import {
  addProductPermission,
  deleteProductPermission,
  updateProductPermission
} from '../middleware/productPermission.js'
import { checkJwt } from '../middleware/permission.js'

const router = Router()

router.get('/', getProductsController)
router.post('/', [checkJwt, addProductPermission], addProductController)
router.get('/bestSeller', bestProductController)
router.put('/update/:id', [checkJwt, updateProductPermission], updateProductController)
router.delete('/delete/:id', [checkJwt, deleteProductPermission], deleteProductController)
router.post('/search', searchProductController)
router.get('/:id', [checkJwt, addProductPermission], getProductByIdController)

export default router