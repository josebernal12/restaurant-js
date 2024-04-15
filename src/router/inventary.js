import { Router } from 'express'
import { 
  createProductInventoryController, 
  deleteProductInventoryController, 
  getProducInventoryByIdController, 
  inventaryController, 
  updateProductInventoryController 
} from '../controllers/inventaryController.js'

const router = Router()


router.get('/', inventaryController)
router.post('/', createProductInventoryController)
router.put('/update/:id', updateProductInventoryController)
router.delete('/delete/:id', deleteProductInventoryController)
router.get('/:id', getProducInventoryByIdController)


export default router