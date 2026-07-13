import 'reflect-metadata';
import './config/container';
import { ConnectDb } from './config/db';
import { ENV } from './config/env';
import app from './app';
import logger from './utils/logger';

const startServer = async (): Promise<void> => {
  try {
    await ConnectDb();
    app.listen(ENV.PORT, () => {
      logger.info(`Server running on port ${ENV.PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
};

void startServer();
