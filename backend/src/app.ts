import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import imageRoutes from './routes/image.routes';
import { globalErrorHandler } from './middlewares/error.middleware';
import cookieParser from 'cookie-parser';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use(globalErrorHandler);

export default app;
