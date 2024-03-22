const { getConnection } = require('../database/conexionsql');
const sql = require('mssql');
const path = require('path');
const sharp = require('sharp');
const XLSX = require('xlsx');
const xlsxPopulate = require('xlsx-populate');
const fs = require('fs');
async function guardarImagen(imagen, nombre, carpeta) {
    const rutaCarpeta = path.join(__dirname, '..', 'public', 'img', carpeta);
    const rutaSalida = path.join(rutaCarpeta, `${nombre}`);

    if (!fs.existsSync(rutaCarpeta)) {
        fs.mkdirSync(rutaCarpeta, { recursive: true });
    }

    if (fs.existsSync(rutaSalida)) {
        fs.unlinkSync(rutaSalida);
    }

    const imagenSinPrefijo = imagen.replace(/^data:image\/png;base64,/, '');
    const imagenBinaria = Buffer.from(imagenSinPrefijo, 'base64');

    await sharp(imagenBinaria)
        .toFormat('webp')
        .toFile(rutaSalida);
}

module.exports = {
    /*****************Protocolo*****************/
    async getprotocololist(req, res) {
        let protocolo = req.query.protocolo;
        let cli_id = req.query.cli_id;
        const codrol = req.user.codrol;
        if (protocolo === '') {
            protocolo = '%';
        }
        if (cli_id === '') {
            cli_id = '%';
        }
        const pool = await getConnection();
        const Protocolos = await pool.query(`sp_selProtocolo '${protocolo}','${cli_id}','${codrol}'`);
        res.json(Protocolos.recordset);
    },

    async getprotocololistimport(req, res) {
        let protocolo = req.query.protocolo;        
        const codrol = req.user.codrol;
        if (protocolo === '') {
            protocolo = '%';
        }
        const pool = await getConnection();
        const Protocolos = await pool.query(`sp_selProtocoloimport '${protocolo}','${codrol}'`);
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
            const { codemp, nompro, comentarios, tipexa_id, estado, tiemval_cermed, fecvcto_cermed, id, datains,fec_emi,cant_pac,med_id } = req.body;
            const usenam = req.user.usuario;
            const hostname = '';
            const codrol = req.user.codrol;
            const detalleJson = JSON.stringify(datains);
            const pool = await getConnection();
            const request = pool.request();
            const PROCEDURE_NAME = 'pa_InsProtocolo';
            request.input('codemp', sql.Int, codemp);
            request.input('nompro', sql.VarChar(50), nompro);
            request.input('comentarios', sql.VarChar(100), comentarios);
            request.input('tipexa_id', sql.Int, tipexa_id);
            request.input('estado', sql.Char(1), estado);
            request.input('tiemval_cermed', sql.Int, tiemval_cermed);
            request.input('fecvcto_cermed', sql.Date(), fecvcto_cermed);
            request.input('codpro_id', sql.Int, id);
            request.input('usenam', sql.VarChar(30), usenam);
            request.input('hostname', sql.VarChar(20), hostname);
            request.input('codrol', sql.Int, codrol);
            request.input('fec_emi', sql.Date(), fec_emi);
            request.input('cant_pac', sql.Int, cant_pac);
            request.input('med_id', sql.Int, med_id);
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
    /******************************************/

    /************Paciente*******/
    async getpaciente(req, res) {//listar paciente para edicion
        let { parametro, parametro1 } = req.query;
        if (parametro1 === '') {
            parametro1 = '%';
        }
        console.log(parametro, parametro1);
        const codrolUser = req.user.codrol;
        const pool = await getConnection();
        const response = await pool.query(`sp_selpaciente '${codrolUser}','${parametro}','${parametro1}'`);
        //console.log(response.recordset);
        res.json(response.recordset);
    },
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
        const { pachis, appaterno, apmaterno, nombres, fecnac, cod_ubigeo, docide, numdoc, dirpac, cod_ubigeo2, correo, telefono, celular, numhijos, numdep, pcd, foto, huella, firma, sexo_id, grainst_id, estciv_id, codtipcon, ippais, inputid,dir_nrodpptoint,nom_urba } = req.body;
        const nombreFoto = `FO_${numdoc}.webp`;
        const nombreHuella = `HU_${numdoc}.webp`;
        const nombreFirma = `FI_${numdoc}.webp`;
        await guardarImagen(foto, nombreFoto, 'paciente/foto')
        await guardarImagen(huella, nombreHuella, 'paciente/huella')
        await guardarImagen(firma, nombreFirma, 'paciente/firma')

        const usenam = req.user.usuario;
        const hostname = '';
        const codrolUser = req.user.codrol;
        const pool = await getConnection();
        const response = await pool.query(`sp_insPaciente '${appaterno.toUpperCase()}','${apmaterno.toUpperCase()}','${nombres.toUpperCase()}','${fecnac}','${cod_ubigeo}','${docide}','${numdoc}','${dirpac}','${cod_ubigeo2}','${correo.toUpperCase()}','${telefono.trim()}', '${celular}','${numhijos}','${numdep}','${pcd}','${nombreFoto}','${nombreHuella}','${nombreFirma}','${sexo_id}','${grainst_id}','${estciv_id}','${codtipcon}','${ippais}','${usenam}','${codrolUser}','${inputid}','${dir_nrodpptoint}','${nom_urba}'`);

        res.json(response.recordset);
    },

    async deletepaciente(req, res) {
        try {
            const seleccionados = req.body;
            const detalleJson = JSON.stringify(seleccionados);
            const codrol = req.user.codrol;
            const pool = await getConnection();
            const request = pool.request();
            const PROCEDURE_NAME = 'sp_delPaciente';
            request.input('codrol', sql.Int, codrol);
            request.input('PacientesJson', sql.NVarChar(sql.MAX), detalleJson);
            const result = await request.execute(PROCEDURE_NAME);
            pool.close();
            res.json(result.recordset);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
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
        const { inputid, cli_id, codpro_id, valapt_id, pachis, fecprocitaDate, fecprocitaTime, obscita, cargo_actual, fecing_cargo, area_actual, fecing_area, fecing_empresa, altilab_id, superf_id, tipseg_id, cond_vehiculo, ope_equipo_pesado, envresult_correo, com_info_medica, ent_result_fisico, usa_firma_formatos, res_lugar_trabajo } = req.body;
        const usenam = req.user.usuario;
        const hostname = '';
        const codrolUser = req.user.codrol;

        const pool = await getConnection();
        const response = await pool.query(`pa_InsCita '${pachis}', ${valapt_id}, ${cli_id}, ${codpro_id}, '${fecprocitaDate}','${fecprocitaTime}', '${area_actual.toUpperCase()}.', '${fecing_area}', '${cargo_actual.toUpperCase()}', '${fecing_cargo}', '${fecing_empresa}', '${ope_equipo_pesado}', '${cond_vehiculo}', '${envresult_correo}', '${com_info_medica}', '${ent_result_fisico}', '${usa_firma_formatos}', '${res_lugar_trabajo}', ${altilab_id}, ${superf_id}, ${tipseg_id}, '${obscita.toUpperCase()}', ${codrolUser}, '${usenam}', '${inputid}'`);
        res.json(response.recordset);
    },
    async getListaCitas(req, res) {//listar las citas
        try {
            let { fecini, fecfin, paciente, parametro3, parametro4, parametro5, parametro6 } = req.query;
            const codrolUser = req.user.codrol;
            if (paciente === '') {
                paciente = '%';
            }

            const pool = await getConnection();
            console.log(`pa_selCitas '${fecini}','${fecfin}','${paciente}','${parametro3}','${parametro4}','${parametro5}','${parametro6}','${codrolUser}'`)
            const response = await pool.query(`pa_selCitas '${fecini}','${fecfin}','${paciente}','${parametro3}','${parametro4}','${parametro5}','${parametro6}','${codrolUser}'`);
            res.json(response.recordset);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },
    async delcita(req, res) {
        try {
            const seleccionados = req.body;
            const detalleJson = JSON.stringify(seleccionados);
            const codrol = req.user.codrol;
            const pool = await getConnection();
            const request = pool.request();
            const PROCEDURE_NAME = 'pa_DelCita';
            request.input('codrol', sql.Int, codrol);
            request.input('CitaJson', sql.NVarChar(sql.MAX), detalleJson);
            const result = await request.execute(PROCEDURE_NAME);
            pool.close();
            res.json(result.recordset);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },
    async getListaHojaRutaC(req, res) {//listar hoja de ruta cabecera
        let { idcita } = req.body;
        const codrolUser = req.user.codrol;
        const pool = await getConnection();
        const response = await pool.query(`pa_SelHojaRuta_Cab ${idcita},${codrolUser}`);
        res.json(response.recordset);
    },
    async getListaHojaRutaD(req, res) {//listar hoja de ruta detalle
        let { idcita } = req.body;
        const pool = await getConnection();
        const response = await pool.query(`pa_SelHojaRuta_det ${idcita}`);
        res.json(response.recordset);
    },
    async getempresaCita(req, res) {
        const empresa = req.query.empresa;
        const codrol = req.user.codrol;
        const pool = await getConnection();
        const empresas = await pool.query(`sp_selCliente '${empresa}','${codrol}'`);
        res.json(empresas.recordset);
    },
    async getListaConsetimientoInf(req, res) {//listar cosentimiento informado
        let { idcita } = req.body;
        const codrolUser = req.user.codrol;
        const pool = await getConnection();

        const response = await pool.query(`SET Language 'Spanish';EXEC pa_SelConsentimiento_Inf ${idcita},${codrolUser}`);
        res.json(response.recordset);
    },
    /*************************/
    /************Examenes*************/
    async getListaExamenes(req, res) {//listar los examenes        
        let { busqueda,soexa } = req.query;
        const pool = await getConnection();
        const response = await pool.query(`pa_selExamenes '${busqueda}','${soexa}'`);        
        res.json(response.recordset);
    },
    async postExamenes(req, res) {//insertar examenes
        const { desexa, ordimp, ordprot, starep, staaddfile, reg_cie10, inputid } = req.body;
        const codrolUser = req.user.codrol;
        const hostname = '';
        const usenam = req.user.usuario;
        const pool = await getConnection();
        const response = await pool.query(`pa_InsExamenes '${desexa}','${ordimp}','${ordprot}','${starep}','${staaddfile}','${reg_cie10}','${codrolUser}','${usenam}','${hostname}','${inputid}'`);
        res.json(response.recordset);
    },
    async delexamen(req, res) {
        try {
            const seleccionados = req.body;
            const detalleJson = JSON.stringify(seleccionados);
            const codrol = req.user.codrol;
            const pool = await getConnection();
            const request = pool.request();
            const PROCEDURE_NAME = 'pa_DelExamenes';
            request.input('codrol', sql.Int, codrol);
            console.log(codrol,detalleJson);
            request.input('ExamenesJson', sql.NVarChar(sql.MAX), detalleJson);
            const result = await request.execute(PROCEDURE_NAME);
            pool.close();
            res.json(result.recordset);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },
    /*************************/

    /************MEDICOS*************/

    async postmedico(req, res) {//agregar medico
        const { medap, medam, mednam, docide, nundoc, med_cmp, med_rne, medTelfij, medcel, med_correo, meddir, esp_id, inputid, picmed } = req.body;
        const usenam = req.user.usuario;
        const hostname = '';
        const codrolUser = req.user.codrol;
        const imagenBase64 = picmed;
        const rutaSalida = path.join(__dirname, '..', 'public', 'img', 'medicos', nundoc + '.webp');
        if (fs.existsSync(rutaSalida)) {
            fs.unlinkSync(rutaSalida)
        }
        const imagenBase64SinPrefijo = imagenBase64.replace(/^data:image\/png;base64,/, '');
        const imagenBinaria = Buffer.from(imagenBase64SinPrefijo, 'base64');
        await sharp(imagenBinaria)
            .toFormat('webp')
            .toFile(rutaSalida);
        const pool = await getConnection();
        const response = await pool.query(`pa_InsMedico '${medap.toUpperCase()}',${medam.toUpperCase()},'${mednam.toUpperCase()}','${docide}','${nundoc}','${med_cmp}','${med_rne}','${medTelfij.trim()}','${medcel}','${med_correo.toUpperCase()}','${meddir}','${esp_id}','${usenam}','${hostname}','${codrolUser}','${inputid}'`);

        res.json(response.recordset);
    },

    async getmedicolist(req, res) {//listar medicos
        let parametro = req.query.parametro;
        let parametro1 = req.query.parametro1;
        const codrolUser = req.user.codrol;
        if (parametro1 === '') {
            parametro1 = '%';
        }
        const pool = await getConnection();
        const response = await pool.query(`pa_selMedico  '${codrolUser}','${parametro}','${parametro1}'`);
        res.json(response.recordset);
    },
    async deletemedico(req, res) {
        try {
            const seleccionados = req.body;
            const detalleJson = JSON.stringify(seleccionados);
            const codrol = req.user.codrol;
            const pool = await getConnection();
            const request = pool.request();
            const PROCEDURE_NAME = 'pa_delMedico';
            request.input('codrol', sql.Int, codrol);
            request.input('MedicosJson', sql.NVarChar(sql.MAX), detalleJson);
            const result = await request.execute(PROCEDURE_NAME);
            pool.close();
            res.json(result.recordset);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },

    /*************Cliente***************/
    async postcliente(req, res) {//agregar cliente
        const { docide, NumDoc, razsoc, actividad_economica, Direccion, contacto, emailcon, celular, telefono, emailmedocu, forpag_id, cadcermed, incfirmmedexa, Incfirpacexa, Inchuepacexa, Incfordatper, incdecjur, Incfirhueforadi, creusucatocu, Encorvctocert, envcorusuexi, notinfmed_medocu, notinfmedpac, opc, piccli } = req.body;
        const usenam = req.user.usuario;
        const hostname = '';
        const codrolUser = req.user.codrol;
        const imagenBase64 = piccli;
        const rutaSalida = path.join(__dirname, '..', 'public', 'img', 'cliente', NumDoc + '.webp');
        if (fs.existsSync(rutaSalida)) {
            fs.unlinkSync(rutaSalida)
        }
        const imagenBase64SinPrefijo = imagenBase64.replace(/^data:image\/png;base64,/, '');
        const imagenBinaria = Buffer.from(imagenBase64SinPrefijo, 'base64');
        await sharp(imagenBinaria)
            .toFormat('webp')
            .toFile(rutaSalida);
        const pool = await getConnection();
        const response = await pool.query(`pa_InsCliente '${razsoc.toUpperCase()}','${docide}','${NumDoc}','${Direccion}','${telefono}','${emailcon}','${contacto}','${celular}','${emailmedocu}','${forpag_id}','${usenam}','${cadcermed}','${incfirmmedexa}','${Incfirpacexa}','${Inchuepacexa}','${Incfordatper}','${incdecjur}','${Incfirhueforadi}','${creusucatocu}','${Encorvctocert}','${envcorusuexi}','${notinfmed_medocu}','${notinfmedpac}','${actividad_economica}','${codrolUser}','${opc}'`);
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
        const { dni } = req.body;
        const codrolUser = req.user.codrol;
        const pool = await getConnection();
        const response = await pool.query(`pa_delCliente '${codrolUser}','${dni}'`);
        res.json(response.recordset);
    },
    /*************Equipos***************/
    async getequipos(req, res) {//listar equipos
        const { opc, equipos } = req.query;
        const pool = await getConnection();
        const response = await pool.query(`pa_SelEquiposForm '','${equipos}','${opc}'`);
        res.json(response.recordset);
    },
    async postequipos(req, res) {//agregar equipo
        const { inputid, marca, modelo, soexa, desequi, feccali, fecfab } = req.body;
        const usenam = req.user.usuario;
        const codrolUser = req.user.codrol;
        const pool = await getConnection();
        const response = await pool.query(`pa_InsEquipos ${inputid}, '${marca}', '${modelo}', '${soexa}', '${desequi}','${feccali}', '${fecfab}', ${codrolUser}, '${usenam}'`);
        res.json(response.recordset);
    },
    async deleteequipos(req, res) {
        try {
            const seleccionados = req.body;
            const detalleJson = JSON.stringify(seleccionados);
            const codrol = req.user.codrol;
            const pool = await getConnection();
            const request = pool.request();
            const PROCEDURE_NAME = 'pa_DelEquipos';
            request.input('codrol', sql.Int, codrol);
            request.input('EquiposJson', sql.NVarChar(sql.MAX), detalleJson);
            const result = await request.execute(PROCEDURE_NAME);
            pool.close();
            res.json(result.recordset);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },
    /**************************************/
};
