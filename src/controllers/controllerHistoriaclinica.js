const { getConnection } = require('../database/conexionsql');
const sql = require('mssql');
const fs = require('fs').promises;
const path = require('path');


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
        const { id, opcion } = req.params;
        const pool = await getConnection();
        const pruebas = await pool.query(`pa_SelMenuExamenes '${id}','${opcion}'`);
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
            const { archivosBase64, cita_id, soexa, codpru_id } = req.body;
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
                const nombreModificado = `${soexa}_${codpru_id}_${cita_id}.pdf`;

                // Guardar el archivo en el sistema de archivos
                const rutaArchivo = path.join(__dirname, '..', 'public', 'documentos', nombreModificado);
                const rutaArchivo1 = `/documentos/${soexa}_${codpru_id}_${cita_id}.pdf`;
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
        const pool = await getConnection();
        const pruebas = await pool.query(`pa_SelPruebasPorExamen '${soexa}','${cita_id}'`);
        res.json(pruebas.recordset);
    },
    async getparametros(req, res) {
        let { codpru_id, nuncom } = req.query;
        const pool = await getConnection();
        const parametros = await pool.query(`pa_selparametroslab '${codpru_id}','${nuncom}'`);
        res.json(parametros.recordset);
    },
    async postlaboratorio(req, res) {
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
    async getresultespirometria(req, res) {
        let { cita_id, soexa } = req.query;
        const pool = await getConnection();
        const result = await pool.query(`pa_SelResultespirometria '${cita_id}','${soexa}'`);
        res.json(result.recordset);
    },
    async getresultcuestionarioespirometria(req, res) {
        let { cita_id, soexa } = req.query;
        const pool = await getConnection();
        const result = await pool.query(`pa_SelResultcuestionarioespirometria '${cita_id}','${soexa}'`);
        res.json(result.recordset);
    },
    async getresulttestpsicologia(req, res) {
        let { cita_id, soexa } = req.query;
        const pool = await getConnection();
        const result = await pool.query(`pa_SelResulttestpsicologia '${cita_id}','${soexa}'`);
        res.json(result.recordset);
    },

    /**************** Espirometria ***********************/
    async getparametrosespiro(req, res) {
        let { codpru_id, nuncom } = req.query;
        console.log(codpru_id, nuncom)
        const pool = await getConnection();
        const parametros = await pool.query(`pa_SelParametrosEspiro ${codpru_id},${nuncom}`);
        res.json(parametros.recordset);
    },
    async postespirometria(req, res) {
        try {
            const { cita_id, nuncom, soexa, codpru_id, doc_adic_id, datains, datainsrec, dataparametros } = req.body;
            console.log(cita_id, nuncom, soexa, codpru_id, doc_adic_id, datains, datainsrec, dataparametros)
            const usenam = req.user.usuario;
            const hostname = '';
            const codrol = req.user.codrol;
            const med_id = req.user.med_id;
            const detalleJsoncie10 = JSON.stringify(datains);
            const detalleJsonrecomen = JSON.stringify(datainsrec);
            const detalleJsonparametros = JSON.stringify(dataparametros);
            console.log(detalleJsoncie10, detalleJsonrecomen, detalleJsonparametros)
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
            console.log(cita_id, nuncom, soexa, codpru_id, aptitud_espalda, doc_adic_id,med_id );
            console.log(detalleJsoncie10,detalleJsonrecomen);
            const detalleJsonflex_fuerza = JSON.stringify(flex_fuerza);
            const detalleJsonrangos_articulares = JSON.stringify(rangos_articulares);
            console.log(detalleJsonflex_fuerza,detalleJsonrangos_articulares);
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

};