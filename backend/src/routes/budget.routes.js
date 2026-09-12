import express from 'express';
import {
  setBudget,
  getBudget,
  getBudgetSummary,
  getCategorySummary,
} from '../controllers/budget.controller.js';

const router = express.Router();

router.post('/', setBudget);
router.get('/', getBudget);
router.get('/summary', getBudgetSummary);
router.get('/categories', getCategorySummary);

export default router;

