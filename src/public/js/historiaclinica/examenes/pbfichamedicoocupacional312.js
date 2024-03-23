function poblarInfo() {
    let cita_id = document.getElementById('id').value;
    let Nroficha = document.getElementById('Nroficha');
    let fechaficha = document.getElementById('fechaficha');
    let preocuficha = document.getElementById('preocuficha');
    let periodicaficha = document.getElementById('periodicaficha');
    let retiroficha = document.getElementById('retiroficha');
    let otrosficha = document.getElementById('otrosficha');
    let puestraficha = document.getElementById('puestraficha');
    let artraficha = document.getElementById('artraficha');
    let razemp = document.getElementById('razemp');
    let actecoemp = document.getElementById('actecoemp');
    let trabjemp = document.getElementById('trabjemp');
    let depaemp = document.getElementById('depaemp');
    let provemp = document.getElementById('provemp');
    let distemp = document.getElementById('distemp');
    let puespostemp = document.getElementById('puespostemp');
    let nombapefiltra = document.getElementById('nombapefiltra');
    let diafiltra = document.getElementById('diafiltra');
    let mesfiltra = document.getElementById('mesfiltra');
    let añofiltra = document.getElementById('añofiltra');
    let edadfiltra = document.getElementById('edadfiltra');
    let dnifiltra = document.getElementById('dnifiltra');
    let dirfiltra = document.getElementById('dirfiltra');
    let numfiltra = document.getElementById('numfiltra');
    let distfiltra = document.getElementById('distfiltra');
    let provfiltra = document.getElementById('provfiltra');
    let depafiltra = document.getElementById('depafiltra');
    let sifiltra = document.getElementById('sifiltra');
    let nofiltra = document.getElementById('nofiltra');
    let trfiltra = document.getElementById('trfiltra');
    let essaludfiltra = document.getElementById('essaludfiltra');
    let epsfiltra = document.getElementById('epsfiltra'); Nroficha
    let otrofiltra = document.getElementById('otrofiltra');
    let mailfiltra = document.getElementById('mailfiltra');
    let telfiltra = document.getElementById('telfiltra');
    let celfiltra = document.getElementById('celfiltra');
    let escivfiltra = document.getElementById('escivfiltra');
    let grinsfiltra = document.getElementById('grinsfiltra');
    let hvfiltra = document.getElementById('hvfiltra');
    let depfiltra = document.getElementById('depfiltra');

    $.ajax({
        url: '/datosPacienteFicha312',
        method: "GET",
        data: {
            cita_id: cita_id
        },
        success: function (result) {
            if (result[0].mensaje != 'sin datos') {
                Nroficha.textContent = '';
                fechaficha.textContent = result[0].fecprocita;
                if (result[0].desexa === 'PRE OCUPACIONAL') {
                    preocuficha.textContent = 'X';
                } else if (result[0].desexa === 'PERIODICO') {
                    periodicaficha.textContent = 'X';
                } else if (result[0].desexa === 'RETIRO') {
                    retiroficha.textContent = 'X';
                } else {
                    otrosficha.textContent = result[0].desexa;
                }
                puestraficha.textContent = result[0].cargo_actual;
                artraficha.textContent = result[0].area_actual;
                razemp.textContent = result[0].razsoc;
                actecoemp.textContent = result[0].actividad_economica;
                trabjemp.textContent = result[0].Direccion;
                depaemp.textContent = result[0].cldistrito;
                provemp.textContent = result[0].clprovincia;
                distemp.textContent = result[0].cldepartamento;
                puespostemp.textContent = result[0].clpuesto;
                nombapefiltra.textContent = result[0].appm_nom;
                diafiltra.textContent = result[0].fecnacDia;
                mesfiltra.textContent = result[0].fecnacMes;
                añofiltra.textContent = result[0].fecnacAnio;
                edadfiltra.textContent = result[0].Edad;
                dnifiltra.textContent = result[0].Dni;
                dirfiltra.textContent = result[0].dirdes;
                numfiltra.textContent = result[0].dirnum;
                distfiltra.textContent = result[0].distrito;
                provfiltra.textContent = result[0].provincia;
                depafiltra.textContent = result[0].departamento;
                if (result[0].res_lugar_trabajo === 'SI') {
                    sifiltra.textContent = 'X';
                } else {
                    nofiltra.textContent = 'X';
                }
                trfiltra.textContent = result[0].res_lugar_trabajo_des;
                if (result[0].destipseg === 'ESSALUD') {
                    essaludfiltra.textContent = 'X'
                } else if (result[0].destipseg === 'EPS') {
                    epsfiltra.textContent = 'X'
                } else {
                    otrofiltra.textContent = result[0].destipseg
                }
                mailfiltra.textContent = result[0].correo;
                telfiltra.textContent = result[0].telefono;
                celfiltra.textContent = result[0].celular;
                escivfiltra.textContent = result[0].desestciv;
                grinsfiltra.textContent = result[0].desgrainst;
                hvfiltra.textContent = result[0].numhijos;
                depfiltra.textContent = result[0].numdep;
            }
        },
        error: function (Examenes) {
            alert('error');
        }
    });


}

(function poblarcampos() {
    poblarInfo();
    let cita_id = document.getElementById('id').value;
    let soexa = document.getElementById('soexa').value;
    let nuncom = document.getElementById('nuncom');
    let ap_alergias = document.getElementById('alerantpato');
    let ap_RAM = document.getElementById('ramantpato');
    let ap_asma = document.getElementById('asmaantpato');
    let ap_HTA = document.getElementById('htaantpato');
    let ap_TBC = document.getElementById('tbcantpato');
    let ap_diabetes = document.getElementById('diabeantpato');
    let ap_bronquitis = document.getElementById('bronqantpato');
    let ap_hepatitis = document.getElementById('hepaantpato');
    let ap_neoplasia = document.getElementById('neoantpato');
    let ap_convulsiones = document.getElementById('convantpato');
    let ap_ITS = document.getElementById('itsantpato');
    let ap_quemaduras = document.getElementById('quemantpato');
    let ap_intoxicaciones = document.getElementById('intoxantpato');
    let ap_fiebre_tiroidea = document.getElementById('fitiantpato');
    let ap_cirugias = document.getElementById('cirantpato');
    let ap_actividad_fisica = document.getElementById('acfiantpato');
    let ap_patologia_renal = document.getElementById('pareantpato');
    let ap_neumonia = document.getElementById('neuantpato');
    let ap_pato_tiroides = document.getElementById('patiantpato');
    let ap_fracturas = document.getElementById('fracantpato');
    let ap_otros = document.getElementById('otrosantpato');
    let ant_padre = document.getElementById('padreantoatofam');
    let ant_madre = document.getElementById('madreantoatofam');
    let ant_hermanos = document.getElementById('hermantoatofam');
    let ant_esposa = document.getElementById('espantoatofam');
    let num_hijos_vivos = document.getElementById('hvantoatofam');
    let num_hijos_fallecidos = document.getElementById('hfantoatofam');
    let ant_otros = document.getElementById('otrosantoatofam');
    let ev_ananesis = document.getElementById('anamevamed');
    let ev_ectoscopia = document.getElementById('ectoevamed');
    let ev_estado_mental = document.getElementById('esmeevamed');
    let con_eva_psicologica = document.getElementById('conevapsico');
    let con_radiograficas = document.getElementById('conradio');
    let con_laboratorio = document.getElementById('hallpatolab');
    let con_audiometria = document.getElementById('conaudio');
    let con_espirometria = document.getElementById('conespiro');
    let con_otros = document.getElementById('concluotros');
    let Apto = document.getElementById("Apto");
    let AptoRestricciones = document.getElementById("AptoRestricciones");
    let NoApto = document.getElementById("NoApto");
    let ConObservaciones = document.getElementById("ConObservaciones");
    let Evaluado = document.getElementById("Evaluado");
    let Pendiente = document.getElementById("Pendiente");
    let restricciones = $('#restricciones');

    let empantocu1 = document.getElementById('empantocu1');
    let areaantocu1 = document.getElementById('areaantocu1');
    let ocupantocu1 = document.getElementById('ocupantocu1');
    let inicioantocu1 = document.getElementById('inicioantocu1');
    let finantocu1 = document.getElementById('finantocu1');
    let tiempoocu1 = document.getElementById('tiempoocu1');
    let peliantocu1 = document.getElementById('peliantocu1');
    let eqprantocu1 = document.getElementById('eqprantocu1');

    let empantocu2 = document.getElementById('empantocu2');
    let areaantocu2 = document.getElementById('areaantocu2');
    let ocupantocu2 = document.getElementById('ocupantocu2');
    let inicioantocu2 = document.getElementById('inicioantocu2');
    let finantocu2 = document.getElementById('finantocu2');
    let tiempoocu2 = document.getElementById('tiempoocu2');
    let peliantocu2 = document.getElementById('peliantocu2');
    let eqprantocu2 = document.getElementById('eqprantocu2');

    let empantocu3 = document.getElementById('empantocu3');
    let areaantocu3 = document.getElementById('areaantocu3');
    let ocupantocu3 = document.getElementById('ocupantocu3');
    let inicioantocu3 = document.getElementById('inicioantocu3');
    let finantocu3 = document.getElementById('finantocu3');
    let tiempoocu3 = document.getElementById('tiempoocu3');
    let peliantocu3 = document.getElementById('peliantocu3');
    let eqprantocu3 = document.getElementById('eqprantocu3');

    let altipoantpato = document.getElementById('altipoantpato');
    let alcantantpato = document.getElementById('alcantantpato');
    let alfrecantpato = document.getElementById('alfrecantpato');

    let tatipoantpato = document.getElementById('tatipoantpato');
    let tacantantpato = document.getElementById('tacantantpato');
    let tafrecantpato = document.getElementById('tafrecantpato');

    let drtipoantpato = document.getElementById('drtipoantpato');
    let drcantantpato = document.getElementById('drcantantpato');
    let drfrecantpato = document.getElementById('drfrecantpato');

    let mdtipoantpato = document.getElementById('mdtipoantpato');
    let mdcantantpato = document.getElementById('mdcantantpato');
    let mdfrecantpato = document.getElementById('mdfrecantpato');

    let enfantoatofam1 = document.getElementById('enfantoatofam1');
    let siantoatofam1 = document.getElementById('siantoatofam1');
    let noantoatofam1 = document.getElementById('noantoatofam1');
    let añoantoatofam1 = document.getElementById('añoantoatofam1');
    let desantoatofam1 = document.getElementById('desantoatofam1');

    let enfantoatofam2 = document.getElementById('enfantoatofam2');
    let siantoatofam2 = document.getElementById('siantoatofam2');
    let noantoatofam2 = document.getElementById('noantoatofam2');
    let añoantoatofam2 = document.getElementById('añoantoatofam2');
    let desantoatofam2 = document.getElementById('desantoatofam2');

    let enfantoatofam3 = document.getElementById('enfantoatofam3');
    let siantoatofam3 = document.getElementById('siantoatofam3');
    let noantoatofam3 = document.getElementById('noantoatofam3');
    let añoantoatofam3 = document.getElementById('añoantoatofam3');
    let desantoatofam3 = document.getElementById('desantoatofam3');

    let pielsinhevamed = document.getElementById('pielsinhevamed');
    let pielconhevamed = document.getElementById('pielconhevamed');
    let cabesinhevamed = document.getElementById('cabesinhevamed');
    let cabeconhevamed = document.getElementById('cabeconhevamed');
    let ojansinhevamed = document.getElementById('ojansinhevamed');
    let ojanconhevamed = document.getElementById('ojanconhevamed');
    let oidossinhevamed = document.getElementById('oidossinhevamed');
    let oidosconhevamed = document.getElementById('oidosconhevamed');
    let narizsinhevamed = document.getElementById('narizsinhevamed');
    let narizconhevamed = document.getElementById('narizconhevamed');
    let bocasinhevamed = document.getElementById('bocasinhevamed');
    let bocaconhevamed = document.getElementById('bocaconhevamed');
    let faringesinhevamed = document.getElementById('faringesinhevamed');
    let faringeconhevamed = document.getElementById('faringeconhevamed');
    let cuellosinhevamed = document.getElementById('cuellosinhevamed');
    let cuelloconhevamed = document.getElementById('cuelloconhevamed');
    let arsinhevamed = document.getElementById('arsinhevamed');
    let arconhevamed = document.getElementById('arconhevamed');
    let acsinhevamed = document.getElementById('acsinhevamed');
    let acconhevamed = document.getElementById('acconhevamed');
    let adsinhevamed = document.getElementById('adsinhevamed');
    let adconhevamed = document.getElementById('adconhevamed');
    let agsinhevamed = document.getElementById('agsinhevamed');
    let agconhevamed = document.getElementById('agconhevamed');
    let alsinhevamed = document.getElementById('alsinhevamed');
    let alconhevamed = document.getElementById('alconhevamed');
    let marchasinhevamed = document.getElementById('marchasinhevamed');
    let marchaconhevamed = document.getElementById('marchaconhevamed');
    let columsinhevamed = document.getElementById('columsinhevamed');
    let columconhevamed = document.getElementById('columconhevamed');
    let mssinhevamed = document.getElementById('mssinhevamed');
    let msconhevamed = document.getElementById('msconhevamed');
    let misinhevamed = document.getElementById('misinhevamed');
    let miconhevamed = document.getElementById('miconhevamed');
    let slsinhevamed = document.getElementById('slsinhevamed');
    let slconhevamed = document.getElementById('slconhevamed');
    let snsinhevamed = document.getElementById('snsinhevamed');
    let snconhevamed = document.getElementById('snconhevamed');

    $.ajax({
        url: '/resultfichamedicoocupacional312',
        method: "GET",
        data: {
            cita_id: cita_id,
            soexa: soexa
        },
        success: function (result) {
            if (result[0].mensaje != 'sin datos') {
                nuncom.value = result[0].nuncom;
                ap_alergias.value = result[0].ap_alergias;
                ap_RAM.value = result[0].ap_RAM;
                ap_asma.value = result[0].ap_asma;
                ap_HTA.value = result[0].ap_HTA;
                ap_TBC.value = result[0].ap_TBC;
                ap_diabetes.value = result[0].ap_diabetes;
                ap_bronquitis.value = result[0].ap_bronquitis;
                ap_hepatitis.value = result[0].ap_hepatitis;
                ap_neoplasia.value = result[0].ap_neoplasia;
                ap_convulsiones.value = result[0].ap_convulsiones;
                ap_ITS.value = result[0].ap_ITS;
                ap_quemaduras.value = result[0].ap_quemaduras;
                ap_intoxicaciones.value = result[0].ap_intoxicaciones;
                ap_fiebre_tiroidea.value = result[0].ap_fiebre_tiroidea;
                ap_cirugias.value = result[0].ap_cirugias;
                ap_actividad_fisica.value = result[0].ap_actividad_fisica;
                ap_patologia_renal.value = result[0].ap_patologia_renal;
                ap_neumonia.value = result[0].ap_neumonia;
                ap_pato_tiroides.value = result[0].ap_pato_tiroides;
                ap_fracturas.value = result[0].ap_fracturas;
                ap_otros.value = result[0].ap_otros;

                ant_padre.value = result[0].ant_padre;
                ant_madre.value = result[0].ant_madre;
                ant_hermanos.value = result[0].ant_hermanos;
                ant_esposa.value = result[0].ant_esposa;
                num_hijos_vivos.value = result[0].num_hijos_vivos;
                num_hijos_fallecidos.value = result[0].num_hijos_fallecidos;
                ant_otros.value = result[0].ant_otros;

                ev_ananesis.value = result[0].ev_ananesis;
                ev_ectoscopia.value = result[0].ev_ectoscopia;
                ev_estado_mental.value = result[0].ev_estado_mental;

                con_eva_psicologica.value = result[0].con_eva_psicologica;
                con_radiograficas.value = result[0].con_radiograficas;
                con_laboratorio.value = result[0].con_laboratorio;
                con_audiometria.value = result[0].con_audiometria;
                con_espirometria.value = result[0].con_espirometria;
                con_otros.value = result[0].con_otros;

                const tipresult_id = result[0].tipresult_id;

                switch (tipresult_id) {
                    case 1:
                        Apto.checked = true;
                        break;
                    case 2:
                        NoApto.checked = true;
                        break;
                    case 3:
                        AptoRestricciones.checked = true;
                        break;
                    case 4:
                        ConObservaciones.checked = true;
                        break;
                    case 5:
                        Evaluado.checked = true;
                        break;
                    case 6:
                        Pendiente.checked = true;
                        break;

                    default:
                        break;
                }
                restricciones.val(result[0].restricciones);

                if (result[0].antecedentes_ocupacionales) {
                    let antecedentes_ocupacionales_Array = JSON.parse(result[0].antecedentes_ocupacionales);
                    for (let i = 0; i < antecedentes_ocupacionales_Array.length && i < 3; i++) {
                        let registro = antecedentes_ocupacionales_Array[i];
                        let empantocu = registro.empresa;
                        let areaantocu = registro.area_trabajo;
                        let ocupantocu = registro.ocupacion;
                        let inicioantocu = new Date(registro.fec_ini).toISOString().split('T')[0];
                        let finantocu = new Date(registro.fec_fin).toISOString().split('T')[0];
                        let tiempoocu = registro.tiempo;
                        let peliantocu = registro.pel_ries_ocup;
                        let eqprantocu = registro.epp;

                        if (i === 0) {
                            empantocu1.value = empantocu;
                            areaantocu1.value = areaantocu;
                            ocupantocu1.value = ocupantocu;
                            inicioantocu1.value = inicioantocu;
                            finantocu1.value = finantocu;
                            tiempoocu1.value = tiempoocu;
                            peliantocu1.value = peliantocu;
                            eqprantocu1.value = eqprantocu;
                        } else if (i === 1) {
                            empantocu2.value = empantocu;
                            areaantocu2.value = areaantocu;
                            ocupantocu2.value = ocupantocu;
                            inicioantocu2.value = inicioantocu;
                            finantocu2.value = finantocu;
                            tiempoocu2.value = tiempoocu;
                            peliantocu2.value = peliantocu;
                            eqprantocu2.value = eqprantocu;
                        } else if (i === 2) {
                            empantocu3.value = empantocu;
                            areaantocu3.value = areaantocu;
                            ocupantocu3.value = ocupantocu;
                            inicioantocu3.value = inicioantocu;
                            finantocu3.value = finantocu;
                            tiempoocu3.value = tiempoocu;
                            peliantocu3.value = peliantocu;
                            eqprantocu3.value = eqprantocu;
                        }
                    }
                }
                if (result[0].js_habitos_nocibos) {
                    let js_habitos_nocibos_Array = JSON.parse(result[0].js_habitos_nocibos);
                    for (let i = 0; i < js_habitos_nocibos_Array.length && i < 4; i++) {
                        let registro = js_habitos_nocibos_Array[i];
                        let tipo = registro.tipo;
                        let cantidad = registro.cantidad;
                        let frecuencia = registro.frecuencia;

                        if (i === 0) {
                            altipoantpato.value = tipo;
                            alcantantpato.value = cantidad;
                            alfrecantpato.value = frecuencia;
                        } else if (i === 1) {
                            tatipoantpato.value = tipo;
                            tacantantpato.value = cantidad;
                            tafrecantpato.value = frecuencia;
                        } else if (i === 2) {
                            drtipoantpato.value = tipo;
                            drcantantpato.value = cantidad;
                            drfrecantpato.value = frecuencia;
                        } else if (i === 3) {
                            mdtipoantpato.value = tipo;
                            mdcantantpato.value = cantidad;
                            mdfrecantpato.value = frecuencia;
                        }
                    }
                }
                if (result[0].js_enferm_acci) {
                    let js_enferm_acci_Array = JSON.parse(result[0].js_enferm_acci);
                    for (let i = 0; i < js_enferm_acci_Array.length && i < 3; i++) {
                        let registro = js_enferm_acci_Array[i];
                        let enfermedad = registro.enfermedad;
                        let asostrab = registro.asostrab;
                        let año = registro.año;
                        let diasdescanso = registro.diasdescanso;

                        if (i === 0) {
                            enfantoatofam1.value = enfermedad;
                            if (asostrab === 'NO') {
                                noantoatofam1.checked = true;
                            } else {
                                siantoatofam1.checked = true;
                            }
                            añoantoatofam1.value = año;
                            desantoatofam1.value = diasdescanso;
                        } else if (i === 1) {
                            enfantoatofam2.value = enfermedad;
                            if (asostrab === 'NO') {
                                noantoatofam2.checked = true;
                            } else {
                                siantoatofam2.checked = true;
                            }
                            añoantoatofam2.value = año;
                            desantoatofam2.value = diasdescanso;
                        } else if (i === 2) {
                            enfantoatofam3.value = enfermedad;
                            if (asostrab === 'NO') {
                                noantoatofam3.checked = true;
                            } else {
                                siantoatofam3.checked = true;
                            }
                            añoantoatofam3.value = año;
                            desantoatofam3.value = diasdescanso;
                        }
                    }
                }
                if (result[0].js_examen_fisico) {
                    const js_examen_fisico_Array = JSON.parse(result[0].js_examen_fisico);

                    const organosMap = {
                        'Piel': { sinhevamed: pielsinhevamed, conhevamed: pielconhevamed },
                        'Cabello': { sinhevamed: cabesinhevamed, conhevamed: cabeconhevamed },
                        'Ojosyanexos': { sinhevamed: ojansinhevamed, conhevamed: ojanconhevamed },
                        'Oidos': { sinhevamed: oidossinhevamed, conhevamed: oidosconhevamed },
                        'Nariz': { sinhevamed: narizsinhevamed, conhevamed: narizconhevamed },
                        'Boca': { sinhevamed: bocasinhevamed, conhevamed: bocaconhevamed },
                        'Faringe': { sinhevamed: faringesinhevamed, conhevamed: faringeconhevamed },
                        'Cuello': { sinhevamed: cuellosinhevamed, conhevamed: cuelloconhevamed },
                        'Aparatorespiratorio': { sinhevamed: arsinhevamed, conhevamed: arconhevamed },
                        'Aparatocardiovascular': { sinhevamed: acsinhevamed, conhevamed: acconhevamed },
                        'Aparatodigestivo': { sinhevamed: adsinhevamed, conhevamed: adconhevamed },
                        'Aparatogenitourinario': { sinhevamed: agsinhevamed, conhevamed: agconhevamed },
                        'Aparatolocomotor': { sinhevamed: alsinhevamed, conhevamed: alconhevamed },
                        'Marcha': { sinhevamed: marchasinhevamed, conhevamed: marchaconhevamed },
                        'Columna': { sinhevamed: columsinhevamed, conhevamed: columconhevamed },
                        'MiembrosSuperiores': { sinhevamed: mssinhevamed, conhevamed: msconhevamed },
                        'MiembrosInferiores': { sinhevamed: misinhevamed, conhevamed: miconhevamed },
                        'SistemaLinfatico': { sinhevamed: slsinhevamed, conhevamed: slconhevamed },
                        'SistemaNervioso': { sinhevamed: snsinhevamed, conhevamed: snconhevamed },
                    };

                    for (let i = 0; i < Math.min(js_examen_fisico_Array.length, 20); i++) {
                        const registro = js_examen_fisico_Array[i];
                        const organo = registro.organo;

                        if (organosMap[organo]) {
                            const { sinhevamed, conhevamed } = organosMap[organo];
                            sinhevamed.value = registro.sinhallazgo;
                            conhevamed.value = registro.conhallazgo;
                        }
                    }
                }
                if (result[0].diagnosticos) {
                    const diagnosticosArray = JSON.parse(result[0].diagnosticos);
                    const tbodydiagmedocu = $('#tbodydiagmedocu');
                    tbodydiagmedocu.empty();

                    diagnosticosArray.forEach(diagnostico => {
                        let [P, D, R] = ['', '', ''];

                        if (diagnostico.tipdia === 'P') {
                            P = 'X';
                        } else if (diagnostico.tipdia === 'D') {
                            D = 'X';
                        } else if (diagnostico.tipdia === 'R') {
                            R = 'X';
                        }

                        tbodydiagmedocu.append(`
                            <tr>
                                <td style="vertical-align: middle;" class="text-start align-middle" colspan="7">${diagnostico.diades}</td>
                                <td style="vertical-align: middle;" class="align-middle">${P}</td>
                                <td style="vertical-align: middle;" class="align-middle">${D}</td>
                                <td style="vertical-align: middle;" class="align-middle">${R}</td>
                                <td style="vertical-align: middle;" class="align-middle">${diagnostico.diacod}</td>
                                <td style="vertical-align: middle;" class="text-center estado">
                                    <button style="color:white" type="button" class="btn btn-circle btn-sm btn-danger mr-1 ms-1" onclick="eliminarFila(this)">
                                        <i class="fa-solid fa-trash-can"></i>
                                    </button>
                                </td>
                            </tr>
                        `);
                    });
                }
                if (result[0].recomendaciones) {
                    const recomendacionesArray = JSON.parse(result[0].recomendaciones);
                    const tbodyrecomencontrol = $('#tbodyrecomencontrol');
                    tbodyrecomencontrol.empty();

                    recomendacionesArray.forEach(recomendacion => {
                        tbodyrecomencontrol.append(`
                            <tr>
                                <td style="vertical-align: middle;" class="text-start align-middle">${recomendacion.ord_itm}</td>
                                <td style="vertical-align: middle;" class="text-start align-middle">${recomendacion.desrec}</td>
                                <td style="vertical-align: middle;" class="text-center">
                                <button style="color:white" type="button" class="btn btn-circle btn-sm btn-danger mr-1 ms-1" onclick="eliminarFilarec(this)"><i class="fa-solid fa-trash-can"></i></button>
                                </td>
                            </tr>
                        `);
                    });
                }
                ajustarTextArea(conevapsico);
                ajustarTextArea(conradio);
                ajustarTextArea(restricciones);                
            }
        },
        error: function (error) {
            alert('error: '+ error);
        }
    });
})();

function Grabar() {
    let btnGrabar = document.getElementById('btnGrabar');
    btnGrabar.disabled = true;
    btnGrabar.innerHTML = `<lottie-player src="/img/jsonimg/btnloading.json" background="transparent"
                                    speed="1" style="width: 38px; height: 35px;" loop
                                    autoplay></lottie-player>`

    let cita_id = document.getElementById('id').value;
    let nuncom = document.getElementById('nuncom').value;
    let soexa = document.getElementById('soexa').value;
    let codpru_id = document.getElementById('codpru_id').value;

    let AntecedentesOcupacionales = obtenerAntecedentesOcupacionales();

    let ap_alergias = $('#alerantpato').val();
    let ap_RAM = $('#ramantpato').val();
    let ap_asma = $('#asmaantpato').val();
    let ap_HTA = $('#htaantpato').val();
    let ap_TBC = $('#tbcantpato').val();
    let ap_diabetes = $('#diabeantpato').val();
    let ap_bronquitis = $('#bronqantpato').val();
    let ap_hepatitis = $('#hepaantpato').val();
    let ap_neoplasia = $('#neoantpato').val();
    let ap_convulsiones = $('#convantpato').val();
    let ap_ITS = $('#itsantpato').val();
    let ap_quemaduras = $('#quemantpato').val();
    let ap_intoxicaciones = $('#intoxantpato').val();
    let ap_fiebre_tiroidea = $('#fitiantpato').val();
    let ap_cirugias = $('#cirantpato').val();
    let ap_actividad_fisica = $('#acfiantpato').val();
    let ap_patologia_renal = $('#pareantpato').val();
    let ap_neumonia = $('#neuantpato').val();
    let ap_pato_tiroides = $('#patiantpato').val();
    let ap_fracturas = $('#fracantpato').val();
    let ap_otros = $('#otrosantpato').val();

    let HabitosNocivos = obtenerHabitosNocivos();

    let ant_padre = $('#padreantoatofam').val();
    let ant_madre = $('#madreantoatofam').val();
    let ant_hermanos = $('#hermantoatofam').val();
    let ant_esposa = $('#espantoatofam').val();
    let num_hijos_vivos = $('#hvantoatofam').val();
    let num_hijos_fallecidos = $('#hfantoatofam').val();
    let ant_otros = $('#otrosantoatofam').val();

    let Absentismo = obtenerAbsentismo();

    let ev_ananesis = $('#anamevamed').val();
    let ev_ectoscopia = $('#ectoevamed').val();
    let ev_estado_mental = $('#esmeevamed').val();

    let ExamenFisico = obtenerExamenFisico();

    let con_eva_psicologica = $('#conevapsico').val();
    let con_radiograficas = $('#conradio').val();
    let con_laboratorio = $('#hallpatolab').val();
    let con_audiometria = $('#conaudio').val();
    let con_espirometria = $('#conespiro').val();
    let con_otros = $('#concluotros').val();

    let Diagnosticos = obtenerDiagnosticos();

    var Apto = document.getElementById("Apto");
    var AptoRestricciones = document.getElementById("AptoRestricciones");
    var NoApto = document.getElementById("NoApto");
    var ConObservaciones = document.getElementById("ConObservaciones");
    var Evaluado = document.getElementById("Evaluado");
    var Pendiente = document.getElementById("Pendiente");
    let tipresult_id;

    if (Apto.checked === true) { tipresult_id = Apto.value; }
    if (AptoRestricciones.checked === true) { tipresult_id = AptoRestricciones.value; }
    if (NoApto.checked === true) { tipresult_id = NoApto.value; }
    if (ConObservaciones.checked === true) { tipresult_id = ConObservaciones.value; }
    if (Evaluado.checked === true) { tipresult_id = Evaluado.value; }
    if (Pendiente.checked === true) { tipresult_id = Pendiente.value; }

    let restricciones = $('#restricciones').val();

    let Recomendaciones = obtenerRecomendaciones();

    const datosCompletos = {
        cita_id: cita_id,
        nuncom: nuncom,
        soexa: soexa,
        codpru_id: codpru_id,
        AntecedentesOcupacionales: AntecedentesOcupacionales,
        ap_alergias: ap_alergias,
        ap_RAM: ap_RAM,
        ap_asma: ap_asma,
        ap_HTA: ap_HTA,
        ap_TBC: ap_TBC,
        ap_diabetes: ap_diabetes,
        ap_bronquitis: ap_bronquitis,
        ap_hepatitis: ap_hepatitis,
        ap_neoplasia: ap_neoplasia,
        ap_convulsiones: ap_convulsiones,
        ap_ITS: ap_ITS,
        ap_quemaduras: ap_quemaduras,
        ap_intoxicaciones: ap_intoxicaciones,
        ap_fiebre_tiroidea: ap_fiebre_tiroidea,
        ap_cirugias: ap_cirugias,
        ap_actividad_fisica: ap_actividad_fisica,
        ap_patologia_renal: ap_patologia_renal,
        ap_neumonia: ap_neumonia,
        ap_pato_tiroides: ap_pato_tiroides,
        ap_fracturas: ap_fracturas,
        ap_otros: ap_otros,
        HabitosNocivos: HabitosNocivos,
        ant_padre: ant_padre,
        ant_madre: ant_madre,
        ant_hermanos: ant_hermanos,
        ant_esposa: ant_esposa,
        num_hijos_vivos: num_hijos_vivos,
        num_hijos_fallecidos: num_hijos_fallecidos,
        ant_otros: ant_otros,
        Absentismo: Absentismo,
        ev_ananesis: ev_ananesis,
        ev_ectoscopia: ev_ectoscopia,
        ev_estado_mental: ev_estado_mental,
        ExamenFisico: ExamenFisico,
        con_eva_psicologica: con_eva_psicologica,
        con_radiograficas: con_radiograficas,
        con_laboratorio: con_laboratorio,
        con_audiometria: con_audiometria,
        con_espirometria: con_espirometria,
        con_otros: con_otros,
        Diagnosticos: Diagnosticos,
        tipresult_id: tipresult_id,
        restricciones: restricciones,
        Recomendaciones: Recomendaciones
    };

    fetch('/pbfichamedicoocupacional312', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosCompletos)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            return response.json();
        })
        .then(data => {
            mensaje(data[0].icono, data[0].mensaje, 1500);
            let nuncom = document.getElementById('nuncom');
            nuncom.value = data[0].nuncom;
            btnGrabar.disabled = false;
            btnGrabar.innerHTML = `<i class="fa-regular fa-floppy-disk" style="margin: 8px 12px;"></i>`

        })
        .catch(error => {
            console.error('Error:', error);
        });

}

function obtenerAntecedentesOcupacionales() {
    var table = document.getElementById('tablaantocupacionales');
    var rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    var data = [];

    for (var i = 0; i < rows.length; i++) {
        var input = rows[i].getElementsByTagName('input');

        if (input.length >= 3 && input[0].value.trim() !== '' && input[1].value.trim() !== '' && input[2].value.trim() !== '' && input[3].value.trim() !== '' && input[4].value.trim() !== '' && input[5].value.trim() !== '' && input[6].value.trim() !== '' && input[7].value.trim() !== '') {
            var ord = input[0].value;
            var empresa = input[1].value;
            var areatrabajo = input[2].value;
            var ocupacion = input[3].value;
            var fechaini = input[4].value;
            var fechafin = input[5].value;
            var tiempo = input[6].value;
            var peligrosriesgos = input[7].value;
            var equiprotec = input[8].value;
            var rowData = {
                ord: ord,
                empresa: empresa,
                area_trabajo: areatrabajo,
                ocupacion: ocupacion,
                fecini: fechaini,
                fec_fin: fechafin,
                tiempo: tiempo,
                pel_ries_ocup: peligrosriesgos,
                epp: equiprotec
            };
            data.push(rowData);
        }
    }
    return data;
}

function obtenerAbsentismo() {
    var table = document.getElementById('absentismo');
    var rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    var data = [];

    for (var i = 0; i < rows.length; i++) {
        var input = rows[i].getElementsByTagName('input');

        if (input.length >= 3) {
            var ord = input[0].value;
            var enfermedad = input[1].value;
            let valor;
            if (input[2].checked === true) {
                valor = 'SI'
            } else {
                valor = 'NO'
            }
            var año = input[4].value;
            var diasdescanso = input[5].value;
            var rowData = {
                ord: ord,
                enfermedad: enfermedad,
                asostrab: valor,
                año: año,
                diasdescanso: diasdescanso
            };
            data.push(rowData);
        }
    }
    return data;
}

function obtenerHabitosNocivos() {
    var table = document.getElementById('habitosnocivos');
    var rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    var data = [];

    for (var i = 0; i < rows.length; i++) {
        var input = rows[i].getElementsByTagName('input');

        if (input.length >= 3) {
            var habito = input[0].value;
            var tipo = input[1].value;
            var cantidad = input[2].value;
            var frecuencia = input[3].value;
            var rowData = {
                habito: habito,
                tipo: tipo,
                cantidad: cantidad,
                frecuencia: frecuencia
            };
            data.push(rowData);
        }
    }
    return data;
}

function obtenerExamenFisico() {
    var table = document.getElementById('examenfisico');
    var rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    var data = [];

    for (var i = 0; i < rows.length; i++) {
        var input = rows[i].getElementsByTagName('input');

        if (input.length >= 3) {
            var organo = input[0].value;
            var sinhallazgo = input[1].value;
            var conhallazgo = input[2].value;
            var rowData = {
                organo: organo,
                sinhallazgo: sinhallazgo,
                conhallazgo: conhallazgo
            };
            data.push(rowData);
        }
    }
    return data;
}

document.getElementById("modalFormCIE10312").addEventListener("keydown", function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        let cie10id = $('#modalcie10cod').val();
        let cie10desc = $('#modalcie10desc').val();
        let cie10Value = cie10id.length > cie10desc.length ? cie10id : cie10desc;
        $.ajax({
            url: '/cie10list',
            method: "GET",
            data: {
                cie10: cie10Value,
            },
            success: function (lista) {
                $('#modalcie10cod').val(lista[0].diacod);
                $('#modalcie10desc').val(lista[0].diades);

            },
            error: function () { // Corregido: eliminé el parámetro "lista" innecesario
                alert('error');
            }
        });
    }
});

function agregarFila() {
    let cie10id = $('#modalcie10cod');
    let cie10desc = $('#modalcie10desc');
    let tipocie10 = $('#modalCombocie10');

    var tbody = document.getElementById('tbodydiagmedocu');
    var nuevaFila = tbody.insertRow(-1);

    var cell0 = nuevaFila.insertCell(0);
    cell0.colSpan = 7;
    cell0.textContent = cie10desc.val();
    cell0.className = 'text-start align-middle';

    var cell1 = nuevaFila.insertCell(1);
    cell1.className = 'align-middle';
    var cell2 = nuevaFila.insertCell(2);
    cell2.className = 'align-middle';
    var cell3 = nuevaFila.insertCell(3);
    cell3.className = 'align-middle';
    if (tipocie10.val() === 'P') {
        cell1.textContent = 'X';
        cell2.textContent = '';
        cell3.textContent = '';
    }
    else if (tipocie10.val() === 'D') {
        cell1.textContent = '';
        cell2.textContent = 'X';
        cell3.textContent = '';
    }
    else if (tipocie10.val() === 'R') {
        cell1.textContent = '';
        cell2.textContent = '';
        cell3.textContent = 'X';
    }
    var cell4 = nuevaFila.insertCell(4);
    cell4.className = 'align-middle';
    cell4.textContent = cie10id.val();
    nuevaFila.insertCell(5).innerHTML = '<button style="color:white" type="button" class="btn btn-circle btn-sm btn-danger mr-1 ms-1" onclick="eliminarFila(this)"><i class="fa-solid fa-trash-can"></i></button>';

    cie10id.val('');
    cie10desc.val('');
}

function agregarFilarec() {
    let modalrec312 = $('#modalrec312');
    var tbody = document.getElementById('tbodyrecomencontrol');

    // Obtener el número actual de filas en el tbody
    var numeroFilas = tbody.rows.length;

    var nuevaFila = tbody.insertRow(-1);

    var cell0 = nuevaFila.insertCell(0);
    cell0.textContent = numeroFilas + 1; // Incrementar el número de filas y asignarlo a cell0
    cell0.className = 'text-start align-middle';

    var cell1 = nuevaFila.insertCell(1);
    cell1.textContent = modalrec312.val();
    cell1.className = 'text-start align-middle';

    var cell2 = nuevaFila.insertCell(2);
    cell2.innerHTML = '<button style="color:white" type="button" class="btn btn-circle btn-sm btn-danger mr-1 ms-1" onclick="eliminarFilarec(this)"><i class="fa-solid fa-trash-can"></i></button>';

    modalrec312.val('');
}


function eliminarFila(boton) {
    MensajeSIyNO("warning", "¿Estás seguro?", "¿Quieres eliminar la fila seleccionada?", function (confirmado) {
        if (confirmado) {
            var fila = boton.parentNode.parentNode;
            fila.parentNode.removeChild(fila);
        }
    });
}

function eliminarFilarec(boton) {
    MensajeSIyNO("warning", "¿Estás seguro?", "¿Quieres eliminar la fila seleccionada?", function (confirmado) {
        if (confirmado) {
            var fila = boton.parentNode.parentNode;
            var tbody = fila.parentNode;

            // Obtener el índice de la fila actual
            var rowIndex = fila.rowIndex;

            // Eliminar la fila
            tbody.removeChild(fila);

            // Recalcular los números en la primera celda de todas las filas restantes
            var filas = tbody.getElementsByTagName('tr');

            for (var i = 0; i < filas.length; i++) {
                var celdas = filas[i].getElementsByTagName('td');
                celdas[0].textContent = i + 1;
            }
        }
    });
}

function obtenerDiagnosticos() {
    var table = document.getElementById('tabladiagmedocu');
    var tbody = table.tBodies[0];
    var data = [];

    for (var i = 0; i < tbody.rows.length; i++) {
        var celdas = tbody.rows[i].cells;
        let tipdia;
        if (celdas[1].innerText === 'X') {
            tipdia = 'P'
        } if (celdas[2].innerText === 'X') {
            tipdia = 'D'
        } if (celdas[3].innerText === 'X') {
            tipdia = 'R'
        }

        var rowData = {
            diadesc: celdas[0].innerText,
            tipdia: tipdia,
            diacod: celdas[4].innerText
        };
        data.push(rowData);
    }

    return data;
}

function obtenerRecomendaciones() {
    var table = document.getElementById('tablarecomencontrol');
    var tbody = table.tBodies[0];
    var data = [];

    for (var i = 0; i < tbody.rows.length; i++) {
        var celdas = tbody.rows[i].cells;

        var rowData = {
            ord_itm: celdas[0].innerText,
            recomen: celdas[1].innerText
        };
        data.push(rowData);
    }

    return data;
}

async function llenarmodalFormato(soexa) {
    let titleMFormatos = document.getElementById('titleMFormatos');
    if (soexa === '003') {
        titleMFormatos.innerHTML = 'Formato de Audiometría';
    } else if (soexa === '005') {
        titleMFormatos.innerHTML = 'Formato de Espirometría';
    } else if (soexa === '009') {
        titleMFormatos.innerHTML = 'Formato de Laboratorio';
    }
    mostrarDiv('cargaFormato');
    ocultarDiv('contenedorFormato');
    let cita_id = document.getElementById('id').value;
    let soexa1 = soexa;
    $.ajax({
        url: '/getdatosformatosficha312',
        method: "GET",
        data: {
            cita_id: cita_id,
            soexa: soexa1
        },
        success: function (result) {
            let renderedHtml = result.renderedHtml;
            let rutaArchivo = result.rutaArchivo;
            let contenedor = document.getElementById("contenedorFormato");

            if (soexa !== '009') {
                //let contenedor = document.getElementById("contenedorFormato");
                contenedor.innerHTML = renderedHtml;

                if (soexa === '003') {
                    inicializarGraficos();
                }
            } else {
                //resultcrearMiniatura1(rutaArchivo, 'resultado.pdf')
                var baseUrl = window.location.origin;
                var pdfUrl = baseUrl + rutaArchivo + '#toolbar=0'
                var embed = document.createElement('embed');
                embed.src = pdfUrl;
                embed.type = 'application/pdf';
                embed.width = '100%';
                embed.height = '100%';
                embed.setAttribute('scrolling', 'auto');
                contenedor.innerHTML = '';
                contenedor.style.fontFamily = "Oswald, sans-serif";

                contenedor.appendChild(embed);
            }
            contenedor.style.height = "auto";
            var modalContentHeight = document.getElementById("modalFormatos").offsetHeight;
            var windowHeight = window.innerHeight;
            var minHeight = windowHeight * 0.6;
            contenedor.style.minHeight = Math.min(modalContentHeight, minHeight) + "px";
            mostrarDiv('contenedorFormato');
            ocultarDiv('cargaFormato');
        },
        error: function (error) {
            alert('error', error);
        }
    });
}


function resultcrearMiniatura1(ruta, nombreArchivo) {

    let miniaturasDiv = document.getElementById("contenedorFormato");
    miniaturasDiv.innerHTML = "";
    miniaturasDiv.style.display = "block";


    const miniaturaDiv = document.createElement("div");
    miniaturaDiv.className = "archivo-item";
    let imgIcon;
    if (nombreArchivo.toLowerCase().endsWith('.pdf')) {
        imgIcon = "pdficono";
    } else {
        imgIcon = "imgicono";
    }

    const pdfIcon = document.createElement("a");
    pdfIcon.href = `${window.location.origin}${ruta}`;
    pdfIcon.target = "_blank"; // Abrir el enlace en una nueva pestaña
    pdfIcon.innerHTML = `<img src="/img/${imgIcon}.webp" width="90" height="90">`;
    miniaturaDiv.appendChild(pdfIcon);

    const nombreArchivoParrafo = document.createElement("p");
    nombreArchivoParrafo.textContent = nombreArchivo;
    miniaturaDiv.appendChild(nombreArchivoParrafo);

    miniaturasDiv.appendChild(miniaturaDiv);
}

async function inicializarGraficos() {
    await od();
    await oi();
}
async function od() {
    const ctx = document.getElementById('graf_OD').getContext('2d');
    var valuesVA = [null,
        parseInt(document.getElementById('VA_D_125').innerText, 10),
        parseInt(document.getElementById('VA_D_250').innerText, 10),
        parseInt(document.getElementById('VA_D_500').innerText, 10),
        parseInt(document.getElementById('VA_D_1000').innerText, 10),
        parseInt(document.getElementById('VA_D_2000').innerText, 10),
        parseInt(document.getElementById('VA_D_3000').innerText, 10),
        parseInt(document.getElementById('VA_D_4000').innerText, 10),
        parseInt(document.getElementById('VA_D_6000').innerText, 10),
        parseInt(document.getElementById('VA_D_8000').innerText, 10),
        null];
    var valuesVO = [null,
        parseInt(document.getElementById('VO_D_125').innerText, 10),
        parseInt(document.getElementById('VO_D_250').innerText, 10),
        parseInt(document.getElementById('VO_D_500').innerText, 10),
        parseInt(document.getElementById('VO_D_1000').innerText, 10),
        parseInt(document.getElementById('VO_D_2000').innerText, 10),
        parseInt(document.getElementById('VO_D_3000').innerText, 10),
        parseInt(document.getElementById('VO_D_4000').innerText, 10),
        parseInt(document.getElementById('VO_D_8000').innerText, 10),
        , null];

    const existingChart = ctx.chart;
    if (existingChart) {
        existingChart.destroy();
    }
    Chart.register(ChartDataLabels);

    const maxDataValue = Math.max(...valuesVA, ...valuesVO);
    const maxYValue = maxDataValue < 25 ? 30 : (Math.ceil(maxDataValue / 10) * 10) + 10;
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [null, '125', '250', '500', '1000', '2000', '3000', '4000', '6000', '8000', null],
            datasets: [{
                label: 'Oído derecho',
                data: valuesVO,
                borderWidth: 1,
                borderColor: 'red',
                borderDash: [5, 5],
                pointRadius: 0,
            }, {
                label: 'Nuevo conjunto de datos',
                data: valuesVA,
                borderWidth: 1,
                borderColor: 'red',
                pointRadius: 4,
                pointStyle: 'circle',
                pointBackgroundColor: 'white',
                pointBorderColor: 'red',
                fill: false,
            }]
        },
        options: {
            maintainAspectRatio: false, // Permite ajustar el tamaño del gráfico independientemente del contenedor
            responsive: true,
            scales: {
                x: {
                    grid: {
                        drawBorder: false,
                    },
                },
                y: {
                    min: -10,
                    max: 120,
                    beginAtZero: false,
                    reverse: true,
                    grid: {
                        drawBorder: false,
                    },
                    ticks: {
                        stepSize: 10,
                    }
                },
            },
            plugins: {
                legend: {
                    display: false
                },
                datalabels: {
                    display: false,

                },
            },
            elements: {
                line: {
                    tension: 0.2
                }
            },
        },
        plugins: [{
            afterDraw: function (chart) {
                var ctx = chart.ctx;
                ctx.strokeStyle = 'gray';
                ctx.lineWidth = 2;
                ctx.setLineDash([]);
                const yValue = chart.scales.y.getPixelForValue(25);
                ctx.fillStyle = 'gray';
                ctx.fillRect(chart.scales.x.left, yValue - 2.5, chart.scales.x.width, 5);
                ctx.beginPath();
                ctx.moveTo(chart.scales.x.left, yValue);
                ctx.lineTo(chart.scales.x.right, yValue);
                ctx.stroke();
                ctx.closePath();

                chart.data.datasets.forEach(function (dataset, datasetIndex) {
                    var meta = chart.getDatasetMeta(datasetIndex);
                    if (!meta.hidden) {
                        meta.data.forEach(function (element, index) {
                            if (datasetIndex === 0 && valuesVO[index] !== null) {
                                ctx.fillStyle = 'red';
                                ctx.font = '12px Arial';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText('<', element.x, element.y);
                            }
                        });
                    }
                });
            }
        }]
    });
    ctx.chart = myChart;
    oi();
};
async function oi() {
    const ctx = document.getElementById('graf_OI').getContext('2d');

    var valuesVA = [null,
        document.getElementById('VA_E_125').innerText,
        document.getElementById('VA_E_250').innerText,
        document.getElementById('VA_E_500').innerText,
        document.getElementById('VA_E_1000').innerText,
        document.getElementById('VA_E_2000').innerText,
        document.getElementById('VA_E_3000').innerText,
        document.getElementById('VA_E_4000').innerText,
        document.getElementById('VA_E_6000').innerText,
        document.getElementById('VA_E_8000').innerText,
        null
    ];

    var valuesVO = [null,
        document.getElementById('VO_E_125').innerText,
        document.getElementById('VO_E_250').innerText,
        document.getElementById('VO_E_500').innerText,
        document.getElementById('VO_E_1000').innerText,
        document.getElementById('VO_E_2000').innerText,
        document.getElementById('VO_E_3000').innerText,
        document.getElementById('VO_E_4000').innerText,
        document.getElementById('VO_E_6000').innerText,
        document.getElementById('VO_E_8000').innerText,
        null
    ];
    const existingChart = ctx.chart;
    if (existingChart) {
        existingChart.destroy();
    }
    Chart.register(ChartDataLabels);
    const maxDataValue = Math.max(...valuesVA, ...valuesVO);
    const maxYValue = maxDataValue < 25 ? 30 : (Math.ceil(maxDataValue / 10) * 10) + 10;
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [null, '125', '250', '500', '1000', '2000', '3000', '4000', '6000', '8000', null],
            datasets: [{
                label: 'Oído derecho',
                data: valuesVO,
                borderWidth: 1,
                borderColor: 'blue',
                borderDash: [5, 5],
                pointRadius: 0,
            }, {
                label: 'Nuevo conjunto de datos',
                data: valuesVA,
                borderWidth: 1,
                borderColor: 'blue',
                pointRadius: 0,
            }]
        },
        options: {
            scales: {
                x: {
                    grid: {
                        drawBorder: false,
                    },
                },
                y: {
                    min: -10,
                    max: 120,
                    beginAtZero: false,
                    reverse: true,
                    grid: {
                        drawBorder: false,
                    },
                    ticks: {
                        stepSize: 10,

                    }
                },
            },
            plugins: {
                legend: {
                    display: false
                },
                datalabels: {
                    display: false
                }
            },
            elements: {
                line: {
                    tension: 0.2
                }
            },
        },
        plugins: [{
            afterDraw: function (chart) {
                var ctx = chart.ctx;
                ctx.strokeStyle = 'gray';
                ctx.lineWidth = 2;
                ctx.setLineDash([]);
                const yValue = chart.scales.y.getPixelForValue(25);
                ctx.fillStyle = 'gray';
                ctx.fillRect(chart.scales.x.left, yValue - 2.5, chart.scales.x.width, 5);
                ctx.beginPath();
                ctx.moveTo(chart.scales.x.left, yValue);
                ctx.lineTo(chart.scales.x.right, yValue);
                ctx.stroke();
                ctx.closePath();

                chart.data.datasets.forEach(function (dataset, datasetIndex) {
                    var meta = chart.getDatasetMeta(datasetIndex);
                    if (!meta.hidden) {
                        meta.data.forEach(function (element, index) {
                            if (datasetIndex === 0 && valuesVO[index] !== null) {
                                ctx.fillStyle = 'blue';
                                ctx.font = '12px Arial';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText('>', element.x, element.y);
                            }
                            if (datasetIndex === 1 && valuesVA[index] !== null) {
                                ctx.fillStyle = 'blue';
                                ctx.font = '12px Arial';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText('X', element.x, element.y);
                            }
                        });
                    }
                });
            }
        }]
    });
    ctx.chart = myChart;



};

function llenarfichas(soexa) {
    let cita_id = document.getElementById('id').value;
    $.ajax({
        url: '/getresultadosfichas',
        method: "GET",
        data: {
            cita_id: cita_id,
        },
        success: function (result) {
            if (soexa === '032') {
                $('#conevapsico').val(result[0].conevapsico);
            } else if (soexa === '013') {
                $('#conradio').val(result[0].conradio);
            }
        },
        error: function (error) {
            alert('error', error);
        }
    });
}
function obtenerArray(dataJSON, propiedad) {
    let resultado = "";
    dataJSON.forEach((obj) => {
        resultado = obj[propiedad];
    });
    return resultado;
}
