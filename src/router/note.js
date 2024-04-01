import { Router } from 'express'
import { createNoteController, deleteNoteController, getAllNotesController, getNoteByIdController, updateNoteController } from '../controllers/notesController.js'

const router = Router()

router.post('/', createNoteController)
router.get('/', getAllNotesController)
router.get('/:id', getNoteByIdController)
router.put('/update/:id', updateNoteController)
router.delete('/delete/:id', deleteNoteController)
export default router