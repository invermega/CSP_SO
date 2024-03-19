const { getConnection } = require('../database/conexionsql');
const sql = require('mssql');
const fs = require('fs').promises;

const path = require('path');
const mustache = require('mustache');

function obtenerArray(dataJSON, propiedad) {
    let resultado = "";
    dataJSON.forEach((obj) => {
        resultado = obj[propiedad];
    });
    return resultado;
}


module.exports = {
    /*****************Pacientes citados*****************/
    async getcmbexamen(req, res) {
        const pool = await getConnection();
        const examenes = await pool.query(`pa_SelCmbExamenes`);
        res.json(examenes.recordset);
    },
    async getpacientescitados(req, res) {
        let { fechainicio, fechafin, paciente, estado, examen } = req.query;
        if (paciente === '') {
            paciente = '%';
        }
        const pool = await getConnection();
        const pacientescitados = await pool.query(`pa_SelPacientesCitados '${fechainicio}','${fechafin}','${paciente}','${estado}','${examen}'`);
        if (pacientescitados.recordset === undefined) {
            res.json([]);
        } else {
            res.json(pacientescitados.recordset);
        }
    },
    async getpacienteexamen(req, res) {
        const { id } = req.params;
        const pool = await getConnection();
        const pruebas = await pool.query(`pa_SelPacienteExamen '${id}'`);
        res.json(pruebas.recordset);
    },
    async getarbolpruebas(req, res) {
        const { id } = req.params;
        const pool = await getConnection();
        const pruebas = await pool.query(`pa_SelMenuExamenes '${id}'`);
        res.json(pruebas.recordset);
    },
    async getcie10(req, res) {
        let { cie10 } = req.query;
        const codrolUser = req.user.codrol;
        const pool = await getConnection();
        const cie10unique = await pool.query(`pa_Selcie10unique '${cie10}','${codrolUser}'`);
        res.json(cie10unique.recordset);
    },
    async getcie10list(req, res) {
        let { cie10 } = req.query;
        const codrolUser = req.user.codrol;
        const pool = await getConnection();
        const cie10list = await pool.query(`pa_Selcie10list '${cie10}','${codrolUser}'`);
        res.json(cie10list.recordset);
    },
    async postdocumento(req, res) {
        try {
            const { archivosBase64, cita_id, soexa, codpru_id,tipoExtension } = req.body;
            const codrolUser = req.user.codrol;
            const pool = await getConnection();
            const newArchivo = {
                archivosnombre: [],
                archivosruta: []

            };

            for (const nombreArchivo in archivosBase64) {
                const base64Data = archivosBase64[nombreArchivo];
                const imagenBase64SinPrefijo = base64Data.replace(/^data:.*;base64,/, '');
                const buffer = Buffer.from(imagenBase64SinPrefijo, 'base64');

                // Modificar el nombre del archivo
                //const nombreModificado = `${soexa}_${codpru_id}_${cita_id}.pdf`;
                let nombreModificado;
                nombreModificado = `${soexa}_${codpru_id}_${cita_id}.${tipoExtension}`;


                // Guardar el archivo en el sistema de archivos
                const rutaArchivo = path.join(__dirname, '..', 'public', 'documentos', nombreModificado);
                const rutaArchivo1 = `/documentos/${soexa}_${codpru_id}_${cita_id}.${tipoExtension}`;
                fs.writeFile(rutaArchivo, buffer, async (err) => {
                    if (err) {
                        console.error(`Error al guardar ${nombreModificado}:`, err);
                    } else {
                        // Convertir la imagen a formato WebP usando sharp
                        const rutaSalida = path.join(__dirname, 'ruta-de-salida', 'nombre-de-salida.webp');
                        await sharp(buffer)
                            .toFormat('pdf')
                            .toFile(rutaSalida);
                    }
                });
                newArchivo.archivosnombre.push(nombreArchivo);
                newArchivo.archivosruta.push(rutaArchivo1);
            }
            const archivosnombreSeparadosPorComas = newArchivo.archivosnombre.join(',');
            const archivosrutaSeparadosPorComas = newArchivo.archivosruta.join(',');
            const documento = await pool.query(`pa_InsDocumento '${archivosnombreSeparadosPorComas}','${archivosrutaSeparadosPorComas}','${codrolUser}'`);
            res.json(documento.recordset);
        } catch (error) {
            console.error("Error en la función postDocumento:", error);
            res.status(500).json({ error: "Error en el servidor" });
        }
    },
    async deldocumento(req, res) {
        try {
            const { doc_adic_id, cita_id, soexa, codpru_id } = req.body;
            const codrolUser = req.user.codrol;

            const nombreModificado = `${soexa}_${codpru_id}_${cita_id}.pdf`;
            const rutaArchivo = path.join(__dirname, '..', 'public', 'documentos', nombreModificado);
            fs.unlink(rutaArchivo, async (err) => {
                if (err) {
                    console.error(`Error al eliminar el archivo: ${err}`);
                } else {
                    console.log(`Archivo eliminado con éxito: ${rutaArchivo}`);
                }
            });
            const pool = await getConnection();
            const documento = await pool.query(`pa_DelDocumento '${doc_adic_id}','${codrolUser}'`);
            res.json(documento.recordset);

        } catch (error) {
            console.error("Error en la función postDocumento:", error);
            res.status(500).json({ error: "Error en el servidor" });
        }
    },
    async getresultsignosvitales(req, res) {
        let { cita_id, soexa } = req.query;
        const pool = await getConnection();
        const result = await pool.query(`pa_SelResultSignosVitales '${cita_id}','${soexa}'`);
        res.json(result.recordset);
    },
    async postsignosvitales(req, res) {
        try {
            const { cita_id, nuncom, soexa, codpru_id, fc, fr, pa, sato2, peso, talla, imc, peab, temp, datains, doc_adic_id, datainsrec } = req.body;
            console.log(cita_id, nuncom, soexa, codpru_id, fc, fr, pa, sato2, peso, talla, imc, peab, temp, datains, doc_adic_id, datainsrec)
            const usenam = req.user.usuario;
            const hostname = '';
            const codrol = req.user.codrol;
            const med_id = req.user.med_id;
            const detalleJsoncie10 = JSON.stringify(datains);
            const detalleJsonrecomen = JSON.stringify(datainsrec);
            const pool = await getConnection();
            const request = pool.request();
            const PROCEDURE_NAME = 'pa_InsPbSignosVitales';
            request.input('cita_id', sql.Int, cita_id);
            request.input('nuncom', sql.Int, nuncom);
            request.input('soexa', sql.VarChar(6), soexa);
            request.input('codpru_id', sql.Int, codpru_id);
            request.input('med_id', sql.Int, med_id);
            request.input('fc', sql.VarChar(20), fc);
            request.input('fr', sql.VarChar(20), fr);
            request.input('pa', sql.VarChar(20), pa);
            request.input('sato2', sql.VarChar(20), sato2);
            request.input('peso', sql.VarChar(20), peso);
            request.input('talla', sql.VarChar(20), talla);
            request.input('imc', sql.VarChar(20), imc);
            request.input('peab', sql.VarChar(20), peab);
            request.input('temp', sql.VarChar(20), temp);
            request.input('doc_adic_id', sql.Int, doc_adic_id);
            request.input('usenam', sql.VarChar(30), usenam);
            request.input('hostname', sql.VarChar(20), hostname);
            request.input('codrol', sql.Int, codrol);
            request.input('detalleJsoncie10', sql.NVarChar(sql.MAX), detalleJsoncie10);
            request.input('detalleJsonrecomen', sql.NVarChar(sql.MAX), detalleJsonrecomen);
            const result = await request.execute(PROCEDURE_NAME);
            pool.close();
            res.json(result.recordset);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },
    async getpruebascards(req, res) {
        let { soexa, cita_id } = req.query;
        console.log(soexa, cita_id);
        const pool = await getConnection();
        const pruebas = await pool.query(`pa_SelPruebasPorExamen '${soexa}','${cita_id}'`);
        res.json(pruebas.recordset);
    },
    async getparametros(req, res) {
        let { codpru_id, nuncom,pachis } = req.query;
        console.log(codpru_id, nuncom);
        const pool = await getConnection();
        const parametros = await pool.query(`pa_selparametroslab '${codpru_id}','${nuncom}',${pachis}`);
        console.log(parametros.recordset);
        res.json(parametros.recordset);
    },
    async postlaboratorio(req, res) {
        try {
            const { cita_id, nuncom, soexa, codpru_id, doc_adic_id, datains, datainsrec, dataparametros } = req.body;
            console.log(cita_id, nuncom, soexa, codpru_id, doc_adic_id, datains, datainsrec, dataparametros);
            const usenam = req.user.usuario;
            const hostname = '';
            const codrol = req.user.codrol;
            const med_id = req.user.med_id;
            const detalleJsoncie10 = JSON.stringify(datains);
            const detalleJsonrecomen = JSON.stringify(datainsrec);
            const detalleJsonparametros = JSON.stringify(dataparametros);
            const pool = await getConnection();
            const request = pool.request();
            const PROCEDURE_NAME = 'pa_InsPbLaboratorio';
            request.input('cita_id', sql.Int, cita_id);
            request.input('nuncom', sql.Int, nuncom);
            request.input('soexa', sql.VarChar(6), soexa);
            request.input('codpru_id', sql.Int, codpru_id);
            request.input('med_id', sql.Int, med_id);
            request.input('doc_adic_id', sql.Int, doc_adic_id);
            request.input('usenam', sql.VarChar(30), usenam);
            request.input('hostname', sql.VarChar(20), hostname);
            request.input('codrol', sql.Int, codrol);
            request.input('detalleJsoncie10', sql.NVarChar(sql.MAX), detalleJsoncie10);
            request.input('detalleJsonrecomen', sql.NVarChar(sql.MAX), detalleJsonrecomen);
            request.input('detalleJsonparametros', sql.NVarChar(sql.MAX), detalleJsonparametros);
            const result = await request.execute(PROCEDURE_NAME);
            pool.close();
            res.json(result.recordset);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },
    async getresultlaboratorio(req, res) {
        let { cita_id, soexa } = req.query;
        const pool = await getConnection();
        const result = await pool.query(`pa_SelResultlaboratorio '${cita_id}','${soexa}'`);
        res.json(result.recordset);
    },

    /**************** Espirometria ***********************/
    async getparametrosespiro(req, res) {
        let { codpru_id, nuncom } = req.query;
        const pool = await getConnection();
        const parametros = await pool.query(`pa_SelParametrosEspiro ${codpru_id},${nuncom}`);
        res.json(parametros.recordset);
    },
    async postespirometria(req, res) {
        try {
            const { cita_id, nuncom, soexa, codpru_id, doc_adic_id, datains, datainsrec, dataparametros } = req.body;
            const usenam = req.user.usuario;
            const hostname = '';
            const codrol = req.user.codrol;
            const med_id = req.user.med_id;
            const detalleJsoncie10 = JSON.stringify(datains);
            const detalleJsonrecomen = JSON.stringify(datainsrec);
            const detalleJsonparametros = JSON.stringify(dataparametros);
            const pool = await getConnection();
            const request = pool.request();
            const PROCEDURE_NAME = 'pa_InsPbEspirometria';
            request.input('cita_id', sql.Int, cita_id);
            request.input('nuncom', sql.Int, nuncom);
            request.input('soexa', sql.VarChar(6), soexa);
            request.input('codpru_id', sql.Int, codpru_id);
            request.input('med_id', sql.Int, med_id);
            request.input('doc_adic_id', sql.Int, doc_adic_id);
            request.input('usenam', sql.VarChar(30), usenam);
            request.input('hostname', sql.VarChar(20), hostname);
            request.input('codrol', sql.Int, codrol);
            request.input('detalleJsoncie10', sql.NVarChar(sql.MAX), detalleJsoncie10);
            request.input('detalleJsonrecomen', sql.NVarChar(sql.MAX), detalleJsonrecomen);
            request.input('detalleJsonespiro', sql.NVarChar(sql.MAX), detalleJsonparametros);
            const result = await request.execute(PROCEDURE_NAME);
            pool.close();
            res.json(result.recordset);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },
    async getresultespirometria(req, res) {
        let { cita_id, soexa } = req.query;
        const pool = await getConnection();
        const result = await pool.query(`pa_SelResultespirometria '${cita_id}','${soexa}'`);
        res.json(result.recordset);
    },
    /************************************************/
    /*************** Ficha Musculo Esqueletica *****************/
    async getresultfichamusculoesqueletica(req, res) {
        let { cita_id, soexa } = req.query;
        const pool = await getConnection();
        const result = await pool.query(`pa_SelResultFichaMusculoesqueletica '${cita_id}','${soexa}'`);
        res.json(result.recordset);
    },
    async postfichamusculoesqueletica(req, res) {
        try {
            const { cita_id, nuncom, soexa, codpru_id, aptitud_espalda, flex_fuerza, rangos_articulares, datains, doc_adic_id, datainsrec } = req.body;

            const usenam = req.user.usuario;
            const hostname = '';
            const codrol = req.user.codrol;
            const med_id = req.user.med_id;
            const detalleJsoncie10 = JSON.stringify(datains);
            const detalleJsonrecomen = JSON.stringify(datainsrec);
            const detalleJsonflex_fuerza = JSON.stringify(flex_fuerza);
            const detalleJsonrangos_articulares = JSON.stringify(rangos_articulares);
            const pool = await getConnection();
            const request = pool.request();
            const PROCEDURE_NAME = 'pa_InsPbFichaMusculoEsqueletica';
            request.input('cita_id', sql.Int, cita_id);
            request.input('nuncom', sql.Int, nuncom);
            request.input('soexa', sql.VarChar(6), soexa);
            request.input('codpru_id', sql.Int, codpru_id);
            request.input('med_id', sql.Int, med_id);
            request.input('doc_adic_id', sql.Int, doc_adic_id);
            request.input('usenam', sql.VarChar(30), usenam);
            request.input('hostname', sql.VarChar(20), hostname);
            request.input('codrol', sql.Int, codrol);
            request.input('detalleJsoncie10', sql.NVarChar(sql.MAX), detalleJsoncie10);
            request.input('detalleJsonrecomen', sql.NVarChar(sql.MAX), detalleJsonrecomen);
            request.input('aptitud_espalda', sql.VarChar(40), aptitud_espalda);
            request.input('flex_fuerza', sql.VarChar(sql.MAX), detalleJsonflex_fuerza);
            request.input('rangos_articulares', sql.VarChar(sql.MAX), detalleJsonrangos_articulares);
            const result = await request.execute(PROCEDURE_NAME);
            pool.close();
            res.json(result.recordset);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },
    /***************************************************/
    /*************** Cuestionario Espirometria *****************/
    async postcuestionarioespiromeria(req, res) {
        try {
            const { cita_id, nuncom, soexa, codpru_id, doc_adic_id, datains, datainsrec, dataparametros } = req.body;
            const usenam = req.user.usuario;
            const hostname = '';
            const codrol = req.user.codrol;
            const med_id = req.user.med_id;
            const detalleJsoncie10 = JSON.stringify(datains);
            const detalleJsonrecomen = JSON.stringify(datainsrec);
            const detalleJsonparametros = JSON.stringify(dataparametros);
            const pool = await getConnection();
            const request = pool.request();
            const PROCEDURE_NAME = 'pa_InsPbCuestionarioEspirometria';
            request.input('cita_id', sql.Int, cita_id);
            request.input('nuncom', sql.Int, nuncom);
            request.input('soexa', sql.VarChar(6), soexa);
            request.input('codpru_id', sql.Int, codpru_id);
            request.input('med_id', sql.Int, med_id);
            request.input('doc_adic_id', sql.Int, doc_adic_id);
            request.input('usenam', sql.VarChar(30), usenam);
            request.input('hostname', sql.VarChar(20), hostname);
            request.input('codrol', sql.Int, codrol);
            request.input('detalleJsoncie10', sql.NVarChar(sql.MAX), detalleJsoncie10);
            request.input('detalleJsonrecomen', sql.NVarChar(sql.MAX), detalleJsonrecomen);
            request.input('detalleJsoncuestionarioespiro', sql.NVarChar(sql.MAX), detalleJsonparametros);
            const result = await request.execute(PROCEDURE_NAME);
            pool.close();
            res.json(result.recordset);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },
    async getresultcuestionarioespirometria(req, res) {
        let { cita_id, soexa } = req.query;
        const pool = await getConnection();
        const result = await pool.query(`pa_SelResultCuestionarioEspirometria '${cita_id}','${soexa}'`);
        res.json(result.recordset);
    },
    /***************************************************/
    /**************** Psicologia ******************/
    async postpsicologia(req, res) {
        try {

            const { cita_id, nuncom, soexa, codpru_id, doc_adic_id, datains, datainsrec, cod_present, cod_postura, dis_ritmo, dis_tono, dis_articulacion, ori_tiempo, ori_espacio, ori_persona, pro_cog_lucido_atento, pro_cog_pensamiento, pro_cog_percepcion, pro_cog_memoria, pro_cog_inteligencia, pro_cog_apetito, pro_cog_sueño, re_nivel_inte, re_coord_visomotriz, re_nivel_memoria, re_personalidad, re_afectividad, con_area_cognitiva, con_area_emocional, tipresult_id, dataparametros, mot_eva, tiem_lab, prin_riesgos, med_seguridad, dataantrelacionados, historia_familiar, accid_enfer, habitos, otras_observ } = req.body;

            const usenam = req.user.usuario;
            const hostname = '';
            const codrol = req.user.codrol;
            const med_id = req.user.med_id;
            const detalleJsoncie10 = JSON.stringify(datains);
            const detalleJsonrecomen = JSON.stringify(datainsrec);
            const detalleJsonparametros = JSON.stringify(dataparametros);
            const detalleJstonant_empresas = JSON.stringify(dataantrelacionados);



            console.log(tipresult_id);

            const pool = await getConnection();
            const request = pool.request();
            const PROCEDURE_NAME = 'pa_InsPbPsicologia';
            request.input('cita_id', sql.Int, cita_id);
            request.input('nuncom', sql.Int, nuncom);
            request.input('soexa', sql.VarChar(6), soexa);
            request.input('codpru_id', sql.Int, codpru_id);
            request.input('med_id', sql.Int, med_id);
            request.input('doc_adic_id', sql.Int, doc_adic_id);
            request.input('usenam', sql.VarChar(30), usenam);
            request.input('hostname', sql.VarChar(20), hostname);
            request.input('codrol', sql.Int, codrol);
            request.input('detalleJsoncie10', sql.NVarChar(sql.MAX), detalleJsoncie10);
            request.input('detalleJsonrecomen', sql.NVarChar(sql.MAX), detalleJsonrecomen);
            request.input('cod_present', sql.VarChar(60), cod_present);
            request.input('cod_postura', sql.VarChar(60), cod_postura);
            request.input('dis_ritmo', sql.VarChar(60), dis_ritmo);
            request.input('dis_tono', sql.VarChar(60), dis_tono);
            request.input('dis_articulacion', sql.VarChar(60), dis_articulacion);
            request.input('ori_tiempo', sql.VarChar(60), ori_tiempo);
            request.input('ori_espacio', sql.VarChar(60), ori_espacio);
            request.input('ori_persona', sql.VarChar(60), ori_persona);
            request.input('pro_cog_lucido_atento', sql.VarChar(60), pro_cog_lucido_atento);
            request.input('pro_cog_pensamiento', sql.VarChar(60), pro_cog_pensamiento);
            request.input('pro_cog_percepcion', sql.VarChar(60), pro_cog_percepcion);
            request.input('pro_cog_memoria', sql.VarChar(60), pro_cog_memoria);
            request.input('pro_cog_inteligencia', sql.VarChar(60), pro_cog_inteligencia);
            request.input('pro_cog_apetito', sql.VarChar(20), pro_cog_apetito);
            request.input('pro_cog_sueño', sql.VarChar(20), pro_cog_sueño);
            request.input('re_nivel_inte', sql.VarChar(20), re_nivel_inte);
            request.input('re_coord_visomotriz', sql.VarChar(60), re_coord_visomotriz);
            request.input('re_nivel_memoria', sql.VarChar(20), re_nivel_memoria);
            request.input('re_personalidad', sql.VarChar(80), re_personalidad);
            request.input('re_afectividad', sql.VarChar(20), re_afectividad);
            request.input('con_area_cognitiva', sql.VarChar(sql.MAX), con_area_cognitiva);
            request.input('con_area_emocional', sql.VarChar(sql.MAX), con_area_emocional);
            request.input('tipresult_id', sql.Int, tipresult_id);
            request.input('detalleJsonpsicodet', sql.NVarChar(sql.MAX), detalleJsonparametros);
            request.input('mot_eva', sql.VarChar(100), mot_eva);
            request.input('tiem_lab', sql.VarChar(20), tiem_lab);
            request.input('prin_riesgos', sql.VarChar(200), prin_riesgos);
            request.input('med_seguridad', sql.VarChar(200), med_seguridad);
            request.input('detalleJsonant_empresas', sql.NVarChar(sql.MAX), detalleJstonant_empresas);
            request.input('historia_familiar', sql.VarChar(sql.MAX), historia_familiar);
            request.input('accid_enfer', sql.VarChar(sql.MAX), accid_enfer);
            request.input('habitos', sql.VarChar(sql.MAX), habitos);
            request.input('otras_observ', sql.VarChar(sql.MAX), otras_observ);


            const result = await request.execute(PROCEDURE_NAME);
            pool.close();
            res.json(result.recordset);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },
    async getresultpsicologia(req, res) {
        let { cita_id, soexa } = req.query;
        const pool = await getConnection();
        const result = await pool.query(`pa_SelResultPsicologia '${cita_id}','${soexa}'`);
        res.json(result.recordset);
    },
    async getpsicologiatest(req, res) {
        let { cita_id, soexa } = req.query;
        const pool = await getConnection();
        const result = await pool.query(`pa_SelTablaPsicologiaTest '${cita_id}','${soexa}'`);
        res.json(result.recordset);
    },
    /**************** Audiometria ******************/
    async getequipos(req, res) {
        let { codpru_id, opc, equipos } = req.query;
        const pool = await getConnection();
        const result = await pool.query(`pa_SelEquiposForm '${codpru_id}','${equipos}','${opc}'`);
        res.json(result.recordset);
    },
    async postaudiometria(req, res) {
        try {
            const { cita_id, nuncom, soexa, codpru_id, equi_id, tiem_exp_hrs, uso_pro_uditivo, apre_ruido, ante_relacionados, sintomas_actuales, otos_oido_derecho, otos_oido_izquierdo, logoaudiometria_oido_der, logoaudiometria_oido_izq, val_oido_derecho, val_oido_izquierdo, datains, doc_adic_id, datainsrec } = req.body;

            const usenam = req.user.usuario;
            const hostname = '';
            const codrol = req.user.codrol;
            const med_id = req.user.med_id;
            const detalleJsoncie10 = JSON.stringify(datains);
            const detalleJsonrecomen = JSON.stringify(datainsrec);
            const detalleJsonante_relacionados = JSON.stringify(ante_relacionados);
            const detalleJsonsintomas_actuales = JSON.stringify(sintomas_actuales);
            const detalleJsonotos_oido_derecho = JSON.stringify(otos_oido_derecho);
            const detalleJsonotos_oido_izquierdo = JSON.stringify(otos_oido_izquierdo);
            const detalleJsonval_oido_derecho = JSON.stringify(val_oido_derecho);
            const detalleJsonval_oido_izquierdo = JSON.stringify(val_oido_izquierdo);
            const pool = await getConnection();
            const request = pool.request();
            const PROCEDURE_NAME = 'pa_InsPbAudiometria';
            request.input('cita_id', sql.Int, cita_id);
            request.input('nuncom', sql.Int, nuncom);
            request.input('soexa', sql.VarChar(6), soexa);
            request.input('codpru_id', sql.Int, codpru_id);
            request.input('med_id', sql.Int, med_id);
            request.input('doc_adic_id', sql.Int, doc_adic_id);
            request.input('usenam', sql.VarChar(30), usenam);
            request.input('hostname', sql.VarChar(20), hostname);
            request.input('codrol', sql.Int, codrol);
            request.input('detalleJsoncie10', sql.NVarChar(sql.MAX), detalleJsoncie10);
            request.input('detalleJsonrecomen', sql.NVarChar(sql.MAX), detalleJsonrecomen);
            request.input('equi_id', sql.Int, equi_id);
            request.input('tiem_exp_hrs', sql.Int, tiem_exp_hrs);
            request.input('uso_pro_uditivo', sql.VarChar(40), uso_pro_uditivo);
            request.input('apre_ruido', sql.VarChar(40), apre_ruido);
            request.input('ante_relacionados', sql.VarChar(sql.MAX), detalleJsonante_relacionados);
            request.input('sintomas_actuales', sql.VarChar(sql.MAX), detalleJsonsintomas_actuales);
            request.input('otos_oido_derecho', sql.VarChar(sql.MAX), detalleJsonotos_oido_derecho);
            request.input('otos_oido_izquierdo', sql.VarChar(sql.MAX), detalleJsonotos_oido_izquierdo);
            request.input('logoaudiometria_oido_der', sql.Char(2), logoaudiometria_oido_der);
            request.input('logoaudiometria_oido_izq', sql.Char(2), logoaudiometria_oido_izq);
            request.input('val_oido_derecho', sql.VarChar(sql.MAX), detalleJsonval_oido_derecho);
            request.input('val_oido_izquierdo', sql.VarChar(sql.MAX), detalleJsonval_oido_izquierdo);
            const result = await request.execute(PROCEDURE_NAME);
            pool.close();
            res.json(result.recordset);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },
    async getresultaudiometria(req, res) {
        let { cita_id, soexa } = req.query;
        const pool = await getConnection();
        const result = await pool.query(`pa_SelResultAudiometria'${cita_id}','${soexa}'`);
        res.json(result.recordset);
    },
    /*********************************************/
    /**************** Rayos X ******************/
    async getresultparametrosrayosx(req, res) {
        let { cita_id, nuncom, codpru_id } = req.query;
        const pool = await getConnection();
        const result = await pool.query(`pa_SelParametrosRayosX ${codpru_id},${nuncom}`);
        res.json(result.recordset);
    },
    async getresultrayosx(req, res) {
        let { nuncom, soexa } = req.query;
        const pool = await getConnection();
        const result = await pool.query(`pa_SelResultRayosX'${nuncom}','${soexa}'`);
        res.json(result.recordset);
    },
    async postrayosx(req, res) {
        try {
            const { cita_id, nuncom, soexa, codpru_id, codigo_ref, det_informe, conclusion, datains, doc_adic_id, datainsrec } = req.body;

            const usenam = req.user.usuario;
            const hostname = '';
            const codrol = req.user.codrol;
            const med_id = req.user.med_id;
            const detalleJsoncie10 = JSON.stringify(datains);
            const detalleJsonrecomen = JSON.stringify(datainsrec);

            const pool = await getConnection();
            const request = pool.request();
            const PROCEDURE_NAME = 'pa_InsPbRayosX';
            request.input('cita_id', sql.Int, cita_id);
            request.input('nuncom', sql.Int, nuncom);
            request.input('soexa', sql.VarChar(6), soexa);
            request.input('codpru_id', sql.Int, codpru_id);
            request.input('med_id', sql.Int, med_id);
            request.input('doc_adic_id', sql.Int, doc_adic_id);
            request.input('usenam', sql.VarChar(30), usenam);
            request.input('hostname', sql.VarChar(20), hostname);
            request.input('codrol', sql.Int, codrol);
            request.input('detalleJsoncie10', sql.NVarChar(sql.MAX), detalleJsoncie10);
            request.input('detalleJsonrecomen', sql.NVarChar(sql.MAX), detalleJsonrecomen);
            request.input('codigo_ref', sql.VarChar(20), codigo_ref);
            request.input('det_informe', sql.VarChar(sql.MAX), det_informe);
            request.input('conclusion', sql.VarChar(sql.MAX), conclusion);

            const result = await request.execute(PROCEDURE_NAME);
            pool.close();
            res.json(result.recordset);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },
    /*********************************************/

    /**************** ficha 312 ******************/
    async getdatosPacienteFicha312(req, res) {
        let { cita_id } = req.query;
        const pool = await getConnection();
        const result = await pool.query(`pa_SelDatosPacienteFicha312 '${cita_id}'`);
        res.json(result.recordset);
    },
    async getresultfichamedicoocupacional312(req, res) {
        let { cita_id, soexa } = req.query;
        const pool = await getConnection();
        const result = await pool.query(`pa_SelResultfichamedicoocupacional312 '${cita_id}','${soexa}'`);
        res.json(result.recordset);
    },
    async postfichamedicoocupacional312(req, res) {
        try {
            const { cita_id, nuncom, soexa, codpru_id, AntecedentesOcupacionales, ap_alergias, ap_RAM, ap_asma, ap_HTA, ap_TBC, ap_diabetes, ap_bronquitis, ap_hepatitis, ap_neoplasia, ap_convulsiones,
                ap_ITS, ap_quemaduras, ap_intoxicaciones, ap_fiebre_tiroidea, ap_cirugias, ap_actividad_fisica, ap_patologia_renal, ap_neumonia, ap_pato_tiroides, ap_fracturas, ap_otros,
                HabitosNocivos, ant_padre, ant_madre, ant_hermanos, ant_esposa, num_hijos_vivos, num_hijos_fallecidos, ant_otros, Absentismo, ev_ananesis, ev_ectoscopia, ev_estado_mental, ExamenFisico,
                con_eva_psicologica, con_radiograficas, con_laboratorio, con_audiometria, con_espirometria, con_otros, Diagnosticos, tipresult_id, Recomendaciones
            } = req.body;
            const usenam = req.user.usuario;
            const hostname = '';
            const codrol = req.user.codrol;
            const med_id = req.user.med_id;
            const detalleJsonAntecedentes = JSON.stringify(AntecedentesOcupacionales);
            const detalleJsonHabitosNocivos = JSON.stringify(HabitosNocivos);
            const detalleJsonAbsentismo = JSON.stringify(Absentismo);
            const detalleJsonExamenFisico = JSON.stringify(ExamenFisico);
            const detalleJsonDiagnosticos = JSON.stringify(Diagnosticos);
            const detalleJsonRecomendaciones = JSON.stringify(Recomendaciones);

            const pool = await getConnection();
            const request = pool.request();
            const PROCEDURE_NAME = 'pa_InsPbFichamedicoocupacional312';
            request.input('cita_id', sql.Int, cita_id);
            request.input('nuncom', sql.Int, nuncom);
            request.input('soexa', sql.VarChar(6), soexa);
            request.input('codpru_id', sql.Int, codpru_id);
            request.input('med_id', sql.Int, med_id);
            request.input('detalleJsonAntecedentes', sql.NVarChar(sql.MAX), detalleJsonAntecedentes);
            request.input('ap_alergias', sql.VarChar(100), ap_alergias);
            request.input('ap_RAM', sql.VarChar(100), ap_RAM);
            request.input('ap_asma', sql.VarChar(100), ap_asma);
            request.input('ap_HTA', sql.VarChar(100), ap_HTA);
            request.input('ap_TBC', sql.VarChar(100), ap_TBC);
            request.input('ap_diabetes', sql.VarChar(100), ap_diabetes);
            request.input('ap_bronquitis', sql.VarChar(100), ap_bronquitis);
            request.input('ap_hepatitis', sql.VarChar(100), ap_hepatitis);
            request.input('ap_neoplasia', sql.VarChar(100), ap_neoplasia);
            request.input('ap_convulsiones', sql.VarChar(100), ap_convulsiones);
            request.input('ap_ITS', sql.VarChar(100), ap_ITS);
            request.input('ap_quemaduras', sql.VarChar(100), ap_quemaduras);
            request.input('ap_intoxicaciones', sql.VarChar(100), ap_intoxicaciones);
            request.input('ap_fiebre_tiroidea', sql.VarChar(100), ap_fiebre_tiroidea);
            request.input('ap_cirugias', sql.VarChar(100), ap_cirugias);
            request.input('ap_actividad_fisica', sql.VarChar(100), ap_actividad_fisica);
            request.input('ap_patologia_renal', sql.VarChar(100), ap_patologia_renal);
            request.input('ap_neumonia', sql.VarChar(100), ap_neumonia);
            request.input('ap_pato_tiroides', sql.VarChar(100), ap_pato_tiroides);
            request.input('ap_fracturas', sql.VarChar(100), ap_fracturas);
            request.input('ap_otros', sql.VarChar(100), ap_otros);
            request.input('detalleJsonHabitosNocivos', sql.NVarChar(sql.MAX), detalleJsonHabitosNocivos);
            request.input('ant_padre', sql.VarChar(sql.MAX), ant_padre);
            request.input('ant_madre', sql.VarChar(sql.MAX), ant_madre);
            request.input('ant_hermanos', sql.VarChar(sql.MAX), ant_hermanos);
            request.input('ant_esposa', sql.VarChar(sql.MAX), ant_esposa);
            request.input('num_hijos_vivos', sql.Int, num_hijos_vivos);
            request.input('num_hijos_fallecidos', sql.Int, num_hijos_fallecidos);
            request.input('ant_otros', sql.VarChar(sql.MAX), ant_otros);
            request.input('detalleJsonAbsentismo', sql.NVarChar(sql.MAX), detalleJsonAbsentismo);
            request.input('ev_ananesis', sql.VarChar(sql.MAX), ev_ananesis);
            request.input('ev_ectoscopia', sql.VarChar(sql.MAX), ev_ectoscopia);
            request.input('ev_estado_mental', sql.VarChar(sql.MAX), ev_estado_mental);
            request.input('detalleJsonExamenFisico', sql.NVarChar(sql.MAX), detalleJsonExamenFisico);
            request.input('con_eva_psicologica', sql.VarChar(sql.MAX), con_eva_psicologica);
            request.input('con_radiograficas', sql.VarChar(sql.MAX), con_radiograficas);
            request.input('con_laboratorio', sql.VarChar(sql.MAX), con_laboratorio);
            request.input('con_audiometria', sql.VarChar(sql.MAX), con_audiometria);
            request.input('con_espirometria', sql.VarChar(sql.MAX), con_espirometria);
            request.input('con_otros', sql.VarChar(sql.MAX), con_otros);
            request.input('detalleJsonDiagnosticos', sql.NVarChar(sql.MAX), detalleJsonDiagnosticos);
            request.input('tipresult_id', sql.Int, tipresult_id);
            request.input('detalleJsonRecomendaciones', sql.NVarChar(sql.MAX), detalleJsonRecomendaciones);
            request.input('usenam', sql.VarChar(30), usenam);
            request.input('hostname', sql.VarChar(20), hostname);
            request.input('codrol', sql.Int, codrol);
            const result = await request.execute(PROCEDURE_NAME);
            pool.close();
            res.json(result.recordset);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },
    async getdatosformatosficha312(req, res) {
        try {
            
            let { cita_id, soexa } = req.query;
            const pool = await getConnection();
            const result = await pool.query(`pa_SelExaFormatos '${cita_id}','${soexa}'`);
            //let response = JSON.stringify(result.recordset);
            let renderedHtml="";
            let rutaArchivo="";
            
            for (const objresponse of result.recordset) {
                let paciente = JSON.parse(objresponse.paciente);
                let { appm_nom, numdoc, fecnac, Edad, des_sexo, destipcon, cargo_actual, razsoc } = paciente[0];
                let cie10 = [];
                let recomendaciones = [];
                if (soexa === '009' && objresponse.resultado !== 'N') {
                    
                    const dataJSON = JSON.parse(objresponse.resultado);
                    let rutaArchivobd = dataJSON[0].rutarch;
                    
                    rutaArchivo=rutaArchivobd;
                    if (dataJSON[0].diagnosticos && dataJSON[0].diagnosticos.length > 0) {
                        dataJSON[0].diagnosticos.forEach((objdiagnosticos) => {
                            let { diacod, diades } = objdiagnosticos;
                            cie10.push({ diacod, diades });
                        });
                    }
                    if (dataJSON[0].recomendaciones && dataJSON[0].recomendaciones.length > 0) {
                        dataJSON[0].recomendaciones.forEach((objrecomendaciones) => {
                            let { desrec, des_control } = objrecomendaciones;
                            recomendaciones.push({ desrec, des_control });
                        });
                    }

                    data = {
                        numdoc: numdoc,
                        appm_nom: appm_nom,
                        fecnac: fecnac,
                        Edad: Edad,
                        des_sexo: des_sexo,
                        cargo_actual: cargo_actual,
                        destipcon: destipcon,
                        razsoc: razsoc,
                        cie10: cie10,
                        recomendaciones: recomendaciones,
                        rows: dataJSON
                    };
                } else if (soexa === '003' && objresponse.resultado !== 'N') {
                    const dataJSON = JSON.parse(objresponse.resultado);
                    const { tiem_exp_hrs, apre_ruido, desequi, fecaten, logoaudiometria_oido_der,
                        logoaudiometria_oido_izq, modelo, feccali, fecing_empresa, uso_pro_uditivo } = dataJSON[0];

                    const ante_relacionadoArray = obtenerArray(dataJSON, "ante_relacionados");
                    const sintomas_actualesArray = obtenerArray(dataJSON, "sintomas_actuales");
                    const otos_oido_derechoArray = obtenerArray(dataJSON, "otos_oido_derecho");
                    const otos_oido_izquierdoArray = obtenerArray(dataJSON, "otos_oido_izquierdo");

                    //inputs
                    const val_oido_derechoArray = obtenerArray(dataJSON, "val_oido_derecho");
                    //Se renomba los numeros a una variable compatible
                    const { '125': VA_D_125, '250': VA_D_250, '500': VA_D_500, '1000': VA_D_1000, '2000': VA_D_2000, '3000': VA_D_3000, '4000': VA_D_4000, '6000': VA_D_6000, '8000': VA_D_8000 } = val_oido_derechoArray[0];
                    const { '125': VO_D_125, '250': VO_D_250, '500': VO_D_500, '1000': VO_D_1000, '2000': VO_D_2000, '3000': VO_D_3000, '4000': VO_D_4000, '6000': VO_D_6000, '8000': VO_D_8000 } = val_oido_derechoArray[1];

                    const val_oido_izquierdoArray = obtenerArray(dataJSON, "val_oido_izquierdo");
                    //Se renomba los numeros a una variable compatible
                    const { '125': VA_E_125, '250': VA_E_250, '500': VA_E_500, '1000': VA_E_1000, '2000': VA_E_2000, '3000': VA_E_3000, '4000': VA_E_4000, '6000': VA_E_6000, '8000': VA_E_8000 } = val_oido_izquierdoArray[0];
                    const { '125': VO_E_125, '250': VO_E_250, '500': VO_E_500, '1000': VO_E_1000, '2000': VO_E_2000, '3000': VO_E_3000, '4000': VO_E_4000, '6000': VO_E_6000, '8000': VO_E_8000 } = val_oido_izquierdoArray[1];

                    let [logoaudiometriaDer, logoaudiometriaIzq] = ['', ''];
                    if (logoaudiometria_oido_der !== 'N') {
                        logoaudiometriaDer = 'APLICA';
                    } else {
                        logoaudiometriaDer = 'NO APLICA'
                    }
                    if (logoaudiometria_oido_izq !== 'N') {
                        logoaudiometriaIzq = 'APLICA';
                    } else {
                        logoaudiometriaIzq = 'NO APLICA';
                    }


                    if (dataJSON[0].diagnosticos && dataJSON[0].diagnosticos.length > 0) {
                        dataJSON[0].diagnosticos.forEach((objdiagnosticos) => {
                            let { diacod, diades } = objdiagnosticos;
                            cie10.push({ diacod, diades });
                        });
                    }
                    if (dataJSON[0].recomendaciones && dataJSON[0].recomendaciones.length > 0) {
                        dataJSON[0].recomendaciones.forEach((objrecomendaciones) => {
                            let { desrec, des_control } = objrecomendaciones;
                            recomendaciones.push({ desrec, des_control });
                        });
                    }
                    data = {
                        numdoc: numdoc,
                        appm_nom: appm_nom,
                        fecnac: fecnac,
                        Edad: Edad,
                        des_sexo: des_sexo,
                        cargo_actual: cargo_actual,
                        destipcon: destipcon,
                        razsoc: razsoc,
                        tiem_exp_hrs: tiem_exp_hrs,
                        apre_ruido: apre_ruido,
                        desequi: desequi,
                        fecaten: fecaten,
                        fecing_empresa: fecing_empresa,
                        logoaudiometriaDer: logoaudiometriaDer,
                        logoaudiometriaIzq: logoaudiometriaIzq,
                        modelo: modelo,
                        feccali: feccali,
                        uso_pro_uditivo: uso_pro_uditivo,
                        cie10: cie10,
                        recomendaciones: recomendaciones,
                        rows: dataJSON,
                        ante_relacionadoArray: ante_relacionadoArray,
                        sintomas_actualesArray: sintomas_actualesArray,
                        otos_oido_derechoArray: otos_oido_derechoArray,
                        otos_oido_izquierdoArray: otos_oido_izquierdoArray,
                        VA_D_125: VA_D_125, VA_D_250: VA_D_250, VA_D_500: VA_D_500, VA_D_1000: VA_D_1000, VA_D_2000: VA_D_2000,
                        VA_D_3000: VA_D_3000, VA_D_4000: VA_D_4000, VA_D_6000: VA_D_6000, VA_D_8000: VA_D_8000,

                        VO_D_125: VO_D_125, VO_D_250: VO_D_250, VO_D_500: VO_D_500, VO_D_1000: VO_D_1000, VO_D_2000: VO_D_2000,
                        VO_D_3000: VO_D_3000, VO_D_4000: VO_D_4000, VO_D_6000: VO_D_6000, VO_D_8000: VO_D_8000,

                        VA_E_125: VA_E_125, VA_E_250: VA_E_250, VA_E_500: VA_E_500, VA_E_1000: VA_E_1000, VA_E_2000: VA_E_2000,
                        VA_E_3000: VA_E_3000, VA_E_4000: VA_E_4000, VA_E_6000: VA_E_6000, VA_E_8000: VA_E_8000,

                        VO_E_125: VO_E_125, VO_E_250: VO_E_250, VO_E_500: VO_E_500, VO_E_1000: VO_E_1000, VO_E_2000: VO_E_2000,
                        VO_E_3000: VO_E_3000, VO_E_4000: VO_E_4000, VO_E_6000: VO_E_6000, VO_E_8000: VO_E_8000
                    };
                } else if (soexa === '005' && objresponse.resultado !== 'N') {
                    const dataJSON = JSON.parse(objresponse.resultado);
                    dataJSON.forEach(obj => {
                        if (obj.valor_ref === 0) {
                            obj.valor_ref = '';
                        }
                        if (obj.mejor_valor === 0) {
                            obj.mejor_valor = '';
                        }
                        if (obj.Mejor_val_porc === 0) {
                            obj.Mejor_val_porc = '';
                        }
                        if (obj.valor_pre1 === 0) {
                            obj.valor_pre1 = '';
                        }
                        if (obj.valor_pre2 === 0) {
                            obj.valor_pre2 = '';
                        }
                        if (obj.valor_pre3 === 0) {
                            obj.valor_pre3 = '';
                        }
                    });
                    const { antecedenteMed, Calidad, conclusion, std_fuma, fecaten } = dataJSON[0];
                    if (dataJSON[0].recomendaciones && dataJSON[0].recomendaciones.length > 0) {
                        dataJSON[0].recomendaciones.forEach((objrecomendaciones) => {
                            let { desrec, des_control } = objrecomendaciones;
                            recomendaciones.push({ desrec, des_control });
                        });
                    }
                    data = {
                        numdoc: numdoc,
                        appm_nom: appm_nom,
                        fecnac: fecnac,
                        Edad: Edad,
                        des_sexo: des_sexo,
                        cargo_actual: cargo_actual,
                        razsoc: razsoc,
                        destipcon: destipcon,
                        antecedenteMed: antecedenteMed,
                        Calidad: Calidad,
                        conclusion: conclusion,
                        std_fuma: std_fuma,
                        fecaten: fecaten,

                        recomendaciones: recomendaciones,
                        rows: dataJSON
                    };
                }
                if (objresponse.resultado !== 'N') {
                    const htmlPath = `src/public/templates/${soexa}.html`;
                    templateHtml = await fs.readFile(htmlPath, 'utf-8');
                    renderedHtml = mustache.render(templateHtml, data);
                } else {
                    renderedHtml = 'No se ha registrado resultados para este examen';
                }
                const resultado ={
                    renderedHtml:renderedHtml,
                    rutaArchivo:rutaArchivo
                }

                res.json(resultado);
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },

    async getresultadofichas(req, res) {
        let { cita_id, soexa } = req.query;
        const pool = await getConnection();
        const result = await pool.query(`pa_Selllenarconclusiones'${cita_id}','${soexa}'`);
        res.json(result.recordset);
    },

    /*********************************************/

    /*************** Formato Salud Ocupacional *****************/

    async getresultformatosaludocupacional(req, res) {
        /*let cita_id = '3, 4, 5, 6, 7,8,9,10,11,12,13,14,15'  
        let soexa = '001,003,005,009,013,020,033,004'*/
        let { cita_id, soexa } = req.query;
        const pool = await getConnection();
        const result = await pool.query(`pa_SelExaFormatos'${cita_id}','${soexa}'`);
        res.json(result.recordset);
    },

};