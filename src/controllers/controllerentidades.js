const { getConnection } = require('../database/conexionsql');
const helpers = require('../lib/helpers');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');


module.exports = {
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

    /************Paciente*******/
    async getPacienteCombos(req, res) {//llenar los combos de formulario       
        const codrolUser = req.user.codrol;
        const pool = await getConnection();
        const response = await pool.query(`sp_selCombosPaciente '${codrolUser}'`);
        res.json(response.recordset);
    },
    async getDistrito(req, res) {//Modal de busqueda de Distrito
        const { parametro } = req.query;
        const codrolUser = req.user.codrol;
        const pool = await getConnection();
        const response = await pool.query(`sp_selDistrito '${codrolUser}','${parametro}'`);
        res.json(response.recordset);
    },
    async getPais(req, res) {//Modal de busqueda de Pais
        const { parametro } = req.query;
        const codrolUser = req.user.codrol;
        const pool = await getConnection();
        const response = await pool.query(`sp_selPais '${codrolUser}','${parametro}'`);
        res.json(response.recordset);
    },
    async postpaciente(req, res) {//agregar paciente
        const { pachis, appaterno, apmaterno, nombres, fecnac, cod_ubigeo, docide, numdoc, dirpac, cod_ubigeo2 ,correo,telefono, celular, numhijos, numdep, pcd, foto, huella, firma, sexo_id, grainst_id, estciv_id, codtipcon,ippais} = req.body;
        const usenam = req.user.usuario;
        const hostname = '';
        const codrolUser = req.user.codrol;

        const pool = await getConnection();
        const response = await pool.query(`sp_insPaciente '${pachis.toUpperCase()}','${appaterno.toUpperCase()}',${apmaterno.toUpperCase()},'${nombres.toUpperCase()}','${fecnac}','${cod_ubigeo}','${docide}','${numdoc}','${dirpac}','${cod_ubigeo2}','${correo.toUpperCase()}','${telefono.trim()}', '${celular}','${numhijos}','${numdep}','${pcd}','','','','${sexo_id}','${grainst_id}','${estciv_id}','${codtipcon}','${ippais}','${usenam}','${codrolUser}'`);
        
        res.json(response.recordset);
    },
    async getpaciente(req, res) {//listar paciente para edicion
        const { parametro } = req.query;
        const codrolUser = req.user.codrol;
        const pool = await getConnection();
        const response = await pool.query(`sp_selpaciente '${codrolUser}','${parametro}'`);
        //console.log(response.recordset);
        res.json(response.recordset);
    },


    /*************************/
}