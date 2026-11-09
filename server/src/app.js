import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import communityRoutes from './routes/community.routes.js';
import lostFoundRoutes from './routes/lostFound.routes.js';
import announcementRoutes from './routes/announcement.routes.js';
import locationRoutes from './routes/location.routes.js';
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js';
import assistantRoutes from './routes/assistant.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || env.clientOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin is not allowed by CORS.'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
if (env.nodeEnv !== 'production') app.use(morgan('dev'));
app.use(cookieParser());

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'S.H.I.E.L.D. API is healthy',
    data: { status: 'ok' },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/lost-found', lostFoundRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/campus/locations', locationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/assistant', assistantRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
