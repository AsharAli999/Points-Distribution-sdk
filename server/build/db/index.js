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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log('Connecting to the database with the following settings:');
console.log({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD ? '****' : 'Not Provided',
    port: process.env.DB_PORT,
});
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
pool.on('connect', () => {
    console.log('Database connected successfully');
});
pool.on('error', (err) => {
    console.error('Unexpected database error:', err.message, err.stack);
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield pool.query('SELECT NOW()');
        console.log('Test query result:', res.rows[0]);
    }
    catch (err) {
        console.error('Database query failed:');
    }
}))();
const query = (text, params) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield pool.connect();
    try {
        const res = yield client.query(text, params);
        return res;
    }
    finally {
        client.release();
    }
});
exports.query = query;
