const { getConnection } = require('../database/conexionsql');
const helpers = require('../lib/helpers');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

const sql = require('mssql');

module.exports = {
    //Porotocolo
    async getexamenes(req, res) {
        const pool = await getConnection();
        const roles = await pool.query(`sp_selExamenes`);
        res.json(roles.recordset);
    },
    async getempresas(req, res) {
        const parametro = req.query.parametro;
        const pool = await getConnection();
        const codrolUser = req.user.codrol;
        const roles = await pool.query(`sp_selEmpresa '${parametro}','${codrolUser}'`);
        res.json(roles.recordset);
    },
    async getTipoExamenes(req, res) {
        const pool = await getConnection();
        const roles = await pool.query(`sp_selTipoExamen`);
        res.json(roles.recordset);
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
        const { pachis, appaterno, apmaterno, nombres, fecnac, cod_ubigeo, docide, numdoc, dirpac, cod_ubigeo2 ,correo,telefono, celular, numhijos, numdep, pcd, foto, huella, firma, sexo_id, grainst_id, estciv_id, codtipcon,ippais,opc} = req.body;
        const usenam = req.user.usuario;
        const hostname = '';
        const codrolUser = req.user.codrol;

        const pool = await getConnection();
        const response = await pool.query(`sp_insPaciente '${appaterno.toUpperCase()}',${apmaterno.toUpperCase()},'${nombres.toUpperCase()}','${fecnac}','${cod_ubigeo}','${docide}','${numdoc}','${dirpac}','${cod_ubigeo2}','${correo.toUpperCase()}','${telefono.trim()}', '${celular}','${numhijos}','${numdep}','${pcd}','','','','${sexo_id}','${grainst_id}','${estciv_id}','${codtipcon}','${ippais}','${usenam}','${codrolUser}','${opc}'`);
        
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
    async deletepaciente(req, res) {//eliminar usuario
        const { dni } = req.body;
        const codrolUser = req.user.codrol;
        const pool = await getConnection();
        const response = await pool.query(`sp_delPaciente '${codrolUser}','${dni}'`);
        res.json(response.recordset);
    },


    /*************************/
    /************Citas*******/
    async getCitasCombos(req, res) {//llenar los combos de formulario       
        const codrolUser = req.user.codrol;
        const pool = await getConnection();
        const response = await pool.query(`sp_selCombosCita '${codrolUser}'`);
        res.json(response.recordset);
    },
    async getProtocoloCombos(req, res) {//llenar los combos del formulario en base al protocolo
        const { parametro } = req.query;
        const codrolUser = req.user.codrol;
        const pool = await getConnection();
        const response = await pool.query(`pa_selcmbProtocolo '${codrolUser}','${parametro}'`);
        res.json(response.recordset);
    },
    async postcita(req, res) {//agregar cita
        const { cli_id, codpro_id,valapt_id, pachis,fecprocitaDate, fecprocitaTime, obscita, cargo_actual, fecing_cargo, area_actual, fecing_area, fecing_empresa, altilab_id, superf_id, tipseg_id, cond_vehiculo, ope_equipo_pesado, envresult_correo, com_info_medica, ent_result_fisico, usa_firma_formatos, res_lugar_trabajo} = req.body;
        const usenam = req.user.usuario;
        const hostname = '';
        const codrolUser = req.user.codrol;

        const pool = await getConnection();
        const response = await pool.query(`pa_InsCita '${pachis}', ${valapt_id}, ${cli_id}, ${codpro_id}, '${fecprocitaDate}','${fecprocitaTime}', '${area_actual}', '${fecing_area}', '${cargo_actual}', '${fecing_cargo}', '${fecing_empresa}', '${ope_equipo_pesado}', '${cond_vehiculo}', '${envresult_correo}', '${com_info_medica}', '${ent_result_fisico}', '${usa_firma_formatos}', '${res_lugar_trabajo}', ${altilab_id}, ${superf_id}, ${tipseg_id}, '${obscita}', ${codrolUser}, '${usenam}'`);
        
        res.json(response.recordset);
    },
    /*************************/
};
