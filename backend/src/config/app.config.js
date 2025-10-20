// backend/src/config/appConfig.js
export const APP_CONFIG = {
  payment: {
    nominalIdr: Number(process.env.PAYMENT_NOMINAL_IDR || 9800),
  },
  uploadLimits: {
    photoBytes: 10 * 1024 * 1024,   // 10MB
    fileBytes:  20 * 1024 * 1024,   // 20MB (convert & merger)
  },
  urls: {
    baseUrl: process.env.BASE_URL || 'http://localhost:5000',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  },
};
