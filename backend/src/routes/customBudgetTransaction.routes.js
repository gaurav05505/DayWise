import express from 'express';
import {
  updateCustomBudgetTransaction,
  deleteCustomBudgetTransaction,
} from '../controllers/customBudget.controller.js';

const router = express.Router();

router.patch('/:id', updateCustomBudgetTransaction);
router.delete('/:id', deleteCustomBudgetTransaction);

export default router;

