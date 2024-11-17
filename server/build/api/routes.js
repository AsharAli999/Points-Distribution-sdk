"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/api/routes.ts
const express_1 = require("express");
// import { validateApiKey } from './middlewares';
const controllers_js_1 = require("./controllers.js");
const router = (0, express_1.Router)();
// Public routes
router.post('/register', controllers_js_1.registerApiKey);
// Protected routes (require API key)
router.post('/distribute', controllers_js_1.distributePoints);
router.get('/points/:address', controllers_js_1.getPointsByAddress);
router.get('/points/:address/events', controllers_js_1.getPointsByAddressAndEvent);
router.get('/points/:address/total', controllers_js_1.getTotalPointsByAddress);
exports.default = router;
