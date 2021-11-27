"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.sqlite3 = void 0;
const amazonbooks = require("teem");
const sqlite3 = require('sqlite3').verbose();
exports.sqlite3 = sqlite3;
const path = require('path');
const dbPath = path.join(__dirname, '../../db/conn.db');
console.log(dbPath);
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        return console.log(err.message);
    }
    else {
        console.log("Successfully connected to DB!");
    }
});
exports.db = db;
amazonbooks.run();
//# sourceMappingURL=amazonbooks.js.map