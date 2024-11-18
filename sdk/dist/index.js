"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PointsSDK = void 0;
// src/index.ts
const axios_1 = __importDefault(require("axios"));
class PointsSDK {
    constructor(apiKey, baseURL = 'https://points-distribution-sdk.onrender.com/api') {
        this.apiKey = apiKey;
        this.client = axios_1.default.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    /**
     * Distributes points to a specific address for an event
     * @param eventName Name of the event
     * @param pointsData Array of points data containing address and points
     */
    async distribute(eventName, pointsData) {
        try {
            await this.client.post('/distribute', {
                apiKey: this.apiKey,
                eventName,
                pointsData,
            });
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    /**
     * Get all points for a specific address
     * @param address User's address
     */
    async getPointsByAddress(address) {
        try {
            const response = await this.client.get(`/points/${address}`);
            return response.data;
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    /**
     * Get points for a specific address filtered by event name
     * @param address User's address
     * @param eventName Name of the event
     */
    async getPointsByAddressAndEvent(address, eventName) {
        try {
            const response = await this.client.get(`/points/${address}/events`, {
                params: { eventName },
            });
            return response.data;
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    /**
     * Get total points for a specific address
     * @param address User's address
     */
    async getTotalPointsByAddress(address) {
        try {
            const response = await this.client.get(`/points/${address}/total`);
            return response.data;
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    /**
     * Register for a new API key
     * @param projectName Name of the project
     * @param projectEmail Project contact email
     */
    static async register(projectName, projectEmail, baseURL = 'https://points-distribution-sdk.onrender.com/api') {
        try {
            const response = await axios_1.default.post(`${baseURL}/register`, {
                projectName,
                projectEmail,
            });
            return response.data;
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    static handleError(error) {
        var _a, _b;
        if (axios_1.default.isAxiosError(error)) {
            return new Error(((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) || 'An error occurred while making the request');
        }
        return error;
    }
    handleError(error) {
        return PointsSDK.handleError(error);
    }
}
exports.PointsSDK = PointsSDK;
