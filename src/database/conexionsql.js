const sql = require('mssql')
const { dbSettings } = require('./keys');

module.exports = {

 async getConnection() {
    try {
        const pool = await sql.connect(dbSettings);
        return pool;
    } catch (error) {
        console.log(error);
    }
}};

