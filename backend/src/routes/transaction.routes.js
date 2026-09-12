import express from 'express';
import {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transaction.controller.js';

const router = express.Router();

router.post('/', createTransaction);
router.get('/', getAllTransactions);
router.get('/:id', getTransactionById);
router.patch('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;

