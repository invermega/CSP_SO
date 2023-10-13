const { getConnection } = require('../database/conexionsql');
const helpers = require('../lib/helpers');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

const sql = require('mssql');
const XLSX = require('xlsx');
const xlsxPopulate = require('xlsx-populate');

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
    async getprotocolodatos(req, res) {
        const { id } = req.params;
        const pool = await getConnection();
        const Examenes = await pool.query(`sp_selProtocoloDatosId '${id}'`);
        res.json(Examenes.recordset);
    },
    async getexamenes(req, res) {
        const pool = await getConnection();
        const Examenes = await pool.query(`sp_selExamenes`);
        res.json(Examenes.recordset);
    },
    async getexamenesid(req, res) {
        const { id } = req.params;
        const pool = await getConnection();
        const Examenes = await pool.query(`sp_selExamenesid '${id}'`);
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
            const { codemp, nompro, comentarios, tipexa_id, estado, tiemval_cermed, fecvcto_cermed, id, datains } = req.body;
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
            request.input('codpro_id', sql.Int, id);
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
    async delprotocolo(req, res) {
        try {
            const seleccionados = req.body;
            const detalleJson = JSON.stringify(seleccionados);
            const codrol = req.user.codrol;
            const pool = await getConnection();
            const request = pool.request();
            const PROCEDURE_NAME = 'pa_DelProtocolo';
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
    async getexportarprotocolo(req, res) {
        const { id } = req.params;
        const pool = await getConnection();
        const cabecera = await pool.query(`sp_selProtocoloDatosIdexp '${id}'`);
        const detalle = await pool.query(`sp_selExamenesidexp '${id}'`);

        const cabeceraData = cabecera.recordset[0];
        const detalleData = detalle.recordset;
        xlsxPopulate.fromBlankAsync().then(workbook => {
            const sheet = workbook.sheet(0);
            sheet.cell('D1').value('DETALLE DEL PROTOCOLO').style('bold', true).style('fontSize', 20).style('fontColor', '800080').style('underline', true);
            sheet.cell('A2').value('');
            let rowIndex = 3;
            for (const key in cabeceraData) {
                sheet.cell(`A${rowIndex}`).value(key).style('bold', true);
                sheet.cell(`B${rowIndex}`).value(cabeceraData[key]);
                rowIndex++;
            }
            rowIndex++;

            const data = detalleData.map(row => [row['COD. EXAMEN'], row['EXAMEN'], row['COD. PRUEBA'], row['PRUEBA'], row['GRUPO ETARIO'], row['PRECIO'], row['OBSERVACIÓN']]);
            const dataTable = [['COD. EXAMEN', 'EXAMEN', 'COD. PRUEBA', 'PRUEBA', 'GRUPO ETARIO', 'PRECIO', 'OBSERVACIÓN'], ...data];
            sheet.cell(`A${rowIndex}`).value(dataTable).style({ border: true });
            sheet.range(`A11:G11`).style('bold', true).style('fontSize', 12).style('fontColor', 'FFFFFF').style('fill', '369EA6').style('border', true);

            sheet.column('A').width(25);
            sheet.column('B').width(25);
            sheet.column('C').width(15);
            sheet.column('D').width(40);
            sheet.column('E').width(40);
            sheet.column('F').width(15);
            sheet.column('G').width(25);
            workbook.outputAsync().then(buffer => {
                res.setHeader('Content-Type', 'application/vnd.openxmlformats');
                res.setHeader('Content-Disposition', `attachment; filename= REPORTE DE PROTOCOLO ${cabeceraData['NOMBRE DE PROTOCOLO']}.xlsx`);
                res.end(buffer);
            });
        });
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


    /************MEDICOS*************/
    /*************************/

};


