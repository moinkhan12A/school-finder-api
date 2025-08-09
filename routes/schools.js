// routes/schools.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const { body, query, validationResult } = require('express-validator');

const toRad = (deg) => (deg * Math.PI) / 180;
const haversineKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * POST /addSchool
 * body: { name, address, latitude, longitude }
 */
router.post(
  '/addSchool',
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 255 }),
    body('address').trim().notEmpty().withMessage('Address is required').isLength({ max: 500 }),
    body('latitude').notEmpty().withMessage('Latitude is required')
      .isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
    body('longitude').notEmpty().withMessage('Longitude is required')
      .isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { name, address, latitude, longitude } = req.body;
    try {
      const [result] = await pool.query(
        'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
        [name, address, parseFloat(latitude), parseFloat(longitude)]
      );
      const insertedId = result.insertId;
      const [rows] = await pool.query('SELECT id, name, address, latitude, longitude, created_at FROM schools WHERE id = ?', [insertedId]);
      res.status(201).json({ success: true, data: rows[0] });
    } catch (err) {
      console.error('DB INSERT ERROR:', err);
      res.status(500).json({ success: false, message: 'Database error', error: err.message });
    }
  }
);

/**
 * GET /listSchools?lat=..&lng=..
 * returns schools sorted by proximity with distance_km field
 */
router.get(
  '/listSchools',
  [
    query('lat').notEmpty().withMessage('lat is required').isFloat({ min: -90, max: 90 }),
    query('lng').notEmpty().withMessage('lng is required').isFloat({ min: -180, max: 180 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const userLat = parseFloat(req.query.lat);
    const userLng = parseFloat(req.query.lng);

    try {
      const [schools] = await pool.query('SELECT id, name, address, latitude, longitude, created_at FROM schools');

      const enriched = schools.map(s => {
        const dist = haversineKm(userLat, userLng, Number(s.latitude), Number(s.longitude));
        return { ...s, distance_km: +dist.toFixed(3) };
      });

      enriched.sort((a, b) => a.distance_km - b.distance_km);

      res.json({ success: true, count: enriched.length, data: enriched });
    } catch (err) {
      console.error('DB SELECT ERROR:', err);
      res.status(500).json({ success: false, message: 'Database error', error: err.message });
    }
  }
);

module.exports = router;
