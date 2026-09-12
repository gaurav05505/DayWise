import express from 'express';
import {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  markPresent,
  markAbsent,
  deleteSubject,
} from '../controllers/subject.controller.js';

const router = express.Router();

router.post('/', createSubject);
router.get('/', getAllSubjects);
router.get('/:id', getSubjectById);
router.patch('/:id', updateSubject);
router.patch('/:id/present', markPresent);
router.patch('/:id/absent', markAbsent);
router.delete('/:id', deleteSubject);

export default router;