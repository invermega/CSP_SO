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


async function getFormatoSaludOcu(cita_id, soexa, res, req) {

    const pool = await getConnection();
    const examenes = await pool.query(`pa_SelFormatoSaludOcupacional '${cita_id}','${soexa}'`);
    pool.close();
    return examenes.recordset;
}

module.exports = {
    async getexportarinformeconsolidado(req, res) {
        const examenes = req.query.examenes;
        const citas_id = req.query.citas_id;
        let response;
        let htmlPath;
        try {

            //console.log(citas_id, examenes);

            // Verificar si citas_id es un array y está definido
            if (Array.isArray(citas_id) && citas_id.length > 0) {
                // Configurar Puppeteer con el nuevo modo Headless
                const browser = await puppeteer.launch({
                    headless: 'shell',
                    timeout: 13000
                });

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


                response = await getFormatoSaludOcu(citas_idResult, examenesResult, res, req);
                //console.log(response);
                for (const id of citas_id) {
                    let bandera = true;
                    let bandera2 = true;
                    // Crear un PDF combinado para cada ID
                    const pdfBuffers = [];
                    // Iterar sobre cada código de examen
                    //console.log("id_Paciente:", id);
                    for (const codigo of examenes) {

                        let data = {};
                        htmlPath = `src/templates/${codigo}.html`;
                        const htmlTemplate = await fs.readFile(htmlPath, 'utf-8');
                        let doc_adjunto = '';

                        for (const objresponse of response) {
                            let paciente = JSON.parse(objresponse.paciente);
                            let { pachis, appaterno, apmaterno, nombres, appm_nom, numdoc, fecnac, Edad, cod_ubigeo, correo, telefono,
                                celular, numhijos, numdep, foto, huella, firma, des_sexo, desgrainst,
                                desestciv, destipcon, cargo_actual, razsoc, dire_clie, actividad_economica_clie, dire_paci } = paciente[0];
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
                                            bandera2 = false;
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
                                                logoaudiometriaDer: logoaudiometriaDer,
                                                logoaudiometriaIzq: logoaudiometriaIzq,
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
                                            bandera2 = false;
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
                                            huellaPac = await ValidarFirma('paciente/huella', huella);
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

                                        } else {
                                            bandera = false;
                                            bandera2 = false;
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
                                            bandera2 = false;
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
                                                    razsoc: razsoc,
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
                                                    imgDoc: imgDoc,
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
                                            bandera2 = false;
                                            console.log("No se ejecuto el examen FichaMedicoOcupacional312");
                                        }
                                        break;
                                    //FichaMedicoOcupacional312
                                    case '020':
                                        if (objresponse.pb_020 !== 'N' && objresponse.pb_020 !== 'SIN RESULTADOS') {
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
                                                con_laboratorio, con_audiometria, con_espirometria, con_otros, fecing_empresa,
                                                departamentoPAC, provinciaPAC, distritoPAC, departamentoCLI, provinciaCLI, distritoCLI, desexa,
                                                res_lugar_trabajo, destipseg, desvalapt, medapmn, des_esp, med_cmp, med_firma, area_actual } = dataJSON[0];

                                            let [preocuficha, periodicaficha, retiroficha, otrosficha] = ['', '', '', ''];
                                            if (desexa === 'PRE OCUPACIONAL') {
                                                preocuficha = 'X';
                                            } else if (desexa === 'PERIODICO') {
                                                periodicaficha = 'X';
                                            } else if (desexa === 'RETIRO') {
                                                retiroficha = 'X';
                                            } else {
                                                otrosficha = desexa;
                                            }

                                            let [ResiSi, ResiNO] = ['', ''];
                                            if (res_lugar_trabajo !== 'N') {
                                                ResiSi = 'X';
                                            } else {
                                                ResiNO = 'X';
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
                                                    cie10.push({ diacod, tipdia, diades });

                                                    if (tipdia === 'P') {
                                                        P = 'X';
                                                    } else if (tipdia === 'D') {
                                                        D = 'X';
                                                    } else if (tipdia === 'R') {
                                                        R = 'X';
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

                                            let [Essalud, EPS, Otro] = ['', '', ''];
                                            if (destipseg === 'Essalud') {
                                                Essalud = 'Essalud';
                                            } else if (destipseg === 'EPS') {
                                                EPS = 'EPS';
                                            } else {
                                                Otro = destipseg;
                                            }

                                            const signos_vitalesArray = obtenerArray(dataJSON, "signos_vitales");

                                            const FC = signos_vitalesArray[0].Resultados;
                                            const FR = signos_vitalesArray[1].Resultados;
                                            const PA = signos_vitalesArray[2].Resultados;
                                            const Sat_02 = signos_vitalesArray[3].Resultados;
                                            const Peso = signos_vitalesArray[4].Resultados;
                                            const Talla = signos_vitalesArray[5].Resultados;
                                            const IMC = signos_vitalesArray[6].Resultados;
                                            const PerimetroAbdo = signos_vitalesArray[7].Resultados;
                                            const Temp = signos_vitalesArray[8].Resultados;

                                            const FCmed = signos_vitalesArray[0].Unimed;
                                            const FRmed = signos_vitalesArray[1].Unimed;
                                            const PAmed = signos_vitalesArray[2].Unimed;
                                            const Sat_02med = signos_vitalesArray[3].Unimed;
                                            const Pesomed = signos_vitalesArray[4].Unimed;
                                            const Tallamed = signos_vitalesArray[5].Unimed;
                                            const IMCmed = signos_vitalesArray[6].Unimed;
                                            const PerimetroAbdomed = signos_vitalesArray[7].Unimed;
                                            const Tempmed = signos_vitalesArray[8].Unimed;

                                            let [Apto, AptoRestri, NoApto, Obser, Evaluado, Pendiente] = ['', '', '', '', '', ''];
                                            if (desvalapt === 'Apto') {
                                                Apto = 'X';
                                            } else if (desvalapt === 'Apto con Restricciones') {
                                                AptoRestri = 'X';
                                            } else if (desvalapt === 'No Apto') {
                                                NoApto = 'X';
                                            } else if (desvalapt === 'Con Observaciones') {
                                                Obser = 'X';
                                            } else if (desvalapt === 'Evaluado') {
                                                Evaluado = 'X';
                                            } else if (desvalapt === 'Pendiente') {
                                                Pendiente = 'X';
                                            }

                                            data = {
                                                preocuficha: preocuficha,
                                                periodicaficha: periodicaficha,
                                                retiroficha: retiroficha,
                                                otrosficha: otrosficha,
                                                ResiSi: ResiSi,
                                                ResiNO: ResiNO,
                                                FC: FC,
                                                FR: FR,
                                                PA: PA,
                                                Sat_02: Sat_02,
                                                Peso: Peso,
                                                Talla: Talla,
                                                IMC: IMC,
                                                PerimetroAbdo: PerimetroAbdo,
                                                Temp: Temp,

                                                FCmed: FCmed,
                                                FRmed: FRmed,
                                                PAmed: PAmed,
                                                Sat_02med: Sat_02med,
                                                Pesomed: Pesomed,
                                                Tallamed: Tallamed,
                                                IMCmed: IMCmed,
                                                PerimetroAbdomed: PerimetroAbdomed,
                                                Tempmed: Tempmed,

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
                                                firma: imgPac,
                                                med_firma: imgDoc,
                                                foto: fotoPac,
                                                rows: dataJSON
                                            };
                                            bandera = true;

                                        } else {
                                            bandera = false;
                                            bandera2 = false;
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
                                            bandera2 = false;
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

                        const renderedHtml = mustache.render(htmlTemplate, data);

                        const page = await browser.newPage();
                        await page.setContent(renderedHtml);
                        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, });
                        const mainPdfDoc = await PDFDocument.load(pdfBuffer);

                        /*if (doc_adjunto !== '') {
                            const filePathDocAdj = path.join(__dirname, '..', 'public', 'documentos', `${doc_adjunto}.pdf`);
                            const docAdjBuffer = await fs.readFile(filePathDocAdj);
                            const docadjPdf = await PDFDocument.load(docAdjBuffer);
                            const copias = await mainPdfDoc.copyPages(docadjPdf, docadjPdf.getPageIndices());

                            for (const copia of copias) {
                                mainPdfDoc.addPage(copia);
                            }
                        }*/
                        const updatedPdfBuffer = await mainPdfDoc.save();
                        // Agregar el buffer del PDF al array
                        pdfBuffers.push(updatedPdfBuffer);

                    }

                    // Combinar los buffers de PDF en uno solo
                    const combinedPdfBuffer = await mergePDFs(pdfBuffers);

                    // Convertir el PDF combinado a Buffer antes de añadirlo al ZIP
                    const combinedPdfBufferStream = new Readable();
                    combinedPdfBufferStream.push(combinedPdfBuffer);
                    combinedPdfBufferStream.push(null);

                    // Añadir el PDF combinado al ZIP con el nombre del ID
                    archive.append(combinedPdfBufferStream, { name: `${id}.pdf` });

                }

                // Cerrar la instancia de Puppeteer
                await browser.close();

                // Finalizar y cerrar el archivo ZIP
                archive.finalize();
            } else {
                res.status(400).send(`${examenes} | ${citas_id}`);
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send(`${error}, ${examenes}, ${citas_id}, ${response},${htmlPath}`);
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
                                            bandera2 = false;
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
                                            bandera2 = false;
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
                                            bandera2 = false;
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
                                            bandera2 = false;
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
                                            bandera2 = false;
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
                                            bandera2 = false;
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
                                            bandera2 = false;
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

                        const renderedHtml = mustache.render(htmlTemplate, data);

                        const page = await browser.newPage();
                        await page.setContent(renderedHtml);
                        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, });
                        const mainPdfDoc = await PDFDocument.load(pdfBuffer);
                        if (doc_adjunto !== '') {
                            const filePathDocAdj = path.join(__dirname, '..', 'public', 'documentos', `${doc_adjunto}.pdf`);
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
        console.log(id);
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