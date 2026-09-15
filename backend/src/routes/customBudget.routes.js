import express from 'express';
import {
  createCustomBudget,
  getAllCustomBudgets,
  getCustomBudgetById,
  updateCustomBudget,
  deleteCustomBudget,
  createCustomBudgetTransaction,
  getCustomBudgetTransactions,
} from '../controllers/customBudget.controller.js';

const router = express.Router();

router.post('/', createCustomBudget);
router.get('/', getAllCustomBudgets);
router.get('/:id', getCustomBudgetById);
router.patch('/:id', updateCustomBudget);
router.delete('/:id', deleteCustomBudget);

router.post('/:id/transactions', createCustomBudgetTransaction);
router.get('/:id/transactions', getCustomBudgetTransactions);

export default router;

