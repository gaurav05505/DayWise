import express from 'express';
import cors from 'cors';
import subjectRoutes from './routes/subject.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import categoryRoutes from './routes/category.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import budgetRoutes from './routes/budget.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'DayWise API is running' });
});

app.use('/api/subjects', subjectRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budget', budgetRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

export default app;
