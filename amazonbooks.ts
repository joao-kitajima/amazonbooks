import amazonbooks = require("teem");
import sqlite3v = require('sqlite3');
const sqlite3 = sqlite3v.verbose();

import path = require('path');
import { resolve } from "path";
const dbPath = path.join(__dirname, '../../db/conn.db');
console.log(dbPath)

const db = new sqlite3.Database(dbPath, (err) =>{
    if (err){
        return console.log(err.message);
    } else {
        console.log("Successfully connected to DB!");
    }
});


amazonbooks.run();

function executar(sql: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
        db.all(
			sql,
			(err, rows) => {
				if(err) {
					reject(err);
				} else {
                    resolve(rows);
                }
			}
		);
    });
}

function scalar(sql: string): Promise<any> {
    return new Promise((resolve, reject) => {
        db.get(
			sql,
			(err, row) => {
				if(err) {
					reject(err);
				} else {
                    if (row) {
                        for (let i in row) {
                            resolve(row[i]);
                            break;
                        }
                    } else {
                        resolve(null);
                    }
                }
			}
		);
    });
}


export {sqlite3, db, executar, scalar}
