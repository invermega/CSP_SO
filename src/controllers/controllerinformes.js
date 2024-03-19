const { getConnection } = require('../database/conexionsql');
const sql = require('mssql');
const fs = require('fs').promises;
const path = require('path');

module.exports = {
    async getFormatoSaludOcu(cita_id, soexa, res,req) {
        
        const pool = await getConnection();
        const examenes = await pool.query(`pa_SelFormatoSaludOcupacional '${cita_id}','${soexa}'`);       
        res.json(examenes.recordset);
        pool.close();
    },
}