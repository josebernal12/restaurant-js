import { Router } from 'express'
import { createNoteController, deleteNoteController, getAllNotesController, getNoteByIdController, updateNoteController } from '../controllers/notesController.js'
import { checkJwt } from '../middleware/permission.js'

const router = Router()
router.patch('/update/:id', [checkJwt], updateNoteController)
router.post('/', [checkJwt], createNoteController)
router.get('/', [checkJwt], getAllNotesController)
router.get('/:id', [checkJwt], getNoteByIdController)
router.delete('/delete/:id', [checkJwt], deleteNoteController)
export default router