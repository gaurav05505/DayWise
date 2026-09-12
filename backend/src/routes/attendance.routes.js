import express from 'express';
import {
  getAttendanceSummary,
  markAttendance,
} from '../controllers/attendance.controller.js';

const router = express.Router();

router.get('/summary', getAttendanceSummary);
router.patch('/mark', markAttendance);

export default router;
