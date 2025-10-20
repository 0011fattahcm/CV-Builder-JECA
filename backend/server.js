// server.js
import http from 'http';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes.js';
import cvRoutes from './routes/cvRoutes.js';
import exportCvRoutes from './routes/exportCvRoutes.js';
import pdfRoutes from './routes/pdfRoutes.js';
import imageToPdfRoutes from './routes/imageToPdfRoutes.js';

import adminRoutes from './routes/adminRoutes.js';
import adminAuthRoutes from './routes/adminAuthRoutes.js';
import adminStatsRoutes from './routes/adminStatsRoutes.js';
import adminUserRoutes from './routes/adminUserRoutes.js';
import adminExportCvRoutes from './routes/adminExportCvRoutes.js';
import adminLogRoutes from './routes/adminLogRoutes.js';
import cvAdminRoutes from './routes/cvAdminRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';

import paymentRoutes from './payment-gateaway/routes/paymentRoutes.js';
import xenditWebhookRoutes from './payment-gateaway/routes/xenditWebhookRoute.js';

import { Server } from 'socket.io';

dotenv.config();

const app = express();
const server = http.createServer(app);

// ===== Core middlewares =====
app.set('trust proxy', 1);
app.use(cookieParser());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// ===== CORS (lokal) =====
const CLIENT_URL = process.env.CLIENT_URL || 'https://cvbuilderjeca.com';
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true, // penting kalau pakai cookie
  })
);

// ===== Socket.io =====
export const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    credentials: true,
  },
});
io.on('connection', (socket) => {
  // contoh event
  // console.log('socket connected', socket.id);
});

// ===== Routes =====
app.get('/health', (_, res) => res.json({ ok: true }));

app.use('/api/users', userRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/export', exportCvRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api', imageToPdfRoutes);

app.use('/api', adminRoutes);
app.use('/api', adminAuthRoutes);
app.use('/api', adminStatsRoutes);
app.use('/api', adminUserRoutes);
app.use('/api/rx78gpo1p6/export', adminExportCvRoutes);
app.use('/api/rx78gpo1p6/cv', cvAdminRoutes);
app.use('/api', adminLogRoutes);
app.use('/api/announcement', announcementRoutes);

app.use('/api/payment', paymentRoutes);
app.use('/api/xendit', xenditWebhookRoutes);

// ===== MongoDB =====
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ===== Start server (gunakan server.listen agar Socket.io aktif) =====
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
