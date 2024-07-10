import { Router } from 'express'
import { createNoteController, deleteNoteController, getAllNotesController, getNoteByIdController, updateNoteController } from '../controllers/notesController.js'
import { checkJwt } from '../middleware/permission.js'

const router = Router()

router.post('/',  createNoteController)
router.get('/', [checkJwt], getAllNotesController)
router.get('/:id', [checkJwt], getNoteByIdController)
router.put('/update/:id', [checkJwt], updateNoteController)
router.delete('/delete/:id', [checkJwt], deleteNoteController)
export default router