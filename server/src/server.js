import app from './app.js';
import connectDB from './config/db.js';
import { env } from './config/env.js';
import { bootstrapAdmin } from './services/bootstrapAdmin.service.js';

const startServer = async () => {
  try {
    await connectDB();
    await bootstrapAdmin();
    app.listen(env.port, () => {
      console.log(`S.H.I.E.L.D. API listening on port ${env.port}.`);
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();
