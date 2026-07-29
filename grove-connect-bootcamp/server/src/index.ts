import 'dotenv/config'; // Loads .env SYNCHRONOUSLY before imported routes run!

import express from 'express';
import cors from 'cors';
import paymentRoutes from './routes/payments';
import webhookRoutes from './routes/webhooks';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json());

// Routes
app.use('/api/payments', paymentRoutes);
app.use('/api/webhooks', webhookRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'online', service: 'Grove Connect Payment Service' });
});

app.listen(PORT, () => {
  console.log(`Grove Connect Payment Server running on port ${PORT}`);
});