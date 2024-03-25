const { getConnection } = require('../database/conexionsql');
const sql = require('mssql');
const puppeteer = require('puppeteer');
const fs = require('fs/promises');
const mustache = require('mustache');
const { PDFDocument, PageSizes } = require('pdf-lib');
const archiver = require('archiver');
const { Readable } = require('stream');
const { parse } = require('path');
const path = require('path');
const sharp = require('sharp');
const e = require('connect-flash');
const { sign } = require('crypto');

async function getFormatoSaludOcu(cita_id, soexa, res, req) {

    const pool = await getConnection();
    const examenes = await pool.query(`pa_SelFormatoSaludOcupacional '${cita_id}','${soexa}'`);
    pool.close();
    return examenes.recordset;
}

module.exports = {
    async getexportarinformeconsolidado(req, res) {
        try {
            const examenes = req.query.examenes;
            const citas_id = req.query.citas_id;

            // Verificar si citas_id es un array y está definido
            if (Array.isArray(citas_id) && citas_id.length > 0) {
                // Configurar Puppeteer con el nuevo modo Headless
                const browser = await puppeteer.launch({ headless: 'false' });

                res.setHeader('Content-Type', 'application/zip');
                res.setHeader('Content-Disposition', 'attachment; filename=archived_output.zip');

                // Crear un objeto Archiver
                const archive = archiver('zip', {
                    zlib: { level: 9 } // Configuración de compresión máxima
                });

                // Pipe el archivo ZIP directamente a la respuesta
                archive.pipe(res);

                const convertirACadena = objeto => Object.values(objeto).join(',');
                const examenesResult = convertirACadena(examenes);
                const citas_idResult = convertirACadena(citas_id);


                const response = await getFormatoSaludOcu(citas_idResult, examenesResult, res, req);
                for (const id of citas_id) {
                    let bandera = true;
                    let algunaBanderaTrue = false;
                    let pacientenombre = '';
                    // Crear un PDF combinado para cada ID
                    const pdfBuffers = [];
                    // Iterar sobre cada código de examen
                    for (const codigo of examenes) {
                        let data = {};
                        const htmlPath = `src/templates/${codigo}.html`;
                        const htmlTemplate = await fs.readFile(htmlPath, 'utf-8');
                        let doc_adjunto = '';

                        for (const objresponse of response) {
                            let paciente = JSON.parse(objresponse.paciente);
                            let { pachis, appm_nom, numdoc, fecnac, Edad, correo, telefono,
                                celular, numhijos, numdep, foto, huella, firma, des_sexo, desgrainst, desestciv, destipcon,
                                cargo_actual, area_actual, razsoc, dire_clie, actividad_economica_clie, dire_paci,
                                tipexa_id, desexa, medapmn_proto, des_esp_proto, med_cmp_proto, med_firma_proto, fechaAtencion } = paciente[0];
                            let cie10 = [];
                            let recomendaciones = [];

                            function obtenerArray(dataJSON, propiedad) {
                                let resultado = "";
                                dataJSON.forEach((obj) => {
                                    resultado = obj[propiedad];
                                });
                                return resultado;
                            }
                            if (objresponse.cita_id === id) {
                                console.log("cita_id:", objresponse.cita_id);
                                pacientenombre = appm_nom;
                                switch (codigo) {
                                    //Signos vitales
                                    case '001':
                                        if (objresponse.pb_001 !== 'N' && objresponse.pb_001 !== 'SIN RESULTADOS') {
                                            let ArraySignos = [];
                                            const dataJSON = JSON.parse(objresponse.pb_001);
                                            const { medapmn, des_esp, med_cmp, med_firma, rutarch } = dataJSON[0];

                                            dataJSON.forEach((objSignos) => {
                                                let { Analisis, Resultados, Unimed } = objSignos;
                                                ArraySignos.push({ Analisis, Resultados, Unimed });
                                            });
                                            if (dataJSON[0].diagnosticos && dataJSON[0].diagnosticos.length > 0) {
                                                dataJSON[0].diagnosticos.forEach((objdiagnosticos) => {
                                                    let { diacod, diades } = objdiagnosticos;
                                                    cie10.push({ diacod, diades });
                                                });
                                            } else {
                                                cie10.push({ diacod: '&nbsp;', diades: '&nbsp;' });//Hace que se muestre una fila vacia para estetica
                                            }
                                            if (dataJSON[0].recomendaciones && dataJSON[0].recomendaciones !== '0') {
                                                dataJSON[0].recomendaciones.forEach((objrecomendaciones) => {
                                                    let { desrec, des_control } = objrecomendaciones;
                                                    recomendaciones.push({ desrec, des_control });
                                                });
                                            } else {
                                                recomendaciones.push({ desrec: '&nbsp;', des_control: '&nbsp;' });
                                            }
                                            let imgDoc = await ValidarFirma('medicos', `${med_firma}.webp`);
                                            doc_adjunto = rutarch;
                                            data = {
                                                numdoc: numdoc,
                                                appm_nom: appm_nom,
                                                fecnac: fecnac,
                                                Edad: Edad,
                                                des_sexo: des_sexo,
                                                cargo_actual: cargo_actual,
                                                destipcon: destipcon,
                                                desexa: desexa,
                                                razsoc: razsoc,
                                                ArraySignos: ArraySignos,
                                                cie10: cie10,
                                                recomendaciones: recomendaciones,
                                                medapmn: medapmn,
                                                des_esp: des_esp,
                                                med_cmp: med_cmp,
                                                med_firma: imgDoc,
                                            };
                                            algunaBanderaTrue = true
                                            bandera = true;
                                        } else {
                                            bandera = false;
                                        }
                                        break;
                                    //Audiometria
                                    case '003':
                                        if (objresponse.pb_003 !== 'N' && objresponse.pb_003 !== 'SIN RESULTADOS') {
                                            const dataJSON = JSON.parse(objresponse.pb_003);
                                            const { tiem_exp_hrs, apre_ruido, logoaudiometria_oido_der,
                                                logoaudiometria_oido_izq, marca, modelo, feccali, fecing_empresa, uso_pro_uditivo,
                                                medapmn, des_esp, med_cmp, med_firma, rutarch } = dataJSON[0];
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
                                            } else {
                                                cie10.push({ diacod: '&nbsp;', diades: '&nbsp;' });
                                            }
                                            if (dataJSON[0].recomendaciones && dataJSON[0].recomendaciones.length > 0) {
                                                dataJSON[0].recomendaciones.forEach((objrecomendaciones) => {
                                                    let { desrec, des_control } = objrecomendaciones;
                                                    recomendaciones.push({ desrec, des_control });
                                                });
                                            } else {
                                                recomendaciones.push({ desrec: '&nbsp;', des_control: '&nbsp;' });
                                            }
                                            let imgDocProto = await ValidarFirma('medicos', `${med_firma_proto}.webp`);
                                            let imgDoc = await ValidarFirma('medicos', `${med_firma}.webp`);

                                            doc_adjunto = rutarch;

                                            data = {
                                                numdoc: numdoc,
                                                appm_nom: appm_nom,
                                                fecnac: fecnac,
                                                Edad: Edad,
                                                des_sexo: des_sexo,
                                                cargo_actual: cargo_actual,
                                                razsoc: razsoc,
                                                tiem_exp_hrs: tiem_exp_hrs,
                                                apre_ruido: apre_ruido,
                                                fechaAtencion: fechaAtencion,
                                                fecing_empresa: fecing_empresa,
                                                logoaudiometriaDer: logoaudiometriaDer,
                                                logoaudiometriaIzq: logoaudiometriaIzq,
                                                marca: marca,
                                                modelo: modelo,
                                                feccali: feccali,
                                                uso_pro_uditivo: uso_pro_uditivo,
                                                desexa: desexa,
                                                cie10: cie10,
                                                recomendaciones: recomendaciones,
                                                medapmn: medapmn,
                                                des_esp: des_esp,
                                                med_cmp: med_cmp,
                                                med_firma: imgDoc,
                                                medapmn_proto: medapmn_proto,
                                                des_esp_proto: des_esp_proto,
                                                med_cmp_proto: med_cmp_proto,
                                                med_firmaProto: imgDocProto,
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
                                            algunaBanderaTrue = true
                                            bandera = true;
                                        } else {
                                            bandera = false;
                                        }
                                        break;
                                    //Cuestionario Espirometria
                                    case '004':
                                        if (objresponse.pb_004 !== 'N' && objresponse.pb_004 !== 'SIN RESULTADOS') {
                                            const dataJSON = JSON.parse(objresponse.pb_004);
                                            let { ce_pre1, ce_pre2, ce_pre3, ce_pre4, ce_pre5, ce_pre6, ce_pre7, ce_pre8, ce_pre9, ce_pre10, ce_pre11, ce_pre12, ce_pre13, ce_pre14, ce_pre15, ce_pre16, ce_pre17, ce_pre18, ce_pre19, ce_pre20, ce_pre21, ce_pre22, ce_pre23, ce_pre24, ce_pre25, ce_pre26, ce_pre27
                                            } = dataJSON[0];
                                            const { rutarch } = dataJSON[0];

                                            let ce_pre27SI = '';
                                            let ce_pre27NO = '';
                                            let ce_pre27NA = '';
                                            if (ce_pre27 === 'SI') {
                                                ce_pre27SI = '(X)';
                                            } else if (ce_pre27 === 'NO') {
                                                ce_pre27NO = '(X)';
                                            } else if (ce_pre27 === 'NA') {
                                                ce_pre27NA = '(X)';
                                            }
                                            let imgPac = await ValidarFirma('paciente/firma', firma);
                                            let huellaPac = await ValidarFirma('paciente/huella', huella);

                                            doc_adjunto = rutarch;
                                            data = {
                                                numdoc: numdoc,
                                                appm_nom: appm_nom,
                                                fecnac: fecnac,
                                                fechaAtencion: fechaAtencion,
                                                Edad: Edad,
                                                des_sexo: des_sexo,
                                                cargo_actual: cargo_actual,
                                                area_actual: area_actual,
                                                desexa: desexa,
                                                razsoc: razsoc,
                                                firma: imgPac,
                                                huella: huellaPac,
                                                ce_pre1: ce_pre1,
                                                ce_pre2: ce_pre2,
                                                ce_pre3: ce_pre3,
                                                ce_pre4: ce_pre4,
                                                ce_pre5: ce_pre5,
                                                ce_pre6: ce_pre6,
                                                ce_pre7: ce_pre7,
                                                ce_pre8: ce_pre8,
                                                ce_pre9: ce_pre9,
                                                ce_pre10: ce_pre10,
                                                ce_pre11: ce_pre11,
                                                ce_pre12: ce_pre12,
                                                ce_pre13: ce_pre13,
                                                ce_pre14: ce_pre14,
                                                ce_pre15: ce_pre15,
                                                ce_pre16: ce_pre16,
                                                ce_pre17: ce_pre17,
                                                ce_pre18: ce_pre18,
                                                ce_pre19: ce_pre19,
                                                ce_pre20: ce_pre20,
                                                ce_pre21: ce_pre21,
                                                ce_pre22: ce_pre22,
                                                ce_pre23: ce_pre23,
                                                ce_pre24: ce_pre24,
                                                ce_pre25: ce_pre25,
                                                ce_pre26: ce_pre26,
                                                ce_pre27SI: ce_pre27SI,
                                                ce_pre27NO: ce_pre27NO,
                                                ce_pre27NA: ce_pre27NA,
                                            };
                                            bandera = true;
                                            algunaBanderaTrue = true
                                        } else {
                                            bandera = false;
                                        }
                                        break;
                                    //Espirometria
                                    case '005':
                                        if (objresponse.pb_005 !== 'N' && objresponse.pb_005 !== 'SIN RESULTADOS') {
                                            const dataJSON = JSON.parse(objresponse.pb_005);
                                            const { antecedenteMed, medapmn, des_esp, med_cmp, med_firma, Calidad, conclusion, std_fuma, rutarch } = dataJSON[0];
                                            let ArrayEspirometria = [];
                                            dataJSON.forEach((objEspirometria) => {
                                                let { despar, valor_ref, mejor_valor, Mejor_val_porc, valor_pre1, valor_pre2, valor_pre3 } = objEspirometria;
                                                if (objEspirometria.valor_ref === undefined) {
                                                    objEspirometria.valor_ref = '';
                                                }
                                                if (objEspirometria.mejor_valor === undefined) {
                                                    objEspirometria.mejor_valor = '';
                                                }
                                                if (objEspirometria.Mejor_val_porc === undefined) {
                                                    objEspirometria.Mejor_val_porc = '';
                                                }
                                                if (objEspirometria.valor_pre1 === undefined) {
                                                    objEspirometria.valor_pre1 = '';
                                                }
                                                if (objEspirometria.valor_pre2 === undefined) {
                                                    objEspirometria.valor_pre2 = '';
                                                }
                                                if (objEspirometria.valor_pre3 === undefined) {
                                                    objEspirometria.valor_pre3 = '';
                                                }
                                                ArrayEspirometria.push({ despar, valor_ref, mejor_valor, Mejor_val_porc, valor_pre1, valor_pre2, valor_pre3 });
                                            });

                                            if (dataJSON[0].diagnosticos && dataJSON[0].diagnosticos.length > 0) {
                                                dataJSON[0].diagnosticos.forEach((objdiagnosticos) => {
                                                    let { diacod, diades } = objdiagnosticos;
                                                    cie10.push({ diacod, diades });
                                                });
                                            } else {
                                                cie10.push({ diacod: '&nbsp;', diades: '&nbsp;' });
                                            }
                                            if (dataJSON[0].recomendaciones && dataJSON[0].recomendaciones.length > 0) {
                                                dataJSON[0].recomendaciones.forEach((objrecomendaciones) => {
                                                    let { desrec, des_control } = objrecomendaciones;
                                                    recomendaciones.push({ desrec, des_control });
                                                });
                                            } else {
                                                recomendaciones.push({ desrec: '&nbsp;', des_control: '&nbsp;' });
                                            }
                                            /*dataJSON.forEach(obj => {
                                                // Verificar y actualizar los valores si son 0
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
                                            });*/

                                            let imgDocProto = await ValidarFirma('medicos', `${med_firma_proto}.webp`);
                                            let imgDoc = await ValidarFirma('medicos', `${med_firma}.webp`);
                                            doc_adjunto = rutarch;

                                            data = {
                                                numdoc: numdoc,
                                                appm_nom: appm_nom,
                                                fecnac: fecnac,
                                                Edad: Edad,
                                                des_sexo: des_sexo,
                                                cargo_actual: cargo_actual,
                                                razsoc: razsoc,
                                                desexa: desexa,
                                                antecedenteMed: antecedenteMed,
                                                Calidad: Calidad,
                                                conclusion: conclusion,
                                                std_fuma: std_fuma,
                                                fechaAtencion: fechaAtencion,
                                                medapmn: medapmn,
                                                des_esp: des_esp,
                                                med_cmp: med_cmp,
                                                med_firma: imgDoc,
                                                medapmn_proto: medapmn_proto,
                                                des_esp_proto: des_esp_proto,
                                                med_cmp_proto: med_cmp_proto,
                                                med_firmaProto: imgDocProto,
                                                cie10: cie10,
                                                recomendaciones: recomendaciones,
                                                ArrayEspirometria: ArrayEspirometria
                                            };
                                            bandera = true;
                                            algunaBanderaTrue = true
                                        } else {
                                            bandera = false;
                                        }
                                        break;
                                    case '006':
                                        if (objresponse.pb_005 !== 'N' && objresponse.pb_005 !== 'SIN RESULTADOS') {
                                            const dataJSON = JSON.parse(objresponse.pb_005);
                                            const { usa_lentes, ultima_act, Refraccion, Reconoce_Colores, hallazgos, antecedentes, 
                                                medapmn, des_esp, med_cmp, med_firma, Calidad, conclusion, std_fuma, rutarch } = dataJSON[0];
                                            
                                            if(usa_lentes !== 'N'){
                                                usa_lentesSi = '(X)'
                                            }else{
                                                usa_lentesNo = '(X)'
                                            }
                                            
                                            const agudeza_visualArray = obtenerArray(dataJSON, "agudeza_visual");





                                            let imgDocProto = await ValidarFirma('medicos', `${med_firma_proto}.webp`);
                                            let imgDoc = await ValidarFirma('medicos', `${med_firma}.webp`);
                                            doc_adjunto = rutarch;

                                            data = {
                                                numdoc: numdoc,
                                                appm_nom: appm_nom,
                                                fecnac: fecnac,
                                                Edad: Edad,
                                                des_sexo: des_sexo,
                                                cargo_actual: cargo_actual,
                                                razsoc: razsoc,

                                                antecedentes: antecedentes,
                                                usa_lentesSi : usa_lentesSi,
                                                usa_lentesNo : usa_lentesNo,
                                                ultima_act : ultima_act,
                                                agudeza_visualArray : agudeza_visualArray,

                                                desexa: desexa,
                                                fechaAtencion: fechaAtencion,
                                                medapmn: medapmn,
                                                des_esp: des_esp,
                                                med_cmp: med_cmp,
                                                med_firma: imgDoc,
                                                medapmn_proto: medapmn_proto,
                                                des_esp_proto: des_esp_proto,
                                                med_cmp_proto: med_cmp_proto,
                                                med_firmaProto: imgDocProto,
                                                cie10: cie10,
                                                recomendaciones: recomendaciones,
                                            };
                                            bandera = true;
                                            algunaBanderaTrue = true
                                        } else {
                                            bandera = false;
                                        }
                                        break;                                
                                    //Laboratorio
                                    case '009':
                                        if (objresponse.pb_009 !== 'N' && objresponse.pb_009 !== 'SIN RESULTADOS') {
                                            const dataJSON = JSON.parse(objresponse.pb_009);

                                            let parexa_id1 = dataJSON.some(row => row.parexa_id === 221);
                                            let codpru_id1 = dataJSON.some(row => row.codpru_id === 1115);
                                            const { medapmn, des_esp, med_cmp, med_firma, rutarch } = dataJSON[0];

                                            doc_adjunto = rutarch;
                                            if (codpru_id1 && parexa_id1) {
                                                bandera = false;
                                                algunaBanderaTrue = true
                                            } else {
                                                let ArrayLaboratorio = [];
                                                dataJSON.forEach((objLaboratorio) => {
                                                    let { analisis, metodo, result, unid, valref } = objLaboratorio;
                                                    ArrayLaboratorio.push({ analisis, metodo, result, unid, valref });
                                                });

                                                if (dataJSON[0].diagnosticos && dataJSON[0].diagnosticos.length > 0) {
                                                    dataJSON[0].diagnosticos.forEach((objdiagnosticos) => {
                                                        let { diacod, diades } = objdiagnosticos;
                                                        cie10.push({ diacod, diades });
                                                    });
                                                } else {
                                                    cie10.push({ diacod: '&nbsp;', diades: '&nbsp;' });
                                                }
                                                if (dataJSON[0].recomendaciones && dataJSON[0].recomendaciones.length > 0) {
                                                    dataJSON[0].recomendaciones.forEach((objrecomendaciones) => {
                                                        let { desrec, des_control } = objrecomendaciones;
                                                        recomendaciones.push({ desrec, des_control });
                                                    });
                                                } else {
                                                    recomendaciones.push({ desrec: '&nbsp;', des_control: '&nbsp;' });
                                                }
                                                let imgDoc = await ValidarFirma('medicos', `${med_firma}.webp`);

                                                data = {
                                                    numdoc: numdoc,
                                                    appm_nom: appm_nom,
                                                    fecnac: fecnac,
                                                    Edad: Edad,
                                                    des_sexo: des_sexo,
                                                    cargo_actual: cargo_actual,
                                                    destipcon: destipcon,
                                                    razsoc: razsoc,
                                                    desexa: desexa,
                                                    cie10: cie10,
                                                    recomendaciones: recomendaciones,
                                                    medapmn: medapmn,
                                                    des_esp: des_esp,
                                                    med_cmp: med_cmp,
                                                    med_firma: imgDoc,
                                                    ArrayLaboratorio: ArrayLaboratorio
                                                };
                                                algunaBanderaTrue = true
                                                bandera = true;
                                            }
                                        } else {
                                            bandera = false;
                                        }
                                        break;
                                    //DiagnosticoImagenes 
                                    case '013':
                                        if (objresponse.pb_013 !== 'N' && objresponse.pb_013 !== 'SIN RESULTADOS') {
                                            const dataJSON = JSON.parse(objresponse.pb_013);
                                            const resultadoArray = JSON.parse(dataJSON[0].resultado);
                                            for (const obj of resultadoArray) {
                                                let doc_adjuntoDiag = '';
                                                cie10Img = [];
                                                recomendacionesImg = [];
                                                let [conclusion, det_informe, medapmn, des_esp, med_cmp, med_firma, rutarch, codigo_ref] =
                                                    [obj.conclusion, obj.det_informe, obj.medapmn, obj.des_esp,
                                                    obj.med_cmp, obj.med_firma, obj.rutarch, obj.codigo_ref];
                                                if (obj.diagnosticos && obj.diagnosticos.length > 0) {
                                                    obj.diagnosticos.forEach((objdiagnosticos) => {
                                                        let { diacod, diades } = objdiagnosticos;
                                                        cie10Img.push({ diacod, diades });
                                                    });
                                                } else {
                                                    cie10Img.push({ diacod: '&nbsp;', diades: '&nbsp;' });
                                                }
                                                if (obj.recomendaciones && obj.recomendaciones.length > 0) {
                                                    obj.recomendaciones.forEach((objrecomendaciones) => {
                                                        let { desrec, des_control } = objrecomendaciones;
                                                        recomendacionesImg.push({ desrec, des_control });
                                                    });
                                                } else {
                                                    recomendacionesImg.push({ desrec: '&nbsp;', des_control: '&nbsp;' });
                                                }
                                                let imgDoc = await ValidarFirma('medicos', `${med_firma}.webp`);

                                                doc_adjuntoDiag = rutarch;

                                                data = {
                                                    numdoc: numdoc,
                                                    appm_nom: appm_nom,
                                                    razsoc: razsoc,
                                                    fecnac: fecnac,
                                                    Edad: Edad,
                                                    des_sexo: des_sexo,
                                                    cargo_actual: cargo_actual,
                                                    area_actual: area_actual,
                                                    fechaAtencion: fechaAtencion,
                                                    codigo_ref: codigo_ref,
                                                    det_informe: det_informe,
                                                    conclusion: conclusion,
                                                    cie10Img: cie10Img,
                                                    recomendacionesImg: recomendacionesImg,
                                                    medapmn: medapmn,
                                                    des_esp: des_esp,
                                                    med_cmp: med_cmp,
                                                    imgDoc: imgDoc,
                                                }
                                                const renderedHtml1 = mustache.render(htmlTemplate, data);

                                                const page1 = await browser.newPage();
                                                await page1.setContent(renderedHtml1);
                                                const pdfBuffer1 = await page1.pdf({ format: 'A4', printBackground: true, });
                                                const mainPdfDoc1 = await PDFDocument.load(pdfBuffer1);

                                                if (doc_adjuntoDiag !== '') {
                                                    try {
                                                        /*var partesRuta = doc_adjuntoDiag.split('/');
                                                        var nombreArchivo = partesRuta[partesRuta.length - 1];
                                                        const filePathDocAdj = path.join(__dirname, '..', 'public', 'documentos', `${nombreArchivo}`);*/
                                                        const filePathDocAdj = path.join(__dirname, '..', 'public', `${doc_adjuntoDiag}`);

                                                        const docAdjBuffer = await fs.readFile(filePathDocAdj);
                                                        const docadjPdf = await PDFDocument.load(docAdjBuffer);
                                                        const copias = await mainPdfDoc1.copyPages(docadjPdf, docadjPdf.getPageIndices());

                                                        for (const copia of copias) {
                                                            mainPdfDoc1.addPage(copia);
                                                        }
                                                    } catch (error) {
                                                        if (error.code === 'ENOENT') { // Maneja el caso en que el archivo no existe
                                                            console.warn(`El archivo ${doc_adjuntoDiag} no se encontró. Continuando con el siguiente recorrido del examen.`);
                                                        } else {
                                                            throw error; // Relanza cualquier otro error diferente a "ENOENT"
                                                        }
                                                    }
                                                }
                                                const updatedPdfBuffer1 = await mainPdfDoc1.save();
                                                // Agregar el buffer del PDF al array
                                                pdfBuffers.push(updatedPdfBuffer1);

                                            }
                                            algunaBanderaTrue = true;
                                            bandera = true;
                                        } else {
                                            bandera = false;
                                        }
                                        break;
                                    //FichaMedicoOcupacional312
                                    case '020':
                                        if (objresponse.pb_020 !== 'N' && objresponse.pb_020 !== 'SIN RESULTADOS') {
                                            const dataJSON = JSON.parse(objresponse.pb_020);
                                            const { ant_padre, ant_madre, ant_hermanos, num_hijos_vivos, num_hijos_fallecidos,
                                                ant_otros, ant_esposa, ap_alergias, ap_RAM, ap_asma, ap_diabetes, ap_neoplasia,
                                                ap_quemaduras, ap_cirugias, ap_neumonia, ap_HTA, ap_bronquitis, ap_convulsiones,
                                                ap_intoxicaciones, ap_actividad_fisica, ap_pato_tiroides, ap_TBC, ap_hepatitis,
                                                ap_ITS, ap_fiebre_tiroidea, ap_patologia_renal, ap_fracturas, ap_otros,
                                                ev_ananesis, ev_ectoscopia, ev_estado_mental, 
                                                departamentoPAC, provinciaPAC, distritoPAC, departamentoCLI, provinciaCLI, distritoCLI,
                                                res_lugar_trabajo, destipseg, medapmn, des_esp, med_cmp, med_firma, tipresult_id,
                                                rutarch, restricciones, dia, mes, anio, dir_nrodpptoint, nom_urba, DPTO, Provincia,
                                                Distrito } = dataJSON[0];
                                            
                                            let {con_eva_psicologica, con_radiograficas, con_laboratorio, con_audiometria, con_espirometria, con_otros} = dataJSON[0]; 
                                            if (con_eva_psicologica === '0') {
                                                con_eva_psicologica = 'NO APLICA';
                                            } 
                                            if(con_radiograficas === '0'){
                                                con_radiograficas = 'NO APLICA';
                                            }
                                            if(con_laboratorio === '0'){
                                                con_laboratorio = 'NO APLICA';
                                            }
                                            if(con_audiometria === '0'){
                                                con_audiometria = 'NO APLICA';
                                            }
                                            if(con_espirometria === '0'){
                                                con_espirometria = 'NO APLICA';
                                            }                                       
                                            if(con_otros === '0'){
                                                con_otros = 'NO APLICA';
                                            }

                                            let fecing_empresa = dataJSON[0].fecing_empresa;

                                            let [preocuficha, periodicaficha, retiroficha, otrosficha] = ['', '', '', ''];
                                            if (tipexa_id === 1) {
                                                preocuficha = 'X';
                                            } else if (tipexa_id === 2) {
                                                periodicaficha = 'X';
                                            } else if (tipexa_id === 4) {
                                                retiroficha = 'X';
                                            } else {
                                                otrosficha = 'X';
                                            }
                                            let [ResiSi, ResiNO] = ['', ''];
                                            if (res_lugar_trabajo === 'N') {
                                                ResiNO = 'X';
                                                fecing_empresa = '';
                                            } else if (res_lugar_trabajo === 'S') {
                                                ResiSi = 'X';
                                            }
                                            const antecedentes_ocupacionalesArray = obtenerArray(dataJSON, "antecedentes_ocupacionales");
                                            const js_habitos_nocibosArray = obtenerArray(dataJSON, "js_habitos_nocibos");
                                            const js_enferm_acciArray = obtenerArray(dataJSON, "js_enferm_acci");
                                            const js_examen_fisicoArray = obtenerArray(dataJSON, "js_examen_fisico");
                                            let datojs_enferm_acciArray = [];
                                            js_enferm_acciArray.forEach(element => {
                                                let [asostrab] = element.asostrab;
                                                let [asostrab_Si, asostrab_No] = ['', ''];

                                                if (asostrab !== 'N') {
                                                    asostrab_Si = 'X'
                                                } else {
                                                    asostrab_No = 'X'
                                                }
                                                datojs_enferm_acciArray.push({
                                                    enfermedad: element.enfermedad,
                                                    asostrab_Si: asostrab_Si,
                                                    asostrab_No: asostrab_No,
                                                    año: element.año,
                                                    diasdescanso: element.diasdescanso
                                                })
                                            });
                                            let [P, D, R] = ['', '', ''];
                                            if (dataJSON[0].diagnosticos && dataJSON[0].diagnosticos.length > 0) {
                                                dataJSON[0].diagnosticos.forEach((objdiagnosticos) => {
                                                    let { diacod, tipdia, diades } = objdiagnosticos;
                                                    if (tipdia === 'P') {
                                                        P = 'X';
                                                        D = '';
                                                        R = '';
                                                    } else if (tipdia === 'D') {
                                                        P = '';
                                                        D = 'X'
                                                        R = '';
                                                    } else if (tipdia === 'R') {
                                                        P = '';
                                                        P = '';
                                                        R = 'X';
                                                    }
                                                    cie10.push({ diacod, P, D, R, diades });
                                                });
                                            } else {
                                                cie10.push({ diacod: '&nbsp;', P: '', D: '', R: '', diades: '&nbsp;' });
                                            }
                                            if (dataJSON[0].recomendaciones && dataJSON[0].recomendaciones.length > 0) {
                                                dataJSON[0].recomendaciones.forEach((objrecomendaciones) => {
                                                    let { desrec, des_control } = objrecomendaciones;
                                                    recomendaciones.push({ desrec, des_control });
                                                });
                                            } else {
                                                recomendaciones.push({ desrec: '&nbsp;', des_control: '&nbsp;' });
                                            }


                                            let firmaPac = await ValidarFirma('paciente/firma', firma);
                                            let huellaPac = await ValidarFirma('paciente/huella', huella);
                                            let firmaDoc1 = await ValidarFirma('medicos', `${med_firma}.webp`);
                                            let firmaDoc2 = await ValidarFirma('medicos', `${med_firma_proto}.webp`);

                                            let fotoPac = await ValidarFirma('paciente/foto', foto);

                                            let [Essalud, EPS, Otro] = ['', '', ''];
                                            if (destipseg === 'Essalud') {
                                                Essalud = 'Essalud';
                                            } else if (destipseg === 'EPS') {
                                                EPS = 'EPS';
                                            } else {
                                                Otro = destipseg;
                                            }


                                            const signos_vitalesArray = obtenerArray(dataJSON, "signos_vitales");
                                            let FCResult, FCUnid, FRResult, FRUnid, PAResult, PAUnid, Sat_02Result, Sat_02Unid, PesoResult, PesoUnid,
                                                TallaResult, TallaUnid, IMCResult, IMCUnid, PerimetroAbdoResult, PerimetroAbdoUnid, TempResult, TempUnid;
                                            signos_vitalesArray.forEach(objSignosVitales => {
                                                if (objSignosVitales.parexa_id === 45) {
                                                    FCResult = objSignosVitales.Resultados;
                                                    FCUnid = objSignosVitales.Unimed;
                                                }
                                                if (objSignosVitales.parexa_id === 46) {
                                                    FRResult = objSignosVitales.Resultados;
                                                    FRUnid = objSignosVitales.Unimed;
                                                }
                                                if (objSignosVitales.parexa_id === 47) {
                                                    PAResult = objSignosVitales.Resultados;
                                                    PAUnid = objSignosVitales.Unimed;
                                                }
                                                if (objSignosVitales.parexa_id === 48) {
                                                    Sat_02Result = objSignosVitales.Resultados;
                                                    Sat_02Unid = objSignosVitales.Unimed;
                                                }
                                                if (objSignosVitales.parexa_id === 49) {
                                                    PesoResult = objSignosVitales.Resultados;
                                                    PesoUnid = objSignosVitales.Unimed;
                                                }
                                                if (objSignosVitales.parexa_id === 50) {
                                                    TallaResult = objSignosVitales.Resultados;
                                                    TallaUnid = objSignosVitales.Unimed;
                                                }
                                                if (objSignosVitales.parexa_id === 51) {
                                                    IMCResult = objSignosVitales.Resultados;
                                                    IMCUnid = objSignosVitales.Unimed;
                                                }
                                                if (objSignosVitales.parexa_id === 60) {
                                                    PerimetroAbdoResult = objSignosVitales.Resultados;
                                                    PerimetroAbdoUnid = objSignosVitales.Unimed;
                                                }
                                                if (objSignosVitales.parexa_id === 61) {
                                                    TempResult = objSignosVitales.Resultados;
                                                    TempUnid = objSignosVitales.Unimed;
                                                }
                                            });

                                            let [Apto, AptoRestri, NoApto, Obser, Evaluado, Pendiente] = ['', '', '', '', '', ''];
                                            if (tipresult_id === 1) {
                                                Apto = 'X';
                                            } else if (tipresult_id === 3) {
                                                AptoRestri = 'X';
                                            } else if (tipresult_id === 2) {
                                                NoApto = 'X';
                                            } else if (tipresult_id === 4) {
                                                Obser = 'X';
                                            } else if (tipresult_id === 5) {
                                                Evaluado = 'X';
                                            } else if (tipresult_id === 6) {
                                                Pendiente = 'X';
                                            }
                                            //doc_adjunto = rutarch;
                                            data = {
                                                preocuficha: preocuficha,
                                                periodicaficha: periodicaficha,
                                                retiroficha: retiroficha,
                                                otrosficha: otrosficha,
                                                ResiSi: ResiSi,
                                                ResiNO: ResiNO,
                                                FCResult: FCResult,
                                                FRResult: FRResult,
                                                PAResult: PAResult,
                                                Sat_02Result: Sat_02Result,
                                                PesoResult: PesoResult,
                                                TallaResult: TallaResult,
                                                IMCResult: IMCResult,
                                                PerimetroAbdoResult: PerimetroAbdoResult,
                                                TempResult: TempResult,

                                                FCUnid: FCUnid,
                                                FRUnid: FRUnid,
                                                PAUnid: PAUnid,
                                                Sat_02Unid: Sat_02Unid,
                                                PesoUnid: PesoUnid,
                                                TallaUnid: TallaUnid,
                                                IMCUnid: IMCUnid,
                                                PerimetroAbdoUnid: PerimetroAbdoUnid,
                                                TempUnid: TempUnid,

                                                Essalud: Essalud,
                                                EPS: EPS,
                                                Otro: Otro,
                                                P: P,
                                                D: D,
                                                R: R,
                                                pachis: pachis,
                                                numdoc: numdoc,
                                                appm_nom: appm_nom,
                                                correo: correo,
                                                telefono: telefono,
                                                celular: celular,
                                                numhijos: numhijos,
                                                desgrainst: desgrainst,
                                                desestciv: desestciv,
                                                numhijos: numhijos,
                                                numdep: numdep,
                                                dire_paci: dire_paci,
                                                dire_clie: dire_clie,
                                                actividad_economica_clie: actividad_economica_clie,
                                                area_actual: area_actual,
                                                fecing_empresa: fecing_empresa,
                                                departamentoPAC: departamentoPAC,
                                                provinciaPAC: provinciaPAC,
                                                distritoPAC: distritoPAC,
                                                departamentoCLI: departamentoCLI,
                                                provinciaCLI: provinciaCLI,
                                                distritoCLI: distritoCLI,
                                                dia: dia,
                                                mes: mes,
                                                anio: anio,
                                                fecnac: fecnac,
                                                Edad: Edad,
                                                des_sexo: des_sexo,
                                                cargo_actual: cargo_actual,
                                                destipcon: destipcon,
                                                razsoc: razsoc,
                                                fechaAtencion: fechaAtencion,
                                                ant_padre: ant_padre,
                                                ant_madre: ant_madre,
                                                ant_hermanos: ant_hermanos,
                                                ant_esposa: ant_esposa,
                                                num_hijos_vivos: num_hijos_vivos,
                                                num_hijos_fallecidos: num_hijos_fallecidos,
                                                ant_otros: ant_otros,
                                                ev_ananesis: ev_ananesis,
                                                ev_ectoscopia: ev_ectoscopia,
                                                ev_estado_mental: ev_estado_mental,
                                                con_eva_psicologica: con_eva_psicologica,
                                                con_radiograficas: con_radiograficas,
                                                con_laboratorio: con_laboratorio,
                                                con_audiometria: con_audiometria,
                                                con_espirometria: con_espirometria,
                                                con_otros: con_otros,
                                                antecedentes_ocupacionalesArray: antecedentes_ocupacionalesArray,
                                                js_habitos_nocibosArray: js_habitos_nocibosArray,
                                                datojs_enferm_acciArray: datojs_enferm_acciArray,
                                                js_examen_fisicoArray: js_examen_fisicoArray,
                                                ap_alergias: ap_alergias,
                                                ap_RAM: ap_RAM,
                                                ap_asma: ap_asma,
                                                ap_diabetes: ap_diabetes,
                                                ap_neoplasia: ap_neoplasia,
                                                ap_quemaduras: ap_quemaduras,
                                                ap_cirugias: ap_cirugias,
                                                ap_neumonia: ap_neumonia,
                                                ap_HTA: ap_HTA,
                                                ap_bronquitis: ap_bronquitis,
                                                ap_convulsiones: ap_convulsiones,
                                                ap_intoxicaciones: ap_intoxicaciones,
                                                ap_actividad_fisica: ap_actividad_fisica,
                                                ap_pato_tiroides: ap_pato_tiroides,
                                                ap_TBC: ap_TBC,
                                                ap_hepatitis: ap_hepatitis,
                                                ap_ITS: ap_ITS,
                                                ap_fiebre_tiroidea: ap_fiebre_tiroidea,
                                                ap_patologia_renal: ap_patologia_renal,
                                                ap_fracturas: ap_fracturas,
                                                ap_otros: ap_otros,
                                                desexa: desexa,
                                                cie10: cie10,
                                                Apto: Apto,
                                                AptoRestri: AptoRestri,
                                                NoApto: NoApto,
                                                Obser: Obser,
                                                Evaluado: Evaluado,
                                                Pendiente: Pendiente,
                                                recomendaciones: recomendaciones,
                                                huella : huellaPac,
                                                firma: firmaPac,
                                                med_firma1: firmaDoc1,
                                                med_firma2: firmaDoc2,
                                                foto: fotoPac,
                                                medapmn: medapmn,
                                                des_esp: des_esp,
                                                med_cmp: med_cmp,
                                                medapmn_proto: medapmn_proto,
                                                med_cmp_proto: med_cmp_proto,
                                                restricciones: restricciones,
                                                dir_nrodpptoint: dir_nrodpptoint,
                                                nom_urba: nom_urba,
                                                DPTO: DPTO,
                                                Provincia: Provincia,
                                                Distrito: Distrito
                                            };
                                            bandera = true;
                                            algunaBanderaTrue = true;

                                        } else {
                                            bandera = false;
                                            console.log("No se ejecuto el examen FichaMedicoOcupacional312");
                                        }
                                        break;
                                    //Psicologia
                                    case '032':
                                        if (objresponse.pb_032 !== 'N' && objresponse.pb_032 !== 'SIN RESULTADOS') {
                                            const dataJSON = JSON.parse(objresponse.pb_032);

                                            const { mot_eva, superf_id, tiem_lab, prin_riesgos, med_seguridad, historia_familiar, accid_enfer, habitos, otras_observ,
                                                cod_present, cod_postura, dis_ritmo, dis_tono, dis_articulacion, ori_tiempo, ori_espacio, ori_persona, pro_cog_lucido_atento, pro_cog_pensamiento, pro_cog_percepcion,
                                                pro_cog_memoria, pro_cog_inteligencia, pro_cog_apetito, pro_cog_sueño, re_nivel_inte, re_coord_visomotriz, re_nivel_memoria, re_personalidad, re_afectividad,
                                                con_area_cognitiva, con_area_emocional, tipresult_id, conclusionesPsico, lugarNacimiento, lugarResidencia, diaAte, mesAte, anioAte,
                                                conducta_sexual, recomendacionesInforme,rutarch, medapmn, des_esp, med_cmp, med_firma } = dataJSON[0];


                                            let Arrayant_empresas = [];
                                            const antEmpresasJSON = JSON.parse(dataJSON[0].ant_empresas);
                                            antEmpresasJSON.forEach((objant_empresas) => {
                                                let { fecha, nombemp, actiemp, puesto, tiempo, causaret } = objant_empresas;
                                                Arrayant_empresas.push({ fecha, nombemp, actiemp, puesto, tiempo, causaret });
                                            });

                                            let = [cod_presentAde, cod_presentIna] = ['', ''];
                                            if (cod_present === 'ADECUADO') {
                                                cod_presentAde = 'X';
                                            } else {
                                                cod_presentIna = 'X';
                                            }

                                            let = [cod_posturaErg, cod_posturaEnc] = ['', ''];
                                            if (cod_postura === 'ERGUIDA') {
                                                cod_posturaErg = 'X';
                                            } else {
                                                cod_posturaEnc = 'X';
                                            }

                                            let = [dis_ritmoLent, dis_ritmoRap, dis_ritmoFlu] = ['', ''];
                                            if (dis_ritmo === 'LENTO') {
                                                dis_ritmoLent = 'X';
                                            } else if (dis_ritmo === 'RAPIDO') {
                                                dis_ritmoRap = 'X';
                                            } else {
                                                dis_ritmoFlu = 'X';
                                            }

                                            let = [dis_tonoBajo, dis_tonoMode, dis_tonoAlto] = ['', '', ''];
                                            if (dis_tono === 'BAJO') {
                                                dis_tonoBajo = 'X';
                                            } else if (dis_tono === 'MODERADO') {
                                                dis_tonoMode = 'X';
                                            } else {
                                                dis_tonoAlto = 'X';
                                            }

                                            let = [dis_articulacionConDif, dis_articulacionSinDis] = ['', ''];
                                            if (dis_articulacion === 'CON DIFICULTAD') {
                                                dis_articulacionConDif = 'X';
                                            } else {
                                                dis_articulacionSinDis = 'X';
                                            }

                                            let = [ori_tiempoOri, ori_tiempoDeso] = ['', ''];
                                            if (ori_tiempo === 'ORIENTADO') {
                                                ori_tiempoOri = 'X';
                                            } else {
                                                ori_tiempoDeso = 'X';
                                            }

                                            let = [ori_espacioOri, ori_espacioDeso] = ['', ''];
                                            if (ori_espacio === 'ORIENTADO') {
                                                ori_espacioOri = 'X';
                                            } else {
                                                ori_espacioDeso = 'X';
                                            }

                                            let = [ori_personaOri, ori_personaDeso] = ['', ''];
                                            if (ori_persona === 'ORIENTADO') {
                                                ori_personaOri = 'X';
                                            } else {
                                                ori_personaDeso = 'X';
                                            }

                                            let [pro_cog_memoriaCortPlazo, pro_cog_percepcionMediPlazo, pro_cog_percepcionLargPlazo] = ['', '', ''];
                                            if (pro_cog_memoria === 'CORTO PLAZO') {
                                                pro_cog_memoriaCortPlazo = 'X';
                                            } else if (pro_cog_memoria === 'MEDIANO PLAZO') {
                                                pro_cog_percepcionMediPlazo = 'X';
                                            } else {
                                                pro_cog_percepcionLargPlazo = 'X';
                                            }
                                            let [pro_cog_inteligenciaMuySup, pro_cog_inteligenciaSup, pro_cog_inteligenciaNorBri, pro_cog_inteligenciaNorPro, pro_cog_inteligenciaNorTor, pro_cog_inteligenciaFro,
                                                pro_cog_inteligenciaRMLev, pro_cog_inteligenciaRMMod, pro_cog_inteligenciaRMSev, pro_cog_inteligenciaRMPro] = ['', '', '', '', '', '', '', '', '', ''];

                                            if (pro_cog_inteligencia === 'MUY SUPERIOR') {
                                                pro_cog_inteligenciaMuySup = 'X';
                                            } else if (pro_cog_inteligencia === 'SUPERIOR') {
                                                pro_cog_inteligenciaSup = 'X';
                                            } else if (pro_cog_inteligencia === 'NORMAL BRILLANTE') {
                                                pro_cog_inteligenciaNorBri = 'X';
                                            } else if (pro_cog_inteligencia === 'NORMAL PROMEDIO') {
                                                pro_cog_inteligenciaNorPro = 'X';
                                            } else if (pro_cog_inteligencia === 'NORMAL TORPE') {
                                                pro_cog_inteligenciaNorTor = 'X';
                                            } else if (pro_cog_inteligencia === 'FRONTERIZO') {
                                                pro_cog_inteligenciaFro = 'X';
                                            } else if (pro_cog_inteligencia === 'RM LEVE') {
                                                pro_cog_inteligenciaRMLev = 'X';
                                            } else if (pro_cog_inteligencia === 'RM MODERADO') {
                                                pro_cog_inteligenciaRMMod = 'X';
                                            } else if (pro_cog_inteligencia === 'RM SEVERO') {
                                                pro_cog_inteligenciaRMSev = 'X';
                                            } else {
                                                pro_cog_inteligenciaRMPro = 'X';
                                            }
                                            let [superNoEsp, superSuper, superConce, superSubsu, superSoca] = ['', '', '', '', ''];
                                            if (superf_id === 1) {
                                                superNoEsp = 'X';
                                            } else if (superf_id === 2) {
                                                superSuper = 'X';
                                            } else if (superf_id === 3) {
                                                superConce = 'X';
                                            } else if (superf_id === 4) {
                                                superSubsu = 'X';
                                            } else if (superf_id === 5) {
                                                superSoca = 'X';
                                            }

                                            let ArrayTest = [];
                                            dataJSON.forEach((objTest) => {
                                                let { desexadet, valor_test } = objTest;
                                                ArrayTest.push({ desexadet, valor_test });
                                            });

                                            let tipresult_idData = '';
                                            if (tipresult_id === 1) {
                                                tipresult_idData = 'APTO';
                                            } else if (tipresult_id === 2) {
                                                tipresult_idData = 'NO APTO';
                                            } else if (tipresult_id === 3) {
                                                tipresult_idData = 'Apto con Restricciones';
                                            } else if (tipresult_id === 4) {
                                                tipresult_idData = 'Con Observaciones';
                                            } else if (tipresult_id === 5) {
                                                tipresult_idData = 'Evaluado';
                                            } else if (tipresult_id === 6) {
                                                tipresult_idData = 'Pendiente';
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

                                            let imgDoc = await ValidarFirma('medicos', `${med_firma}.webp`);

                                            doc_adjunto = rutarch;

                                            data = {
                                                numdoc: numdoc,
                                                appm_nom: appm_nom,
                                                fecnac: fecnac,
                                                Edad: Edad,
                                                des_sexo: des_sexo,
                                                cargo_actual: cargo_actual,
                                                desexa: desexa,
                                                fechaAtencion: fechaAtencion,
                                                mot_eva: mot_eva,
                                                razsoc: razsoc,
                                                actividad_economica_clie: actividad_economica_clie,
                                                area_actual: area_actual,
                                                superNoEsp: superNoEsp,
                                                superSuper: superSuper,
                                                superConce: superConce,
                                                superSubsu: superSubsu,
                                                superSoca: superSoca,
                                                tiem_lab: tiem_lab,
                                                prin_riesgos: prin_riesgos,
                                                med_seguridad: med_seguridad,
                                                Arrayant_empresas: Arrayant_empresas,
                                                historia_familiar: historia_familiar,
                                                accid_enfer: accid_enfer,
                                                habitos: habitos,
                                                otras_observ: otras_observ,
                                                cod_presentAde: cod_presentAde,
                                                cod_presentIna: cod_presentIna,
                                                cod_posturaErg: cod_posturaErg,
                                                cod_posturaEnc: cod_posturaEnc,
                                                dis_ritmoLent: dis_ritmoLent,
                                                dis_ritmoRap: dis_ritmoRap,
                                                dis_ritmoFlu: dis_ritmoFlu,
                                                dis_tonoBajo: dis_tonoBajo,
                                                dis_tonoMode: dis_tonoMode,
                                                dis_tonoAlto: dis_tonoAlto,
                                                dis_articulacionConDif: dis_articulacionConDif,
                                                dis_articulacionSinDis: dis_articulacionSinDis,
                                                ori_tiempoOri: ori_tiempoOri,
                                                ori_tiempoDeso: ori_tiempoDeso,
                                                ori_espacioOri: ori_espacioOri,
                                                ori_espacioDeso: ori_espacioDeso,
                                                ori_personaOri: ori_personaOri,
                                                ori_personaDeso: ori_personaDeso,
                                                pro_cog_lucido_atento: pro_cog_lucido_atento,
                                                pro_cog_pensamiento: pro_cog_pensamiento,
                                                pro_cog_percepcion: pro_cog_percepcion,
                                                pro_cog_memoriaCortPlazo: pro_cog_memoriaCortPlazo,
                                                pro_cog_percepcionMediPlazo: pro_cog_percepcionMediPlazo,
                                                pro_cog_percepcionLargPlazo: pro_cog_percepcionLargPlazo,
                                                pro_cog_inteligenciaMuySup: pro_cog_inteligenciaMuySup,
                                                pro_cog_inteligenciaSup: pro_cog_inteligenciaSup,
                                                pro_cog_inteligenciaNorBri: pro_cog_inteligenciaNorBri,
                                                pro_cog_inteligenciaNorPro: pro_cog_inteligenciaNorPro,
                                                pro_cog_inteligenciaNorTor: pro_cog_inteligenciaNorTor,
                                                pro_cog_inteligenciaFro: pro_cog_inteligenciaFro,
                                                pro_cog_inteligenciaRMLev: pro_cog_inteligenciaRMLev,
                                                pro_cog_inteligenciaRMMod: pro_cog_inteligenciaRMMod,
                                                pro_cog_inteligenciaRMSev: pro_cog_inteligenciaRMSev,
                                                pro_cog_inteligenciaRMPro: pro_cog_inteligenciaRMPro,
                                                pro_cog_apetito: pro_cog_apetito,
                                                pro_cog_sueño: pro_cog_sueño,
                                                re_nivel_inte: re_nivel_inte,
                                                re_coord_visomotriz: re_coord_visomotriz,
                                                re_nivel_memoria: re_nivel_memoria,
                                                re_personalidad: re_personalidad,
                                                re_afectividad: re_afectividad,
                                                con_area_cognitiva: con_area_cognitiva,
                                                con_area_emocional: con_area_emocional,
                                                ArrayTest: ArrayTest,
                                                tipresult_idData: tipresult_idData,
                                                conclusionesPsico: conclusionesPsico,
                                                desgrainst: desgrainst,
                                                lugarNacimiento: lugarNacimiento,
                                                lugarResidencia: lugarResidencia,
                                                diaAte: diaAte,
                                                mesAte: mesAte,
                                                anioAte: anioAte,
                                                conducta_sexual: conducta_sexual,
                                                recomendacionesInforme : recomendacionesInforme,
                                                cie10: cie10,
                                                recomendaciones: recomendaciones,
                                                medapmn: medapmn,
                                                des_esp: des_esp,
                                                med_cmp: med_cmp,
                                                med_firma: imgDoc,
                                            };
                                            algunaBanderaTrue = true
                                            bandera = true;

                                        } else {
                                            bandera = false;
                                        }
                                        break;
                                    //FichaMusculoEsqueletica  
                                    case '033':
                                        if (objresponse.pb_033 !== 'N' && objresponse.pb_033 !== 'SIN RESULTADOS') {
                                            const dataJSON = JSON.parse(objresponse.pb_033);
                                            const { fecing_empresa, aptitud_espalda, medapmn, des_esp, med_cmp, med_firma, rutarch } = dataJSON[0];

                                            const flex_fuerzaArray = obtenerArray(dataJSON, "flex_fuerza");
                                            const rangos_articularesArray = obtenerArray(dataJSON, "rangos_articulares");

                                            for (let i = 0; i < flex_fuerzaArray.length && i < 4; i++) {

                                            }


                                            const { valor: valor1flex, observacion: observacion1 } = flex_fuerzaArray[0];
                                            const { valor: valor2flex, observacion: observacion2 } = flex_fuerzaArray[1];
                                            const { valor: valor3flex, observacion: observacion3 } = flex_fuerzaArray[2];
                                            const { valor: valor4flex, observacion: observacion4 } = flex_fuerzaArray[3];

                                            const { valor: valor1rang, pregunta: pregunta1 } = rangos_articularesArray[0];
                                            const { valor: valor2rang, pregunta: pregunta2 } = rangos_articularesArray[1];
                                            const { valor: valor3rang, pregunta: pregunta3 } = rangos_articularesArray[2];
                                            const { valor: valor4rang, pregunta: pregunta4 } = rangos_articularesArray[3];


                                            //Calcula la suma de todos los valores de flex_fuerza
                                            let valorAbdomen, valorCadera, valorMuslo, valorAbdomenLateral;
                                            let sumaValorflex_fuerza = 0;
                                            for (let i = 0; i < flex_fuerzaArray.length; i++) {
                                                if (flex_fuerzaArray[i].tipo === 'Abdomen') {
                                                    valorAbdomen = flex_fuerzaArray[i].valor
                                                }
                                                if (flex_fuerzaArray[i].tipo === 'Cadera') {
                                                    valorCadera = flex_fuerzaArray[i].valor
                                                }
                                                if (flex_fuerzaArray[i].tipo === 'Muslo') {
                                                    valorMuslo = flex_fuerzaArray[i].valor
                                                }
                                                if (flex_fuerzaArray[i].tipo === 'Abdomen Lateral') {
                                                    valorAbdomenLateral = flex_fuerzaArray[i].valor
                                                }
                                                sumaValorflex_fuerza += parseInt(flex_fuerzaArray[i].valor);
                                            }

                                            let valorAbduccion180, valorAbduccion80, valorRotacionExterna, valorRotacionInterna;
                                            let sumaValorrangos_articulares = 0;
                                            for (let i = 0; i < rangos_articularesArray.length; i++) {
                                                if (rangos_articularesArray[i].tipo === 'Abduccion de hombro (Normal 0° - 180°)') {
                                                    valorAbduccion180 = rangos_articularesArray[i].valor
                                                }
                                                if (rangos_articularesArray[i].tipo === 'Abduccion de hombro (0° - 80°)') {
                                                    valorAbduccion80 = rangos_articularesArray[i].valor
                                                }
                                                if (rangos_articularesArray[i].tipo === 'Rotacion externa (0° - 90°)') {
                                                    valorRotacionExterna = rangos_articularesArray[i].valor
                                                }
                                                if (rangos_articularesArray[i].tipo === 'Rotacion interna de hombro') {
                                                    valorRotacionInterna = rangos_articularesArray[i].valor
                                                }
                                                sumaValorrangos_articulares += parseInt(rangos_articularesArray[i].valor);
                                            }


                                            if (dataJSON[0].diagnosticos && dataJSON[0].diagnosticos.length > 0) {
                                                dataJSON[0].diagnosticos.forEach((objdiagnosticos) => {
                                                    let { diacod, diades } = objdiagnosticos;
                                                    cie10.push({ diacod, diades });
                                                });
                                            }else {
                                                cie10.push({ diacod: '&nbsp;', diades: '&nbsp;' });
                                            }
                                            if (dataJSON[0].recomendaciones && dataJSON[0].recomendaciones.length > 0) {
                                                dataJSON[0].recomendaciones.forEach((objrecomendaciones) => {
                                                    let { desrec, des_control } = objrecomendaciones;
                                                    recomendaciones.push({ desrec, des_control });
                                                });
                                            }else {
                                                recomendaciones.push({ desrec: '&nbsp;', des_control: '&nbsp;' });
                                            }

                                            let imgDoc = await ValidarFirma('medicos', `${med_firma}.webp`);

                                            doc_adjunto = rutarch;

                                            data = {
                                                valorAbdomen: valorAbdomen,
                                                valorCadera: valorCadera,
                                                valorMuslo: valorMuslo,
                                                valorAbdomenLateral: valorAbdomenLateral,

                                                valorAbduccion180: valorAbduccion180,
                                                valorAbduccion80: valorAbduccion80,
                                                valorRotacionExterna: valorRotacionExterna,
                                                valorRotacionInterna: valorRotacionInterna,

                                                appm_nom: appm_nom,
                                                cargo_actual: cargo_actual,
                                                razsoc: razsoc,
                                                aptitud_espalda: aptitud_espalda,
                                                valor1flex: valor1flex,
                                                valor2flex: valor2flex,
                                                valor3flex: valor3flex,
                                                valor4flex: valor4flex,
                                                observacion1: observacion1,
                                                observacion2: observacion2,
                                                observacion3: observacion3,
                                                observacion4: observacion4,

                                                valor1rang: valor1rang,
                                                valor2rang: valor2rang,
                                                valor3rang: valor3rang,
                                                valor4rang: valor4rang,

                                                pregunta1: pregunta1,
                                                pregunta2: pregunta2,
                                                pregunta3: pregunta3,
                                                pregunta4: pregunta4,

                                                sumaValorflex_fuerza: sumaValorflex_fuerza,
                                                sumaValorrangos_articulares: sumaValorrangos_articulares,
                                                cie10: cie10,
                                                recomendaciones: recomendaciones,
                                                fechaAtencion: fechaAtencion,
                                                fecing_empresa: fecing_empresa,
                                                medapmn: medapmn,
                                                des_esp: des_esp,
                                                med_cmp: med_cmp,
                                                med_firma: imgDoc,
                                            };
                                            algunaBanderaTrue = true
                                            bandera = true;
                                            //  
                                        } else {
                                            bandera = false;
                                        }
                                        break;
                                    case '045':
                                        if (objresponse.pb_045 !== 'N' && objresponse.pb_045 !== 'SIN RESULTADOS') {
                                            const dataJSON = JSON.parse(objresponse.pb_045);
                                            const { tipexa_id, con_eva_psicologica, con_radiograficas, con_audiometria,
                                                con_espirometria, con_musculo_esqueletica } = dataJSON[0];

                                            let [preocuficha, periodicaficha, retiroficha, otrosficha] = ['', '', '', ''];
                                            if (tipexa_id === 1) {
                                                preocuficha = 'X';
                                            } else if (tipexa_id === 2) {
                                                periodicaficha = 'X';
                                            } else if (tipexa_id === 4) {
                                                retiroficha = 'X';
                                            } else {
                                                otrosficha = 'X';
                                            }
                                            const signos_vitalesArray = obtenerArray(dataJSON, "signos_vitales");

                                            let ResultadoIMC, UnimedIMC, ResultadoPeso, UnimedPeso, ResultadoTalla, UnimedTalla, ResultadoPA, UnidmedPA;
                                            signos_vitalesArray.forEach(objsignos_vitales => {
                                                if (objsignos_vitales.parexa_id == 51) {
                                                    ResultadoIMC = objsignos_vitales.Resultados;
                                                    UnimedIMC = objsignos_vitales.Unimed;


                                                }
                                                if (objsignos_vitales.parexa_id === 49) {
                                                    ResultadoPeso = objsignos_vitales.Resultados;
                                                    UnimedPeso = objsignos_vitales.Unimed;

                                                }
                                                if (objsignos_vitales.parexa_id === 50) {
                                                    ResultadoTalla = objsignos_vitales.Resultados;
                                                    UnimedTalla = objsignos_vitales.Unimed;
                                                }
                                                if (objsignos_vitales.parexa_id === 47) {
                                                    ResultadoPA = objsignos_vitales.Resultados;
                                                    UnidmedPA = objsignos_vitales.Unimed;
                                                }
                                            });

                                            const LaboratorioArray = obtenerArray(dataJSON, "laboratorio");
                                            let Hemoglobina, unidHemoglobina, Glucosa, unidGlucosa, Colesterol, unidColesterol, Trigliceridos, unidTrigliceridos, Orina;
                                            LaboratorioArray.forEach(objLaboratorio => {
                                                if (objLaboratorio.parexa_id == 222) {
                                                    let HemoglobinaData = objLaboratorio.result;
                                                    let unidHemoglobinaData = objLaboratorio.unid;
                                                    Hemoglobina = HemoglobinaData;
                                                    unidHemoglobina = unidHemoglobinaData;
                                                }
                                                if (objLaboratorio.parexa_id === 223) {
                                                    let GlucosaoData = objLaboratorio.result;
                                                    let unidGlucosaData = objLaboratorio.unid;
                                                    Glucosa = GlucosaoData;
                                                    unidGlucosa = unidGlucosaData;
                                                }
                                                if (objLaboratorio.parexa_id == 224) {
                                                    let ColesterolData = objLaboratorio.result;
                                                    let unidColesterolaData = objLaboratorio.unid;
                                                    Colesterol = ColesterolData;
                                                    unidColesterol = unidColesterolaData;
                                                }

                                                if (objLaboratorio.parexa_id == 225) {
                                                    let TrigliceridosData = objLaboratorio.result;
                                                    let unidTrigliceridosData = objLaboratorio.unid;
                                                    Trigliceridos = TrigliceridosData;
                                                    unidTrigliceridos = unidTrigliceridosData;

                                                }
                                                if (objLaboratorio.parexa_id === 226) {
                                                    let resultOrina = objLaboratorio.result;
                                                    Orina = resultOrina;
                                                }
                                            });

                                            let RangoHemoglobina, RangoGluco, RangoColesterol, RangoTrigliceridos;
                                            const rangosArray = obtenerArray(dataJSON, "rangos");
                                            rangosArray.forEach(objrangos => {
                                                if (objrangos.parexa_id === 222) {
                                                    RangoHemoglobina = objrangos.Rango;
                                                }
                                                if (objrangos.parexa_id === 223) {
                                                    RangoGluco = objrangos.Rango;
                                                }
                                                if (objrangos.parexa_id === 224) {
                                                    RangoColesterol = objrangos.Rango;
                                                }
                                                if (objrangos.parexa_id === 225) {
                                                    RangoTrigliceridos = objrangos.Rango;
                                                }
                                            });


                                            if (dataJSON[0].diagnosticos && dataJSON[0].diagnosticos.length > 0) {
                                                dataJSON[0].diagnosticos.forEach((objdiagnosticos) => {
                                                    let { numDiag, diacod, diades } = objdiagnosticos;
                                                    cie10.push({ numDiag, diacod, diades });
                                                });
                                            }

                                            if (dataJSON[0].recomendaciones && dataJSON[0].recomendaciones.length > 0) {
                                                dataJSON[0].recomendaciones.forEach((objrecomendaciones) => {
                                                    let { numReco, desrec } = objrecomendaciones;
                                                    recomendaciones.push({ numReco, desrec });
                                                });
                                            }
                                            let imgDoc = await ValidarFirma('medicos', `${med_firma_proto}.webp`);
                                            data = {
                                                area_actual: area_actual,
                                                fechaAtencion: fechaAtencion,
                                                numdoc: numdoc,
                                                appm_nom: appm_nom,
                                                fecnac: fecnac,
                                                Edad: Edad,
                                                des_sexo: des_sexo,
                                                cargo_actual: cargo_actual,
                                                preocuficha: preocuficha,
                                                periodicaficha: periodicaficha,
                                                retiroficha: retiroficha,
                                                otrosficha: otrosficha,
                                                ResultadoIMC: ResultadoIMC,
                                                UnimedIMC: UnimedIMC,
                                                ResultadoPeso: ResultadoPeso,
                                                UnimedPeso: UnimedPeso,
                                                ResultadoTalla: ResultadoTalla,
                                                UnimedTalla: UnimedTalla,
                                                ResultadoPA: ResultadoPA,
                                                UnidmedPA: UnidmedPA,
                                                con_eva_psicologica: con_eva_psicologica,
                                                con_musculo_esqueletica: con_musculo_esqueletica,
                                                con_radiograficas: con_radiograficas,
                                                con_audiometria: con_audiometria,
                                                con_espirometria: con_espirometria,
                                                Hemoglobina: Hemoglobina,
                                                unidHemoglobina: unidHemoglobina,
                                                RangoHemoglobina: RangoHemoglobina,
                                                Glucosa: Glucosa,
                                                unidGlucosa: unidGlucosa,
                                                RangoGluco: RangoGluco,
                                                Colesterol: Colesterol,
                                                unidColesterol: unidColesterol,
                                                RangoColesterol: RangoColesterol,
                                                Trigliceridos: Trigliceridos,
                                                unidTrigliceridos: unidTrigliceridos,
                                                RangoTrigliceridos: RangoTrigliceridos,
                                                Orina: Orina,
                                                cie10: cie10,
                                                recomendaciones: recomendaciones,
                                                medapmn_proto: medapmn_proto,
                                                med_cmp_proto: med_cmp_proto,
                                                med_firma: imgDoc,
                                            };
                                            algunaBanderaTrue = true
                                            bandera = true;

                                        } else {
                                            bandera = false;
                                        }

                                        break;
                                    case '046':
                                        if (objresponse.pb_046 !== 'N' && objresponse.pb_046 !== 'SIN RESULTADOS') {
                                            const dataJSON = JSON.parse(objresponse.pb_046);
                                            const { nompro, ap_alergias, tipresult_id, restricciones,
                                                tiemval_cermed, fecvcto_cermed, cadcermed } = dataJSON[0];

                                            let [preocuficha, periodicaficha, retiroficha, otrosficha] = ['', '', '', ''];
                                            if (tipexa_id === 1) {
                                                preocuficha = 'X';
                                            } else if (tipexa_id === 2) {
                                                periodicaficha = 'X';
                                            } else if (tipexa_id === 4) {
                                                retiroficha = 'X';
                                            } else {
                                                otrosficha = 'X';
                                            }
                                            let [Apto, AptoRestri, NoApto, Obser, Evaluado] = ['', '', '', '', ''];
                                            //Apto - 1
                                            if (tipresult_id == 1) {
                                                Apto = 'X';
                                                //Apto con Restricciones - 3
                                            } else if (tipresult_id == 3) {
                                                AptoRestri = 'X';
                                                //No Apto - 2
                                            } else if (tipresult_id == 2) {
                                                NoApto = 'X';
                                                //Con Observaciones - 4
                                            } else if (tipresult_id == 4) {
                                                Obser = 'X';
                                                //Evaluado - 5
                                            } else if (tipresult_id == 5) {
                                                Evaluado = 'X';
                                            }
                                            if (dataJSON[0].recomendaciones && dataJSON[0].recomendaciones.length > 0) {
                                                dataJSON[0].recomendaciones.forEach((objrecomendaciones) => {
                                                    let { numeracion, desrec } = objrecomendaciones;
                                                    recomendaciones.push({ numeracion, desrec });
                                                });
                                            }

                                            let imgDoc = await ValidarFirma('medicos', `${med_firma_proto}.webp`);
                                            data = {
                                                appm_nom: appm_nom,
                                                numdoc: numdoc,
                                                Edad: Edad,
                                                des_sexo: des_sexo,
                                                preocuficha: preocuficha,
                                                periodicaficha: periodicaficha,
                                                retiroficha: retiroficha,
                                                otrosficha: otrosficha,
                                                nompro: nompro,
                                                cargo_actual: cargo_actual,
                                                razsoc: razsoc,
                                                ap_alergias: ap_alergias,
                                                Apto: Apto,
                                                AptoRestri: AptoRestri,
                                                NoApto: NoApto,
                                                Obser: Obser,
                                                Evaluado: Evaluado,
                                                restricciones: restricciones,
                                                fechaAtencion: fechaAtencion,
                                                fecvcto_cermed: fecvcto_cermed,
                                                tiemval_cermed: tiemval_cermed,
                                                recomendaciones: recomendaciones,
                                                medapmn_proto: medapmn_proto,
                                                med_cmp_proto: med_cmp_proto,
                                                med_firma: imgDoc,
                                                cadcermed: cadcermed
                                            };
                                            algunaBanderaTrue = true
                                            bandera = true;
                                        } else {
                                            bandera = false;
                                        }
                                        break;
                                }
                            }

                        };
                        if (bandera && codigo !== '013') {
                            const renderedHtml = mustache.render(htmlTemplate, data);

                            const page = await browser.newPage();
                            await page.setContent(renderedHtml);
                            const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, });
                            const mainPdfDoc = await PDFDocument.load(pdfBuffer);
                            if (doc_adjunto !== '') {
                                try {
                                    /*var partesRuta = doc_adjunto.split('/');
                                    var nombreArchivo = partesRuta[partesRuta.length - 1];
                                    const filePathDocAdj = path.join(__dirname, '..', 'public', 'documentos', `${nombreArchivo}`);*/
                                    const filePathDocAdj = path.join(__dirname, '..', 'public', `${doc_adjunto}`);

                                    const docAdjBuffer = await fs.readFile(filePathDocAdj);
                                    const docadjPdf = await PDFDocument.load(docAdjBuffer);
                                    const copias = await mainPdfDoc.copyPages(docadjPdf, docadjPdf.getPageIndices());

                                    for (const copia of copias) {
                                        mainPdfDoc.addPage(copia);
                                    }
                                } catch (error) {
                                    if (error.code === 'ENOENT') {
                                        //console.warn(El Documento Adjunto ${doc_adjunto} no se encontró. Continuando con el siguiente examen.);
                                    } else {
                                        throw error;
                                    }
                                }
                            }
                            const updatedPdfBuffer = await mainPdfDoc.save();
                            // Agregar el buffer del PDF al array
                            pdfBuffers.push(updatedPdfBuffer);
                        } else {
                            if (doc_adjunto !== '') {
                                try {
                                    //var partesRuta = doc_adjunto.split('/');
                                    //var nombreArchivo = partesRuta[partesRuta.length - 1];
                                    //const filePathDocAdj = path.join(__dirname, '..', 'public', 'documentos', `${doc_adjunto}`);

                                    const filePathDocAdj = path.join(__dirname, '..', 'public', `${doc_adjunto}`);
                                    const docAdjBuffer = await fs.readFile(filePathDocAdj);
                                    /*const docadjPdf = await PDFDocument.load(docAdjBuffer);
                                    const copias = await docadjPdf.copyPages(docadjPdf, docadjPdf.getPageIndices());
                                    for (const copia of copias) {
                                        docadjPdf.addPage(copia);
                                    }
                                    const updatedPdfBuffer = await docadjPdf.save();*/
                                    pdfBuffers.push(docAdjBuffer);
                                } catch (error) {
                                    if (error.code === 'ENOENT') {
                                        console.warn(`El Documento Adjunto ${doc_adjunto} no se encontró. Continuando con el siguiente examen.`);
                                    } else {
                                        throw error;
                                    }
                                }
                            }
                        }
                    }
                    if (algunaBanderaTrue) {
                        // Combinar los buffers de PDF en uno solo
                        const combinedPdfBuffer = await mergePDFs(pdfBuffers);

                        // Convertir el PDF combinado a Buffer antes de añadirlo al ZIP
                        const combinedPdfBufferStream = new Readable();
                        combinedPdfBufferStream.push(combinedPdfBuffer);
                        combinedPdfBufferStream.push(null);

                        // Añadir el PDF combinado al ZIP con el nombre del ID
                        archive.append(combinedPdfBufferStream, { name: `${pacientenombre}.pdf` });
                    }
                }

                // Cerrar la instancia de Puppeteer
                await browser.close();

                // Finalizar y cerrar el archivo ZIP
                archive.finalize();
            } else {
                res.status(400).send('Error: El parámetro citas_id no es un array válido o está vacío.');
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('Error al generar el ZIP');
        }
    },


    async getexportarinformedetalle(req, res) {
        try {
            const examenes = req.query.examenes;
            const citas_id = req.query.citas_id;

            // Verificar si citas_id es un array y está definido
            if (Array.isArray(citas_id) && citas_id.length > 0) {
                // Crear un objeto Archiver
                const archive = archiver('zip', {
                    zlib: { level: 9 } // Configuración de compresión máxima
                });

                // Configurar Puppeteer con el nuevo modo Headless
                const browser = await puppeteer.launch({ headless: "new" });

                res.setHeader('Content-Type', 'application/zip');
                res.setHeader('Content-Disposition', 'attachment; filename=archived_output.zip');

                // Pipe el archivo ZIP directamente a la respuesta
                archive.pipe(res);

                // Iterar sobre cada ID en el array
                for (const id of citas_id) {
                    // Crear un subdirectorio para cada ID dentro del ZIP
                    archive.directory(`./${id}`, id);
                    let nombres = '';
                    // Iterar sobre cada código de examen
                    for (const codigo of examenes) {
                        let data = {};
                        const htmlPath = `src/templates/${codigo}.html`;
                        const htmlTemplate = await fs.readFile(htmlPath, 'utf-8');
                        let doc_adjunto = '';
                        for (const objresponse of response) {
                            let paciente = JSON.parse(objresponse.paciente);
                            let { pachis, appaterno, apmaterno, nombres, appm_nom, numdoc, fecnac, Edad, cod_ubigeo, correo, telefono,
                                celular, numhijos, numdep, foto, huella, firma, des_sexo, desgrainst,
                                desestciv, destipcon, cargo_actual, razsoc, dire_clie, actividad_economica_clie, dire_paci } = paciente[0];
                            //console.log(paciente[0]);
                            nombres = appm_nom;
                            let cie10 = [];
                            let recomendaciones = [];
                            function obtenerArray(dataJSON, propiedad) {
                                let resultado = "";
                                dataJSON.forEach((obj) => {
                                    resultado = obj[propiedad];
                                });
                                return resultado;
                            }
                            if (objresponse.cita_id === id) {
                                switch (codigo) {
                                    //Signos vitales
                                    case '001':
                                        if (objresponse.pb_001 !== 'N' && objresponse.pb_001 !== 'SIN RESULTADOS') {
                                            console.log("Ejecutando Signos Vitales pb_001");
                                            const dataJSON = JSON.parse(objresponse.pb_001);
                                            const { medapmn, des_esp, med_cmp, med_firma } = dataJSON[0];

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
                                            imgDoc = await ValidarFirma('medicos', `${med_firma}.webp`);

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
                                                medapmn: medapmn,
                                                des_esp: des_esp,
                                                med_cmp: med_cmp,
                                                med_firma: imgDoc,
                                                rows: dataJSON
                                            };
                                            bandera = true;

                                        } else {
                                            bandera = false;
                                            //bandera2 = false;
                                            console.log("No se ejecuto el examen Signos Vitales pb_001");
                                        }
                                        break;
                                    //Audiometria
                                    case '003':
                                        if (objresponse.pb_003 !== 'N' && objresponse.pb_003 !== 'SIN RESULTADOS') {
                                            console.log("Ejecutando Audiometria pb_003");
                                            const dataJSON = JSON.parse(objresponse.pb_003);
                                            const { tiem_exp_hrs, apre_ruido, desequi, fecaten, logoaudiometria_oido_der,
                                                logoaudiometria_oido_izq, modelo, feccali, fecing_empresa, uso_pro_uditivo,
                                                medapmn, med_firma } = dataJSON[0];

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

                                            imgDoc = await ValidarFirma('medicos', `${med_firma}.webp`);

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
                                                logoaudiometria_oido_der,
                                                logoaudiometria_oido_izq,
                                                modelo: modelo,
                                                feccali: feccali,
                                                uso_pro_uditivo: uso_pro_uditivo,
                                                cie10: cie10,
                                                recomendaciones: recomendaciones,
                                                medapmn: medapmn,
                                                med_firma: imgDoc,
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
                                            bandera = true;

                                        } else {
                                            bandera = false;
                                            //bandera2 = false;
                                            console.log("No se ejecuto el examen Audiometria pb_003");
                                        }
                                        break;
                                    //Cuestionario Espirometria
                                    case '004':
                                        if (objresponse.pb_004 !== 'N' && objresponse.pb_004 !== 'SIN RESULTADOS') {
                                            console.log("Ejecutando Cuestionario Espirometria pb_004");
                                            const dataJSON = JSON.parse(objresponse.pb_004);
                                            let { ce_pre1, ce_pre2, ce_pre3, ce_pre4, ce_pre5, ce_pre6, ce_pre7, ce_pre8, ce_pre9, ce_pre10, ce_pre11, ce_pre12, ce_pre13, ce_pre14, ce_pre15, ce_pre16, ce_pre17, ce_pre18, ce_pre19, ce_pre20, ce_pre21, ce_pre22, ce_pre23, ce_pre24, ce_pre25, ce_pre26, ce_pre27
                                            } = dataJSON[0];
                                            const { destipexa, fecaten, area_actual, medapmn, des_esp, med_cmp, med_firma } = dataJSON[0];

                                            if (dataJSON[0].recomendaciones && dataJSON[0].recomendaciones.length > 0) {
                                                dataJSON[0].recomendaciones.forEach((objrecomendaciones) => {
                                                    let { desrec, des_control } = objrecomendaciones;
                                                    recomendaciones.push({ desrec, des_control });
                                                });
                                            }

                                            let ce_pre27SI = '';
                                            let ce_pre27NO = '';
                                            let ce_pre27NA = '';
                                            if (ce_pre27 === 'SI') {
                                                ce_pre27SI = 'SI';
                                            } else if (ce_pre27 === 'NO') {
                                                ce_pre27NO = 'NO';
                                            } else if (ce_pre27 === 'NA') {
                                                ce_pre27NA = 'NO APLICA';
                                            }
                                            imgPac = await ValidarFirma('paciente/firma', firma);
                                            hullaPac = await ValidarFirma('paciente/huella', huella);

                                            data = {
                                                numdoc: numdoc,
                                                appm_nom: appm_nom,
                                                fecnac: fecnac,
                                                fecaten: fecaten,
                                                Edad: Edad,
                                                des_sexo: des_sexo,
                                                cargo_actual: cargo_actual,
                                                area_actual: area_actual,
                                                destipexa: destipexa,
                                                razsoc: razsoc,
                                                recomendaciones: recomendaciones,
                                                firma: imgPac,
                                                huella: hullaPac,
                                                ce_pre1: ce_pre1,
                                                ce_pre2: ce_pre2,
                                                ce_pre3: ce_pre3,
                                                ce_pre4: ce_pre4,
                                                ce_pre5: ce_pre5,
                                                ce_pre6: ce_pre6,
                                                ce_pre7: ce_pre7,
                                                ce_pre8: ce_pre8,
                                                ce_pre9: ce_pre9,
                                                ce_pre10: ce_pre10,
                                                ce_pre11: ce_pre11,
                                                ce_pre12: ce_pre12,
                                                ce_pre13: ce_pre13,
                                                ce_pre14: ce_pre14,
                                                ce_pre15: ce_pre15,
                                                ce_pre16: ce_pre16,
                                                ce_pre17: ce_pre17,
                                                ce_pre18: ce_pre18,
                                                ce_pre19: ce_pre19,
                                                ce_pre20: ce_pre20,
                                                ce_pre21: ce_pre21,
                                                ce_pre22: ce_pre22,
                                                ce_pre23: ce_pre23,
                                                ce_pre24: ce_pre24,
                                                ce_pre25: ce_pre25,
                                                ce_pre26: ce_pre26,
                                                ce_pre27SI: ce_pre27SI,
                                                ce_pre27NO: ce_pre27NO,
                                                ce_pre27NA: ce_pre27NA,
                                            };
                                            bandera = true;

                                        } else {
                                            bandera = false;
                                            //bandera2 = false;
                                            console.log("No se ejecuto el examen Cuestionario Espirometria pb_004");
                                        }
                                        break;
                                    //Espirometria
                                    case '005':
                                        if (objresponse.pb_005 !== 'N' && objresponse.pb_005 !== 'SIN RESULTADOS') {
                                            console.log("Ejecutando Espirometria");
                                            const dataJSON = JSON.parse(objresponse.pb_005);

                                            const { antecedenteMed, medapmn, des_esp, med_cmp, med_firma, Calidad, conclusion, std_fuma, fecaten } = dataJSON[0];

                                            if (dataJSON[0].recomendaciones && dataJSON[0].recomendaciones.length > 0) {
                                                dataJSON[0].recomendaciones.forEach((objrecomendaciones) => {
                                                    let { desrec, des_control } = objrecomendaciones;
                                                    recomendaciones.push({ desrec, des_control });
                                                });
                                            }

                                            imgDoc = await ValidarFirma('medicos', `${med_firma}.webp`);
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
                                                medapmn: medapmn,
                                                des_esp: des_esp,
                                                med_cmp: med_cmp,
                                                recomendaciones: recomendaciones,
                                                med_firma: imgDoc,
                                                rows: dataJSON
                                            };
                                            bandera = true;

                                        } else {
                                            bandera = false;
                                            //bandera2 = false;
                                            console.log("No se ejecuto el examen Espirometria");
                                        }
                                        break;
                                    //Laboratorio
                                    case '009':
                                        if (objresponse.pb_009 !== 'N' && objresponse.pb_009 !== 'SIN RESULTADOS') {
                                            console.log("Ejecutando Laboratorio");
                                            const dataJSON = JSON.parse(objresponse.pb_009);

                                            const { medapmn, des_esp, med_cmp, med_firma } = dataJSON[0];

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

                                            imgDoc = await ValidarFirma('medicos', `${med_firma}.webp`);

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
                                                medapmn: medapmn,
                                                des_esp: des_esp,
                                                med_cmp: med_cmp,
                                                med_firma: imgDoc,
                                                rows: dataJSON
                                            };
                                            bandera = true;

                                        } else {
                                            bandera = false;
                                            bandera2 = false;
                                            console.log("No se ejecuto el examen Laboratorio");
                                        }
                                        break;
                                    //DiagnosticoImagenes 
                                    case '013':
                                        if (objresponse.pb_013 !== 'N' && objresponse.pb_013 !== 'SIN RESULTADOS') {
                                            console.log("Ejecutando DiagnosticoImagenes");
                                            const dataJSON = JSON.parse(objresponse.pb_013);
                                            const resultadoArray = JSON.parse(dataJSON[0].resultado);

                                            for (const obj of resultadoArray) {
                                                cie10Img = [];
                                                recomendacionesImg = [];
                                                let [nuncom, conclusion, area_actual, fecaten, det_informe, medapmn, des_esp, med_cmp, med_firma] =
                                                    [obj.nuncom, obj.conclusion, obj.area_actual, obj.fecaten, obj.det_informe, obj.medapmn, obj.des_esp, obj.med_cmp, obj.med_firma];
                                                if (obj.diagnosticos && obj.diagnosticos.length > 0) {
                                                    obj.diagnosticos.forEach((objdiagnosticos) => {
                                                        let { diacod, diades } = objdiagnosticos;
                                                        cie10Img.push({ diacod, diades });
                                                    });
                                                }
                                                if (obj.recomendaciones && obj.recomendaciones.length > 0) {
                                                    obj.recomendaciones.forEach((objrecomendaciones) => {
                                                        let { desrec, des_control } = objrecomendaciones;
                                                        recomendacionesImg.push({ desrec, des_control });
                                                    });
                                                }
                                                imgDoc = await ValidarFirma('medicos', `${med_firma}.webp`);
                                                data = {
                                                    numdoc: numdoc,
                                                    appm_nom: appm_nom,
                                                    fecnac: fecnac,
                                                    Edad: Edad,
                                                    des_sexo: des_sexo,
                                                    cargo_actual: cargo_actual,
                                                    area_actual: area_actual,
                                                    fecaten: fecaten,
                                                    det_informe: det_informe,
                                                    conclusion: conclusion,
                                                    nuncom: nuncom,
                                                    cie10Img: cie10Img,
                                                    recomendacionesImg: recomendacionesImg,
                                                    medapmn: medapmn,
                                                    des_esp: des_esp,
                                                    med_cmp: med_cmp,
                                                    med_firma: imgDoc,
                                                }

                                                const renderedHtml1 = mustache.render(htmlTemplate, data);

                                                const page1 = await browser.newPage();
                                                await page1.setContent(renderedHtml1);
                                                const pdfBuffer1 = await page1.pdf({ format: 'A4', printBackground: true, });
                                                const mainPdfDoc1 = await PDFDocument.load(pdfBuffer1);
                                                const updatedPdfBuffer1 = await mainPdfDoc1.save();
                                                // Agregar el buffer del PDF al array
                                                pdfBuffers.push(updatedPdfBuffer1);
                                            }
                                            bandera = true;
                                        } else {
                                            bandera = false;
                                            //bandera2 = false;
                                            console.log("No se ejecuto el examen Diagnostico Imagenes");
                                        }
                                        break;
                                    //FichaMedicoOcupacional312
                                    case '020':
                                        if (objresponse.pb_020 !== 'N' && objresponse.pb_020 !== 'SIN RESULTADOS') {
                                            console.log("Ejecutando FichaMedicoOcupacional312");
                                            const dataJSON = JSON.parse(objresponse.pb_020);
                                            const fechaNacimiento = new Date(fecnac);
                                            const anio = fechaNacimiento.getFullYear();
                                            const mes = ('0' + (fechaNacimiento.getMonth() + 1)).slice(-2);
                                            const dia = fechaNacimiento.getUTCDate();

                                            const { ant_padre, ant_madre, ant_hermanos, num_hijos_vivos, num_hijos_fallecidos,
                                                ant_otros, ant_esposa, ap_alergias, ap_RAM, ap_asma, ap_diabetes, ap_neoplasia,
                                                ap_quemaduras, ap_cirugias, ap_neumonia, ap_HTA, ap_bronquitis, ap_convulsiones,
                                                ap_intoxicaciones, ap_actividad_fisica, ap_pato_tiroides, ap_TBC, ap_hepatitis,
                                                ap_ITS, ap_fiebre_tiroidea, ap_patologia_renal, ap_fracturas, ap_otros, fecaten,
                                                ev_ananesis, ev_ectoscopia, ev_estado_mental, con_eva_psicologica, con_radiograficas,
                                                con_laboratorio, con_audiometria, con_espirometria, con_otros, fecing_empresa, res_lugar_trabajo,
                                                departamentoPAC, provinciaPAC, distritoPAC, departamentoCLI, provinciaCLI, distritoCLI, desexa,
                                                destipseg, medapmn, des_esp, med_cmp, med_firma, area_actual } = dataJSON[0];

                                            const antecedentes_ocupacionalesArray = obtenerArray(dataJSON, "antecedentes_ocupacionales");

                                            const js_habitos_nocibosArray = obtenerArray(dataJSON, "js_habitos_nocibos");

                                            const js_enferm_acciArray = obtenerArray(dataJSON, "js_enferm_acci");

                                            const js_examen_fisicoArray = obtenerArray(dataJSON, "js_examen_fisico");
                                            let P = '';
                                            let D = '';
                                            let R = '';
                                            if (dataJSON[0].diagnosticos && dataJSON[0].diagnosticos.length > 0) {
                                                dataJSON[0].diagnosticos.forEach((objdiagnosticos) => {
                                                    let { diacod, tipdia, diades } = objdiagnosticos;
                                                    cie10.push({ diacod, tipdia, diades });

                                                    if (tipdia === 'P') {
                                                        P = 'P';
                                                    } else if (tipdia === 'D') {
                                                        D = 'D';
                                                    } else if (tipdia === 'R') {
                                                        R = 'R';
                                                    }
                                                });
                                            }
                                            if (dataJSON[0].recomendaciones && dataJSON[0].recomendaciones.length > 0) {
                                                dataJSON[0].recomendaciones.forEach((objrecomendaciones) => {
                                                    let { desrec, des_control } = objrecomendaciones;
                                                    recomendaciones.push({ desrec, des_control });
                                                });
                                            }

                                            imgPac = await ValidarFirma('paciente/firma', firma);
                                            imgDoc = await ValidarFirma('medicos', `${med_firma}.webp`);
                                            fotoPac = await ValidarFirma('paciente/foto', foto);

                                            let Essalud = '';
                                            let EPS = '';
                                            let Otro = '';
                                            if (destipseg === 'Essalud') {
                                                Essalud = 'Essalud';
                                            } else if (destipseg === 'EPS') {
                                                EPS = 'EPS';
                                            } else {
                                                Otro = destipseg;
                                            }

                                            data = {
                                                Essalud: Essalud,
                                                EPS: EPS,
                                                Otro: Otro,
                                                P: P,
                                                D: D,
                                                R: R,
                                                pachis: pachis,
                                                numdoc: numdoc,
                                                appm_nom: appm_nom,
                                                correo: correo,
                                                telefono: telefono,
                                                celular: celular,
                                                desgrainst: desgrainst,
                                                desestciv: desestciv,
                                                numhijos: numhijos,
                                                numdep: numdep,
                                                dire_paci: dire_paci,
                                                dire_clie: dire_clie,
                                                actividad_economica_clie: actividad_economica_clie,
                                                area_actual: area_actual,
                                                fecing_empresa: fecing_empresa,
                                                departamentoPAC: departamentoPAC,
                                                provinciaPAC: provinciaPAC,
                                                distritoPAC: distritoPAC,
                                                departamentoCLI: departamentoCLI,
                                                provinciaCLI: provinciaCLI,
                                                distritoCLI: distritoCLI,
                                                dia: dia,
                                                mes: mes,
                                                anio: anio,
                                                fecnac: fecnac,
                                                Edad: Edad,
                                                des_sexo: des_sexo,
                                                cargo_actual: cargo_actual,
                                                destipcon: destipcon,
                                                razsoc: razsoc,
                                                fecaten: fecaten,
                                                ant_padre: ant_padre,
                                                ant_madre: ant_madre,
                                                ant_hermanos: ant_hermanos,
                                                ant_esposa: ant_esposa,
                                                num_hijos_vivos: num_hijos_vivos,
                                                num_hijos_fallecidos: num_hijos_fallecidos,
                                                ant_otros: ant_otros,
                                                ev_ananesis: ev_ananesis,
                                                ev_ectoscopia: ev_ectoscopia,
                                                ev_estado_mental: ev_estado_mental,
                                                con_eva_psicologica: con_eva_psicologica,
                                                con_radiograficas: con_radiograficas,
                                                con_laboratorio: con_laboratorio,
                                                con_audiometria: con_audiometria,
                                                con_espirometria: con_espirometria,
                                                con_otros: con_otros,
                                                antecedentes_ocupacionalesArray: antecedentes_ocupacionalesArray,
                                                js_habitos_nocibosArray: js_habitos_nocibosArray,
                                                js_enferm_acciArray: js_enferm_acciArray,
                                                js_examen_fisicoArray: js_examen_fisicoArray,
                                                ap_alergias: ap_alergias,
                                                ap_RAM: ap_RAM,
                                                ap_asma: ap_asma,
                                                ap_diabetes: ap_diabetes,
                                                ap_neoplasia: ap_neoplasia,
                                                ap_quemaduras: ap_quemaduras,
                                                ap_cirugias: ap_cirugias,
                                                ap_neumonia: ap_neumonia,
                                                ap_HTA: ap_HTA,
                                                ap_bronquitis: ap_bronquitis,
                                                ap_convulsiones: ap_convulsiones,
                                                ap_intoxicaciones: ap_intoxicaciones,
                                                ap_actividad_fisica: ap_actividad_fisica,
                                                ap_pato_tiroides: ap_pato_tiroides,
                                                ap_TBC: ap_TBC,
                                                ap_hepatitis: ap_hepatitis,
                                                ap_ITS: ap_ITS,
                                                ap_fiebre_tiroidea: ap_fiebre_tiroidea,
                                                ap_patologia_renal: ap_patologia_renal,
                                                ap_fracturas: ap_fracturas,
                                                ap_otros: ap_otros,
                                                desexa: desexa,
                                                cie10: cie10,
                                                recomendaciones: recomendaciones,
                                                firma: imgPac,
                                                med_firma: imgDoc,
                                                foto: fotoPac,
                                                rows: dataJSON
                                            };
                                            bandera = true;
                                            //  
                                        } else {
                                            bandera = false;
                                            //bandera2 = false;
                                            console.log("No se ejecuto el examen FichaMedicoOcupacional312");
                                        }
                                        break;
                                    //Psicologia
                                    case '032':
                                        if (objresponse.pb_032 !== 'N' && objresponse.pb_032 !== 'SIN RESULTADOS') {
                                            console.log("Ejecutando Psicologia");
                                            const dataJSON = JSON.parse(objresponse.pb_032);

                                            const { medapmn, des_esp, med_cmp, med_firma } = dataJSON[0];

                                            const filePath = path.join(__dirname, '..', 'public', 'img', 'medicos', `${med_firma}.webp`);

                                            const imageData = await fs.readFile(filePath);
                                            const base64Image = Buffer.from(imageData).toString('base64');
                                            let img = `${base64Image}`;

                                            data = {
                                                numdoc: numdoc,
                                                appm_nom: appm_nom,
                                                fecnac: fecnac,
                                                Edad: Edad,
                                                des_sexo: des_sexo,
                                                cargo_actual: cargo_actual,
                                                destipcon: destipcon,
                                                razsoc: razsoc,
                                                med_firma: img,
                                                rows: dataJSON
                                            };
                                            bandera = true;

                                        } else {
                                            bandera = false;
                                            //bandera2 = false;
                                            console.log("No se ejecuto el examen Psicologia");
                                        }
                                        break;
                                    //FichaMusculoEsqueletica  
                                    case '033':
                                        if (objresponse.pb_033 !== 'N' && objresponse.pb_033 !== 'SIN RESULTADOS') {
                                            console.log("Ejecutando FichaMusculoEsqueletica");
                                            const dataJSON = JSON.parse(objresponse.pb_033);
                                            const { fecing_empresa, fecaten, medapmn, des_esp, med_cmp, med_firma } = dataJSON[0];

                                            const flex_fuerzaArray = obtenerArray(dataJSON, "flex_fuerza");
                                            const rangos_articularesArray = obtenerArray(dataJSON, "rangos_articulares");

                                            const { valor: valor1flex, observacion: observacion1 } = flex_fuerzaArray[0];
                                            const { valor: valor2flex, observacion: observacion2 } = flex_fuerzaArray[1];
                                            const { valor: valor3flex, observacion: observacion3 } = flex_fuerzaArray[2];
                                            const { valor: valor4flex, observacion: observacion4 } = flex_fuerzaArray[3];

                                            const { valor: valor1rang, pregunta: pregunta1 } = rangos_articularesArray[0];
                                            const { valor: valor2rang, pregunta: pregunta2 } = rangos_articularesArray[1];
                                            const { valor: valor3rang, pregunta: pregunta3 } = rangos_articularesArray[2];
                                            const { valor: valor4rang, pregunta: pregunta4 } = rangos_articularesArray[3];

                                            //Calcula la suma de todos los valores de flex_fuerza
                                            let sumaValorflex_fuerza = 0;
                                            for (let i = 0; i < flex_fuerzaArray.length; i++) {
                                                sumaValorflex_fuerza += parseInt(flex_fuerzaArray[i].valor);
                                            }

                                            let sumaValorrangos_articulares = 0;
                                            for (let i = 0; i < rangos_articularesArray.length; i++) {
                                                sumaValorrangos_articulares += parseInt(rangos_articularesArray[i].valor);
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

                                            imgDoc = await ValidarFirma('medicos', `${med_firma}.webp`);

                                            data = {
                                                numdoc: numdoc,
                                                appm_nom: appm_nom,
                                                fecnac: fecnac,
                                                Edad: Edad,
                                                des_sexo: des_sexo,
                                                cargo_actual: cargo_actual,
                                                destipcon: destipcon,
                                                razsoc: razsoc,
                                                valor1flex: valor1flex,
                                                valor2flex: valor2flex,
                                                valor3flex: valor3flex,
                                                valor4flex: valor4flex,
                                                observacion1: observacion1,
                                                observacion2: observacion2,
                                                observacion3: observacion3,
                                                observacion4: observacion4,

                                                valor1rang: valor1rang,
                                                valor2rang: valor2rang,
                                                valor3rang: valor3rang,
                                                valor4rang: valor4rang,

                                                pregunta1: pregunta1,
                                                pregunta2: pregunta2,
                                                pregunta3: pregunta3,
                                                pregunta4: pregunta4,

                                                sumaValorflex_fuerza: sumaValorflex_fuerza,
                                                sumaValorrangos_articulares: sumaValorrangos_articulares,
                                                cie10: cie10,
                                                recomendaciones: recomendaciones,
                                                fecaten: fecaten,
                                                fecing_empresa: fecing_empresa,
                                                medapmn: medapmn,
                                                des_esp: des_esp,
                                                med_cmp: med_cmp,
                                                med_firma: imgDoc,
                                            };
                                            bandera = true;
                                            //  
                                        } else {
                                            bandera = false;
                                            bandera2 = false;
                                            console.log("No se ejecuto el examen FichaMusculoEsqueletica");
                                        }
                                        break;
                                }
                            }

                        };
                        if (bandera && codigo !== '13') {
                            const renderedHtml = mustache.render(htmlTemplate, data);

                            const page = await browser.newPage();
                            await page.setContent(renderedHtml);
                            const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, });
                            const mainPdfDoc = await PDFDocument.load(pdfBuffer);
                            if (doc_adjunto !== '') {
                                const filePathDocAdj = path.join(__dirname, '..', 'public', 'documentos', `${doc_adjunto}`);
                                const docAdjBuffer = await fs.readFile(filePathDocAdj);
                                const docadjPdf = await PDFDocument.load(docAdjBuffer);
                                const copias = await mainPdfDoc.copyPages(docadjPdf, docadjPdf.getPageIndices());

                                for (const copia of copias) {
                                    mainPdfDoc.addPage(copia);
                                }
                            }
                            const updatedPdfBuffer = await mainPdfDoc.save();
                            // Añadir el PDF al subdirectorio del ID
                            archive.append(updatedPdfBuffer, { name: `${nombres}/${codigo}.pdf` });
                        }
                    }
                }

                // Cerrar la instancia de Puppeteer
                await browser.close();

                // Finalizar y cerrar el archivo ZIP
                archive.finalize();
            } else {
                res.status(400).send('Error: El parámetro citas_id no es un array válido o está vacío.');
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('Error al generar el ZIP');
        }
    },

    async getdescargapruebas(req, res) {
        const { id } = req.params;
        const pool = await getConnection();
        const pruebas = await pool.query(`pa_SelDescargaExamenes '${id}'`);
        res.json(pruebas.recordset);
    },

    async getpacientesdescargalist(req, res) {
        let { fechainicio, fechafin, protocolo, empresa } = req.query;
        const pool = await getConnection();
        const pacientescitados = await pool.query(`pa_SelPacientesDescargaList '${fechainicio}','${fechafin}','${protocolo}','${empresa}'`);
        if (pacientescitados.recordset === undefined) {
            res.json([]);
        } else {
            res.json(pacientescitados.recordset);
        }
    }
};

// Función para combinar varios PDFs en uno solo
async function mergePDFs(pdfBuffers) {
    const combinedPdfDoc = await PDFDocument.create();

    for (const pdfBuffer of pdfBuffers) {
        const pdfDoc = await PDFDocument.load(pdfBuffer);
        const copiedPages = await combinedPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page) => combinedPdfDoc.addPage(page));
    }
    return combinedPdfDoc.save();
};

async function obtenerImagenBase64(med_firmaA) {
    try {
        const rutaImagen = path.join(__dirname, '..', 'public', 'img', 'medicos', `${med_firmaA}.webp`);
        const data = await fs.readFile(rutaImagen);
        const med_firmaF = Buffer.from(data).toString('base64');
        return med_firmaF;
    } catch (err) {
        console.error('Error al leer el archivo:', err);
        //throw err;
    }
};

async function ValidarFirma(basePath, fileName) {
    if (fileName && fileName !== '.webp' && fileName !== 'undefined.webp' && fileName !== 'undefined') {
        const filePath = path.join(__dirname, '..', 'public', 'img', basePath, fileName);
        try {
            await fs.access(filePath); // Verifica si el archivo existe
            const imageData = await fs.readFile(filePath);
            return Buffer.from(imageData).toString('base64');
        } catch (error) {
            if (error.code === 'ENOENT') { // Maneja el caso en que el archivo no existe
                console.error(`El archivo ${fileName} no existe en la ruta ${filePath}`);
                return ''; // Devuelve un valor vacío si el archivo no existe
            }
            throw error; // Relanza cualquier otro error diferente a "ENOENT"
        }
    }
    return '';
};