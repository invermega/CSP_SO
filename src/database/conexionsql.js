const sql = require('mssql')
const { dbSettings } = require('./keys');

module.exports = {

 async getConnection() {
    try {
        const pool = await new sql.ConnectionPool(dbSettings).connect();
        
        return pool;
    } catch (error) {
        console.log(error);
    }
}};
