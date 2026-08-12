import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import paymentRoutes from './routes/payments';
import webhookRoutes from './routes/webhooks';

const app = express();
const PORT = process.env.PORT || 5000;

// Tell Express to trust proxy headers (Required for Render & express-rate-limit)
app.set('trust proxy', 1);

// Security Headers
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));


// 2. Dynamic CORS Configuration (Handles Vercel Previews & Production)
const allowedOrigins = [
  process.env.CLIENT_URL?.replace(/\/$/, ''),
  'http://localhost:3000',
  'http://127.0.0.1:3000',
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, cURL, Postman)
      if (!origin) return callback(null, true);

      const isAllowed =
        allowedOrigins.includes(origin) ||
        /\.vercel\.app$/.test(origin); // Allows all Vercel deployment preview URLs

      if (isAllowed) {
        return callback(null, true);
      } else {
        console.warn(`[CORS Blocked]: ${origin}`);
        return callback(new Error('CORS policy constraint violated'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-paystack-signature'],
  })
);

// 3. Save raw body buffer for Paystack Webhook HMAC verification
app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      if (buf && buf.length) {
        req.rawBody = buf;
      }
    },
  })
);

// 4. Rate Limiting for API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 mins
  message: { error: 'Too many requests, please try again later.' },
});

app.use('/api/', apiLimiter);

// 5. Routes
app.use('/api/webhooks', webhookRoutes);
app.use('/api/payments', paymentRoutes);

// Health Check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'online', service: 'Grove Connect Payment Service' });
});

app.listen(PORT, () => {
  console.log(`Grove Connect Payment Server running on port ${PORT}`);
});