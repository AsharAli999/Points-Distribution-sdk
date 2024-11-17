"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTotalPointsByAddress = exports.getPointsByAddressAndEvent = exports.getPointsByAddress = exports.distributePoints = exports.registerApiKey = void 0;
const uuid_1 = require("uuid");
const db_1 = require("../db");
const registerApiKey = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectName, projectEmail } = req.body;
    if (!projectName || !projectEmail) {
        res.status(400).json({ error: 'Project name and email are required' });
        return;
    }
    try {
        const apiKey = (0, uuid_1.v4)();
        yield (0, db_1.query)('INSERT INTO api_keys (api_key, project_name, project_email) VALUES ($1, $2, $3)', [apiKey, projectName, projectEmail]);
        res.status(201).json({ apiKey });
    }
    catch (error) {
        console.error('Error registering API key:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.registerApiKey = registerApiKey;
const distributePoints = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { apiKey, eventName, pointsData } = req.body;
    if (!apiKey || !eventName || !pointsData || !Array.isArray(pointsData)) {
        res.status(400).json({ error: 'API key, event name, and points data array are required' });
        return;
    }
    try {
        // First, validate the API key
        const apiKeyResult = yield (0, db_1.query)('SELECT api_key FROM api_keys WHERE api_key = $1', [apiKey]);
        if (apiKeyResult.rows.length === 0) {
            res.status(401).json({ error: 'Invalid API key' });
            return;
        }
        // Begin transaction
        yield (0, db_1.query)('BEGIN');
        try {
            // Insert points data
            for (const data of pointsData) {
                if (!data.points || !data.address) {
                    throw new Error('Invalid points data format');
                }
                yield (0, db_1.query)('INSERT INTO points_data (api_key, event_name, points, address) VALUES ($1, $2, $3, $4)', [apiKey, eventName, data.points, data.address]);
            }
            yield (0, db_1.query)('COMMIT');
            res.status(200).json({ message: 'Points distributed successfully' });
        }
        catch (error) {
            yield (0, db_1.query)('ROLLBACK');
            throw error;
        }
    }
    catch (error) {
        console.error('Error distributing points:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.distributePoints = distributePoints;
const getPointsByAddress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { address } = req.params;
    if (!address) {
        res.status(400).json({ error: 'Address is required' });
        return;
    }
    try {
        const result = yield (0, db_1.query)('SELECT event_name, points, created_at FROM points_data WHERE address = $1', [address]);
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error('Error retrieving points:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getPointsByAddress = getPointsByAddress;
const getPointsByAddressAndEvent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { address } = req.params;
    const { eventName } = req.query;
    if (!address || !eventName) {
        res.status(400).json({ error: 'Address and event name are required' });
        return;
    }
    try {
        const result = yield (0, db_1.query)('SELECT points, created_at FROM points_data WHERE address = $1 AND event_name = $2', [address, eventName]);
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error('Error retrieving points:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getPointsByAddressAndEvent = getPointsByAddressAndEvent;
const getTotalPointsByAddress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { address } = req.params;
    if (!address) {
        res.status(400).json({ error: 'Address is required' });
        return;
    }
    try {
        const result = yield (0, db_1.query)('SELECT SUM(points) as total_points FROM points_data WHERE address = $1', [address]);
        res.status(200).json({ totalPoints: result.rows[0].total_points || 0 });
    }
    catch (error) {
        console.error('Error retrieving total points:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getTotalPointsByAddress = getTotalPointsByAddress;
