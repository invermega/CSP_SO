const { getConnection } = require('../database/conexionsql');
const sql = require('mssql');
const helpers = require('../lib/helpers');
const passport = require('passport');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

module.exports = {
    async getebeneficio(req, res) {
        try {
            const idbeneficio = req.body.id;
            //console.log(idproveedor);
            const pool = await getConnection();
            const servicios = await pool.request().query(`EXEC pa_SelEBeneficios '${idbeneficio}'`)
            //console.log(servicios.recordset);
            res.json(servicios.recordset);
        } catch (error) {
            console.error('Error en listar beneficio:', error);
            res.status(500).json('Hubo un error en el servidor.');
        }
    },

    




};