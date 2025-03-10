const Database = require("better-sqlite3");

const db = new Database("database/forum.db", {verbose: console.log });

module.exports = db;
