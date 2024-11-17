// src/api/routes.ts
import { Router } from 'express';
// import { validateApiKey } from './middlewares';
import {
  registerApiKey,
  distributePoints,
  getPointsByAddress,
  getPointsByAddressAndEvent,
  getTotalPointsByAddress,
} from './controllers.js';

const router = Router();

// Public routes
router.post('/register', registerApiKey);

// Protected routes (require API key)
router.post('/distribute',  distributePoints);
router.get('/points/:address',  getPointsByAddress);
router.get('/points/:address/events',  getPointsByAddressAndEvent);
router.get('/points/:address/total',  getTotalPointsByAddress);

export default router;