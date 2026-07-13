import mongoose from 'mongoose';
import { ENV } from './env';
import logger from '../utils/logger';

export const ConnectDb = async (): Promise<void> => {
  try {
    await mongoose.connect(ENV.MONGO_URI);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection failed', { error });
    process.exit(1);
  }
};
