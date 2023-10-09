const { getConnection } = require('../database/conexionsql');
const sql = require('mssql');

module.exports = {
    //Porotocolo   
    async getprotocololist(req, res) {
        const protocolo = req.query.protocolo;
        const codrol = req.user.codrol;
        if(protocolo.lenght===0){
            protocolo ='%';
        }
        const pool = await getConnection();
        const Protocolos = await pool.query(`sp_selProtocolo '${protocolo}','${codrol}'`);
        res.json(Protocolos.recordset);
    },
    async getexamenes(req, res) {
        const pool = await getConnection();
        const Examenes = await pool.query(`sp_selExamenes`);
        res.json(Examenes.recordset);
    },
    async getempresas(req, res) {
        const empresa = req.query.empresa;
        const codrol = req.user.codrol;
        const pool = await getConnection();
        const empresas = await pool.query(`sp_selEmpresa '${empresa}','${codrol}'`);
        res.json(empresas.recordset);
    },
    async getTipoExamenes(req, res) {
        const pool = await getConnection();
        const TipoExamenes = await pool.query(`sp_selTipoExamen`);
        res.json(TipoExamenes.recordset);
    },
    async postprotocolo(req, res) {
        try {
            const { codemp, nompro, comentarios, tipexa_id, estado, tiemval_cermed, fecvcto_cermed, datains } = req.body;
            const usenam = req.user.usuario;
            const hostname = '';
            const codrol = req.user.codrol;
            const detalleJson = JSON.stringify(datains);
            const pool = await getConnection();
            const request = pool.request();
            const PROCEDURE_NAME = 'pa_InsProtocolo';
            request.input('codemp', sql.Int, codemp);
            request.input('nompro', sql.VarChar(20), nompro);
            request.input('comentarios', sql.VarChar(100), comentarios);
            request.input('tipexa_id', sql.Int, tipexa_id);
            request.input('estado', sql.Char(1), estado);
            request.input('tiemval_cermed', sql.Int, tiemval_cermed);
            request.input('fecvcto_cermed', sql.Date(), fecvcto_cermed);
            request.input('usenam', sql.VarChar(30), usenam);
            request.input('hostname', sql.VarChar(20), hostname);
            request.input('codrol', sql.Int, codrol);
            request.input('DetalleProtocoloJson', sql.NVarChar(sql.MAX), detalleJson);
            const result = await request.execute(PROCEDURE_NAME);
            pool.close();
            res.json(result.recordset);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },
    async getprotocolooptions(req, res) {
        const protocolo = req.query.protocolo;
        const codrol = req.user.codrol;
        const pool = await getConnection();
        const ProtocoloOptions = await pool.query(`sp_selProtocoloOptions '${protocolo}','${codrol}'`);
        res.json(ProtocoloOptions.recordset);
    },
    

};