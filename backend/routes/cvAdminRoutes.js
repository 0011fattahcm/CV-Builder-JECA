// routes/cvAdminRoutes.js
import express from 'express';
import authAdminMiddleware from '../middleware/authAdminMiddleware.js';
import CV from '../models/CV.js';
import User from '../models/User.js';

const router = express.Router();

// cvAdminRoutes.js
router.get('/', authAdminMiddleware, async (req, res) => {
  try {
    const cvs = await CV.find({}, 'updatedAt user')             // << hanya field yang dipakai tabel
      .populate({ path: 'user', select: 'name email' })         // << hanya name & email
      .sort({ _id: -1 })
      .lean();                                                  // << kirim plain object (lebih ringan)

    res.json(cvs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil data CV' });
  }
});


export default router;
