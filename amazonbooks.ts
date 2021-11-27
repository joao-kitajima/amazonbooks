import amazonbooks = require("teem");
const sqlite3 = require('sqlite3').verbose();

const path = require('path');
const dbPath = path.join(__dirname, '../../db/conn.db');
console.log(dbPath)

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) =>{
    if (err){
        return console.log(err.message);
    } else {
        console.log("Successfully connected to DB!");
    }
});


amazonbooks.run();

export {sqlite3, db}
