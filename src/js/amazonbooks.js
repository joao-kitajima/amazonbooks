"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scalar = exports.executar = exports.db = exports.sqlite3 = void 0;
const amazonbooks = require("teem");
const sqlite3v = require("sqlite3");
const sqlite3 = sqlite3v.verbose();
exports.sqlite3 = sqlite3;
const path = require("path");
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
function executar(sql) {
    return new Promise((resolve, reject) => {
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows);
            }
        });
    });
}
exports.executar = executar;
function scalar(sql) {
    return new Promise((resolve, reject) => {
        db.get(sql, (err, row) => {
            if (err) {
                reject(err);
            }
            else {
                if (row) {
                    for (let i in row) {
                        resolve(row[i]);
                        break;
                    }
                }
                else {
                    resolve(null);
                }
            }
        });
    });
}
exports.scalar = scalar;
//# sourceMappingURL=amazonbooks.js.map