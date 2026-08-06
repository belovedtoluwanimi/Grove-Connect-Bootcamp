import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import paymentRoutes from './routes/payments';
import webhookRoutes from './routes/webhooks';

const app = express();
const PORT = process.env.PORT || 5000;

// Security Headers
app.use(helmet());

// Strip trailing slash from CLIENT_URL to prevent CORS mismatches
const rawClientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
const clientUrl = rawClientUrl.replace(/\/$/, '');

app.use(
  cors({
    origin: [clientUrl, 'http://localhost:3000'],
    credentials: true,
  })
);

// Save raw body buffer for Paystack Webhook HMAC verification
app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

// Rate Limiting for API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 mins
  message: { error: 'Too many requests, please try again later.' },
});

app.use('/api/', apiLimiter);

// Routes
app.use('/api/webhooks', webhookRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'online', service: 'Grove Connect Payment Service' });
});

app.listen(PORT, () => {
  console.log(`Grove Connect Payment Server running on port ${PORT}`);
});