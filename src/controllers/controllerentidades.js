const { getConnection } = require('../database/conexionsql');

module.exports = {
    //Porotocolo
    async getexamenes(req, res) {
        const pool = await getConnection();
        const roles = await pool.query(`sp_selExamenes`);
        res.json(roles.recordset);
    },
    async getempresas(req, res) {
        const empresa = req.query.empresa;
        const pool = await getConnection();
        const roles = await pool.query(`sp_selEmpresa ${empresa}`);
        res.json(roles.recordset);
    },
    async getTipoExamenes(req, res) {
        const pool = await getConnection();
        const roles = await pool.query(`sp_selTipoExamen`);
        res.json(roles.recordset);
    }, 
    async postprotocolo(req, res) {
        const data = req.body;
        const pool = await getConnection();
        const roles = await pool.query(`sp_selTipoExamen`);
        res.json(roles.recordset);
    },  
};