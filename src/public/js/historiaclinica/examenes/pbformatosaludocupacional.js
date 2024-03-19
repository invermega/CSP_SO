(function poblarcampos(){

    
    let nuncom = document.getElementById('nuncom');
    //Variables de Signos pb_001(SignosVitales)
    let despar = document.getElementById('despar');


    //
    let aptitud_espaldainput = document.getElementById('aptitud_espalda');

   
    let doc_adic_id = document.getElementById('doc_adic_id');
    
$.ajax({
    url: '/resultformatosaludocupacional',
    method: "GET",
    data: {
        //cita_id: '3,4,5,6,7,8,9,10,11,12,13,14,15',
        
        //soexa: '001,003,005,009,013,020,033,004'
    },
    success: function (result){
        if(result[0].mensaje != 'sin datos'){
                //Entro a la columna pb_001(SignosVitales) --YA
                /*if (result[0].pb_001 && result[0].pb_001.trim().toLowerCase() !== 'sin resultados') {
                    let SignosVitalesArray = JSON.parse(result[0].pb_001);
                    SignosVitalesArray.forEach(objSignosVitalesArray => {
                        console.log(objSignosVitalesArray);
                        });
                } else {
                    console.log(`Columna "Signos Vitales" SIN RESULTADOS para cita_id: ${result[0].cita_id}`);
                }*/          
                //Entro a la columna pb_003(Audiometria) --YA
                /*if(result[0].pb_003){
                    
                    function procesarArray(array, incluirObs = false) {
                        array.forEach(item => {
                            let { texto, valor, radio, obs } = item;                                       
                            if (!incluirObs) {
                                // Si no es necesario incluir 'obs', puedes omitirlo
                                delete item.obs;
                            }
                        });
                    }
                    let AudiometriaArray = JSON.parse(result[0].pb_003);
                    AudiometriaArray.forEach(item => {
                        let {logoaudiometria_oido_der,logoaudiometria_oido_izq,tiem_exp_hrs, uso_pro_uditivo, apre_ruido, desequi, nuncom, cita_id, doc_adic_id, 
                            nomarch, rutarch } = item;
                        // Recorre el json de la columna ante_relacionados
                        if (result[0].ante_relacionados) {
                            procesarArray(JSON.parse(result[0].ante_relacionados), true);
                        }

                        // Recorre el json de la columna sintomas_actuales
                        if (result[0].sintomas_actuales) {
                            procesarArray(JSON.parse(result[0].sintomas_actuales), true);
                        }

                        // Recorre el json de la columna otos_oidos_derecho
                        if (result[0].otos_oido_derecho) {
                            procesarArray(JSON.parse(result[0].otos_oido_derecho));
                        }

                        // Recorre el json de la columna otos_oido_izquierdo
                        if (result[0].otos_oido_izquierdo) {
                            procesarArray(JSON.parse(result[0].otos_oido_izquierdo));
}

                        //Recorre el json de la columna val_oido_derechoArray 
                        var val_oido_derechoArray = JSON.parse(result[0].val_oido_derecho);
                        val_oido_derechoArray.forEach(item => {
                                Object.keys(item).forEach(clave => {
                                    if (clave !== "fila") {
                                        let [prefijo] = clave.split('_');
                                        let identificador;

                                        if (item.fila === "V.A.") {
                                            identificador = 'va_d_' + prefijo;
                                        } else if (item.fila === "V.O.") {
                                            identificador = 'vo_d_' + prefijo;
                                        }

                                        let inputSelector = '#' + identificador;
                                        if ($(inputSelector).closest('table').attr('id') === 'val_oido_derecho') {
                                            let inputValue = item[clave];
                                            $(inputSelector).val(inputValue);
                                        }
                                    }
                                });
                            });
                        //Recorre el json de la columna val_oido_izquierdoArray 
                        var val_oido_izquierdoArray = JSON.parse(result[0].val_oido_izquierdo);
                        val_oido_izquierdoArray.forEach(item => {
                                Object.keys(item).forEach(clave => {
                                    if (clave !== "fila") {
                                        let [prefijo] = clave.split('_');
                                        let identificador;

                                        if (item.fila === "V.A.") {
                                            identificador = 'va_i_' + prefijo;
                                        } else if (item.fila === "V.O.") {
                                            identificador = 'vo_i_' + prefijo;
                                        }

                                        let inputSelector = '#' + identificador;
                                        if ($(inputSelector).closest('table').attr('id') === 'val_oido_izquierdo') {
                                            let inputValue = item[clave];
                                            $(inputSelector).val(inputValue);
                                        }
                                    }
                                });
                            });
                    });          
                }*/

                 //Entro a la columna pb_004(CEspirometria) -YA
                if(result[0].pb_004 && result[0].pb_004.trim().toLowerCase() !== 'sin resultados'){
                    let CEspirometriaArray = JSON.parse(result[0].pb_004);
                    CEspirometriaArray.forEach(objCEspirometria => {
                        console.log(objCEspirometria)                   
                    });
                }else{
                    console.log(`Columna "CEspirometria" SIN RESULTADOS para cita_id: ${result[0].cita_id}`);
                }
                /*
                //Entro a la columna pb_005(Espirometria) -YA
                if(result[0].pb_005){
                    let EspirometriaArray = JSON.parse(result[0].pb_005);
                    EspirometriaArray.forEach(item => {
                        let { parexa_id, despar, unidad, valor_ref, mejor_valor, Mejor_val_porc, valor_pre1, valor_pre2, valor_pre3, Calidad, conclusion, std_fuma, 
                            statitulo, nuncom, cita_id, doc_adic_id, nomarch, rutarch } = item;
                        console.log(`despar: ${despar}, valor_ref: ${valor_ref}, conclusion: ${conclusion}`);
                    });             
                }
                //Entro a la columna pb_009(Laboratorio)
                if(result[0].pb_009){
                    let LaboratorioArray = JSON.parse(result[0].pb_009);
                    LaboratorioArray.forEach(item => {
                        let { labprid, titulo, metodo, analisis, result, unid, valref, edad, nuncom, doc_adic_id, nomarch, rutarch } = item;
                    });

                }
                //Entro a la columna pb_013(DiagnosticoImagenes) - YA
                if(result[0].pb_013){
                    let DiagnosticoImagenesArray = JSON.parse(result[0].pb_013);
                    DiagnosticoImagenesArray.forEach(item => {
                        let { det_informe, conclusion, nuncom, doc_adic_id, nomarch, rutarch } = item;
                    });                   
                }
                //Entro a la columna pb_020(FichaMedicoOcupacional312)
                if (result[0].pb_020) {
                    let FichaMedicoOcupacional312Array = JSON.parse(result[0].pb_020);
                    FichaMedicoOcupacional312Array.forEach(item => {
                        // Desestructuración de FichaMedicoOcupacional312
                 
                        let {ante_padre,ant_madre,ant_hermanos,num_hios_vivos,num_hijos_fallecidos,ant_otros,ev_nanesis,ev_ectoscopia,ev_estado_mental,con_eva_psicologica,
                            con_radiograficas,con_laboratorio,con_audiometria,con_espirometria,con_otros,tipresult_id,ant_esposa,ap_alergias,ap_RAM,ap_asma,ap_diabetes,
                            ap_neoplasia,ap_quemaduras,ap_cirugias,ap_neumonia,ap_HTA,ap_bronquitis,ap_convulsiones,ap_intoxicaciones,ap_actividad_fisica,ap_pato_tiroides,
                            ap_TBC,ap_hepatitis,ap_ITS,ap_fiebre_tiroidea,ap_patologia_renal,ap_fracturas,ap_otros,nuncom,cita_id,doc_adic_id,nomarch,rutarch} = item;              
                        // Desestructuración de js_enferm_acci
                        if (result[0].js_enferm_acci) {
                            let js_enferm_acciArray = JSON.parse(result[0].js_enferm_acci);
                            js_enferm_acciArray.forEach(enfermAcciItem => {
                                let {ord,enfermedad,asostrab,año,diasdescanso,} = enfermAcciItem;
                            });
                        }
                
                        // Desestructuración de js_examen_fisico
                        if (result[0].js_examen_fisico) {
                            let js_examen_fisicoArray = JSON.parse(result[0].js_examen_fisico);
                            js_examen_fisicoArray.forEach(examenFisicoItem => {
                                let {organo,sinhallazgo,conhallazgo,} = examenFisicoItem;                            });
                        }
                
                        // Desestructuración de js_habitos_nocibos
                        if (result[0].js_habitos_nocibos) {
                            let js_habitos_nocibosArray = JSON.parse(result[0].js_habitos_nocibos);
                            js_habitos_nocibosArray.forEach(habitosNocibosItem => {
                                let {habito,tipo,cantidad,frecuencia,} = habitosNocibosItem;                            });
                        }
                
                        // Desestructuración de antecedentes_ocupacionales
                        if (result[0].antecedentes_ocupacionales) {
                            let antecedentes_ocupacionalesArray = JSON.parse(result[0].antecedentes_ocupacionales);
                            antecedentes_ocupacionalesArray.forEach(antecedentesOcupacionalesItem => {
                                let {empresa,area_trabajo,ocupacion,fec_ini,fec_fin,tiempo,pel_ries_ocup,epp,} = antecedentesOcupacionalesItem;
                            });
                        }
                    });
                }
                
                //Entro a la columna pb_032(Psicologia), falta programar
                if(result[0].pb_032){


                }
                //Entro a la columna pb_033(FichaMusculoEsqueletica)
                if (result[0].pb_033) {
                    nuncom.value = result[0].nuncom;
                    aptitud_espaldainput.value = result[0].aptitud_espalda;
                
                    // Desestructuración de flex_fuerza
                    if (result[0].flex_fuerza) {
                        let flex_fuerzaArray = JSON.parse(result[0].flex_fuerza);
                        for (let i = 0; i < flex_fuerzaArray.length && i < 4; i++) {
                            let { tipo, valor, observacion } = flex_fuerzaArray[i];
                        }
                    }
                
                    // Desestructuración de rangos_articulares
                    if (result[0].rangos_articulares) {
                        let rangos_articularesArray = JSON.parse(result[0].rangos_articulares);
                        for (let i = 0; i < rangos_articularesArray.length && i < 4; i++) {
                            let { tipo, valor, pregunta } = rangos_articularesArray[i];
                        }
                    }
                
                    doc_adic_id.value = result[0].doc_adic_id;
                    if (result[0].doc_adic_id !== '0') {
                        resultcrearMiniatura(result[0].rutarch, result[0].nomarch);
                    }
                }*/
                
                


        }

    },
    error: function(Examenes){
        alert('error')
    }
});

})();