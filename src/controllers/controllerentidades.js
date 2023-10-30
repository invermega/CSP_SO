const { getConnection } = require('../database/conexionsql');
const helpers = require('../lib/helpers');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

const sql = require('mssql');

module.exports = {
    //Porotocolo   
    async getprotocololist(req, res) {
        const protocolo = req.query.protocolo;
        const codrol = req.user.codrol;
        if (protocolo.lenght === 0) {
            protocolo = '%';
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
        const { pachis, appaterno, apmaterno, nombres, fecnac, cod_ubigeo, docide, numdoc, dirpac, cod_ubigeo2, correo, telefono, celular, numhijos, numdep, pcd, foto, huella, firma, sexo_id, grainst_id, estciv_id, codtipcon, ippais } = req.body;
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


    /********************************/

    /************MEDICOS*************/

    async postmedico(req, res) {//agregar medico
        const { medap, medam, mednam, docide, nundoc, med_cmp, med_rne, medTelfij, medcel, med_correo, meddir, med_firma, esp_id, opc } = req.body;
        const usenam = req.user.usuario;
        const hostname = '';
        const codrolUser = req.user.codrol;
        const pool = await getConnection();
        const response = await pool.query(`pa_InsMedico '${medap.toUpperCase()}',${medam.toUpperCase()},'${mednam.toUpperCase()}','${docide}','${nundoc}','${med_cmp}','${med_rne}',
        '${medTelfij.trim()}','${medcel}','${med_correo.toUpperCase()}','${meddir}','${med_firma}','${esp_id}','${usenam}','${hostname}','${codrolUser}','${opc}'`);

        res.json(response.recordset);
    },
    async getmedico(req, res) {//listar medico para edicion
        const { parametro } = req.query;
        const codrolUser = req.user.codrol;
        console.log(parametro)
        const pool = await getConnection();
        const response = await pool.query(`pa_selMedico  '${codrolUser}','${parametro}'`);
        //console.log(response.recordset);
        res.json(response.recordset);
        
    },
    async deletemedico(req, res) {//eliminar medico
        const { med_id } = req.body;
        const codrolUser = req.user.codrol;
        const pool = await getConnection();
        const response = await pool.query(`pa_delMedico '${codrolUser}','${med_id}'`);
        res.json(response.recordset);
    },
    /*************Cliente***************/
    async postcliente(req, res) {//agregar cliente
        const { docide, NumDoc, razsoc, actividad_economica,Direccion, logo, contacto, emailcon, celular, telefono, emailmedocu,cadcermed, incfirmmedexa, Incfirpacexa, Inchuepacexa, Incfordatper, incdecjur, Incfirhueforadi, creusucatocu, Encorvctocert, envcorusuexi, creusucatprev, notinfmed_medocu, notinfmedpac, opc } = req.body;
        const usenam = req.user.usuario;
        const hostname = '';
        const codrolUser = req.user.codrol;
        const pool = await getConnection();
        const response = await pool.query(`pa_InsCliente '${razsoc.toUpperCase()}','${docide}','${NumDoc}','${Direccion}','${telefono}','${emailcon}','${contacto}','${celular}','${emailmedocu}','${usenam}','${cadcermed}','${incfirmmedexa}','${Incfirpacexa}','${Inchuepacexa}','${Incfordatper}','${incdecjur}','${Incfirhueforadi}','${creusucatocu}','${Encorvctocert}','${envcorusuexi}','${creusucatprev}','${notinfmed_medocu}','${notinfmedpac}','${actividad_economica}','${logo}','${codrolUser}','${opc}'`);

        res.json(response.recordset);
    },
    async getcliente(req, res) {//listar cliente para edicion
        const { parametro } = req.query;
        const codrolUser = req.user.codrol;
        const pool = await getConnection();
        const response = await pool.query(`pa_selCliente  '${codrolUser}','${parametro}'`);
        //console.log(response.recordset);
        res.json(response.recordset);
    },
    async deletecliente(req, res) {//eliminar cliente
        const { cli_id } = req.body;
        const codrolUser = req.user.codrol;
        const pool = await getConnection();
        const response = await pool.query(`pa_delCliente '${codrolUser}','${cli_id}'`);
        res.json(response.recordset);
    },
};
