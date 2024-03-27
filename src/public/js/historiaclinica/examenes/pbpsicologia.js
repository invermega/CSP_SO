$(document).ready(function () {
    window.addEventListener('load', function () {
    });});
(function poblarcampos() {
    obtenerPsicologiaTest();
    let cita_id = document.getElementById('id').value;
    let soexa = document.getElementById('soexa').value;
    let nuncom = document.getElementById('nuncom');
    let doc_adic_id = document.getElementById('doc_adic_id');
    let codcie101 = document.getElementById('1codcie10');
    let codcie10desc1 = document.getElementById('1codcie10desc');
    let codcie10comen1 = document.getElementById('1codcie10comen');
    let codcie102 = document.getElementById('2codcie10');
    let codcie10desc2 = document.getElementById('2codcie10desc');
    let codcie10comen2 = document.getElementById('2codcie10comen');
    let codcie103 = document.getElementById('3codcie10');
    let codcie10desc3 = document.getElementById('3codcie10desc');
    let codcie10comen3 = document.getElementById('3codcie10comen');

    let recomendacion1 = document.getElementById('recomendacion1');
    let control1 = document.getElementById('control1');
    let recomendacion2 = document.getElementById('recomendacion2');
    let control2 = document.getElementById('control2');
    let recomendacion3 = document.getElementById('recomendacion3');
    let control3 = document.getElementById('control3');
    $.ajax({
        url: '/resultpsicologia',
        method: "GET",
        data: {
            cita_id: cita_id,
            soexa: soexa
        },
        success: function (result) {
            if (result[0].mensaje != 'sin datos') {
                nuncom.value = result[0].nuncom;
                doc_adic_id.value = result[0].doc_adic_id;
                if (result[0].doc_adic_id != '0') {
                    resultcrearMiniatura(result[0].rutarch, result[0].nomarch);
                }
                if (result[0].psicologia) {

                    let psicologiaArray = JSON.parse(result[0].psicologia);
                    let registro = psicologiaArray[0];
                    $('input[type="radio"][name="cod_present"][value="' + registro.cod_present + '"]').prop('checked', true);
                    $('input[type="radio"][name="cod_postura"][value="' + registro.cod_postura + '"]').prop('checked', true);
                    $('input[type="radio"][name="dis_ritmo"][value="' + registro.dis_ritmo + '"]').prop('checked', true);
                    $('input[type="radio"][name="dis_tono"][value="' + registro.dis_tono + '"]').prop('checked', true);
                    $('input[type="radio"][name="dis_articulacion"][value="' + registro.dis_articulacion + '"]').prop('checked', true);
                    $('input[type="radio"][name="ori_tiempo"][value="' + registro.ori_tiempo + '"]').prop('checked', true);
                    $('input[type="radio"][name="ori_espacio"][value="' + registro.ori_espacio + '"]').prop('checked', true);
                    $('input[type="radio"][name="ori_persona"][value="' + registro.ori_persona + '"]').prop('checked', true);
                    $('#pro_cog_lucido_atento').val(registro.pro_cog_lucido_atento);
                    $('#pro_cog_pensamiento').val(registro.pro_cog_pensamiento);
                    $('#pro_cog_percepcion').val(registro.pro_cog_percepcion);
                    $('input[type="radio"][name="pro_cog_memoria"][value="' + registro.pro_cog_memoria + '"]').prop('checked', true);
                    $('input[type="radio"][name="pro_cog_inteligencia"][value="' + registro.pro_cog_inteligencia + '"]').prop('checked', true);
                    $('#pro_cog_apetito').val(registro.pro_cog_apetito);
                    $('#pro_cog_sueño').val(registro.pro_cog_sueño);
                    $('#re_nivel_inte').val(registro.re_nivel_inte);
                    $('#re_coord_visomotriz').val(registro.re_coord_visomotriz);
                    $('#re_nivel_memoria').val(registro.re_nivel_memoria);
                    $('#re_personalidad').val(registro.re_personalidad);
                    $('#re_afectividad').val(registro.re_afectividad);
                    $('#con_area_cognitiva').val(registro.con_area_cognitiva);
                    $('#con_area_emocional').val(registro.con_area_emocional);
                    $('#tipresult_id').val(registro.tipresult_id);
                    $('#mot_eva').val(registro.mot_eva);
                    $('#tiem_lab').val(registro.tiem_lab);
                    $('#prin_riesgos').val(registro.prin_riesgos);
                    $('#med_seguridad').val(registro.med_seguridad);
                    $('#historia_familiar').val(registro.historia_familiar);
                    $('#accid_enfer').val(registro.accid_enfer);
                    $('#habitos').val(registro.habitos);
                    $('#otras_observ').val(registro.otras_observ);

                    ajustartextArea("mot_eva");
                    ajustartextArea("prin_riesgos");
                    ajustartextArea("med_seguridad");
                    ajustartextArea("historia_familiar");
                    ajustartextArea("accid_enfer");
                    ajustartextArea("habitos");
                    ajustartextArea("otras_observ");
                    ajustartextArea("con_area_cognitiva");
                    ajustartextArea("con_area_emocional");

                    let ant_empresas = registro.ant_empresas;
                    let filas = document.getElementById('tablaEmpresaAnt').getElementsByTagName('tr');

                    ant_empresas.forEach((empresa, index) => {
                        let fila = filas[index + 1];
                        let celdas = fila.getElementsByTagName('td');
                        celdas[0].querySelector('input').value = empresa.fecha;
                        celdas[1].querySelector('input').value = empresa.nombemp;
                        celdas[2].querySelector('input').value = empresa.actiemp;
                        celdas[3].querySelector('input').value = empresa.puesto;
                        celdas[4].querySelector('input').value = empresa.tiempo;
                        celdas[5].querySelector('input').value = empresa.causaret;
                    });

                }
                if (result[0].psicodet) {                    
                    let parametrosArray = JSON.parse(result[0].psicodet);
                    const tabla = document.getElementById('tablaPsicologiaTest');
                    parametrosArray.forEach(dato => {
                        const codpru_id = dato.codpru_id;
                        const valor_test = dato.valor_test;
                        const input_oculto = [...tabla.querySelectorAll('input[type="hidden"]')].find(input => input.value === codpru_id.toString());
                        if (input_oculto) {
                            const input_texto = input_oculto.parentElement.parentElement.querySelector('input[type="text"]');
                            if (input_texto) {
                                input_texto.value = valor_test;
                            }

                        }
                    });
                }
                if (result[0].diagnosticos) {
                    let diagnosticosArray = JSON.parse(result[0].diagnosticos);
                    for (let i = 0; i < diagnosticosArray.length && i < 3; i++) {
                        let registro = diagnosticosArray[i];
                        let codigo = registro.diacod;
                        let descripcion = registro.diades;
                        let comentario = registro.obs;
                        let combo = registro.tipdia;
                        if (i === 0) {
                            codcie101.value = codigo;
                            codcie10desc1.value = descripcion;
                            combocie101.value = combo;
                            codcie10comen1.value = comentario;
                        } else if (i === 1) {
                            codcie102.value = codigo;
                            codcie10desc2.value = descripcion;
                            combocie102.value = combo;
                            codcie10comen2.value = comentario;
                        } else if (i === 2) {
                            codcie103.value = codigo;
                            codcie10desc3.value = descripcion;
                            combocie103.value = combo;
                            codcie10comen3.value = comentario;
                        }
                    }
                }
                if (result[0].recomendaciones) {
                    let recomendacionArray = JSON.parse(result[0].recomendaciones);
                    for (let i = 0; i < recomendacionArray.length && i < 3; i++) {
                        let registro = recomendacionArray[i];
                        let desrec = registro.desrec;
                        let des_control = registro.des_control;

                        if (i === 0) {
                            recomendacion1.value = desrec;
                            control1.value = des_control;
                        } else if (i === 1) {
                            recomendacion2.value = desrec;
                            control2.value = des_control;
                        } else if (i === 2) {
                            recomendacion3.value = desrec;
                            control3.value = des_control;
                        }
                    }
                }
            }

        },
        error: function (Examenes) {
            alert('error');
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
    let doc_adic_id = document.getElementById('doc_adic_id').value;
    var datains = obtenerDataIns();
    var datainsrec = obtenerDataInsRec();
    let cod_present = $('input:radio[name=cod_present]:checked').val();
    let cod_postura = $('input:radio[name=cod_postura]:checked').val();
    let dis_ritmo = $('input:radio[name=dis_ritmo]:checked').val();
    let dis_tono = $('input:radio[name=dis_tono]:checked').val();
    let dis_articulacion = $('input:radio[name=dis_articulacion]:checked').val();
    let ori_tiempo = $('input:radio[name=ori_tiempo]:checked').val();
    let ori_espacio = $('input:radio[name=ori_espacio]:checked').val();
    let ori_persona = $('input:radio[name=ori_persona]:checked').val();
    let pro_cog_lucido_atento = $('#pro_cog_lucido_atento').val();
    let pro_cog_pensamiento = $('#pro_cog_pensamiento').val();
    let pro_cog_percepcion = $('#pro_cog_percepcion').val();
    let pro_cog_memoria = $('input:radio[name=pro_cog_memoria]:checked').val();
    let pro_cog_inteligencia = $('input:radio[name=pro_cog_inteligencia]:checked').val();
    let pro_cog_apetito = $('#pro_cog_apetito').val();
    let pro_cog_sueño = $('#pro_cog_sueño').val();
    let re_nivel_inte = $('#re_nivel_inte').val();
    let re_coord_visomotriz = $('#re_coord_visomotriz').val();
    let re_nivel_memoria = $('#re_nivel_memoria').val();
    let re_personalidad = $('#re_personalidad').val();
    let re_afectividad = $('#re_afectividad').val();
    let con_area_cognitiva = $('#con_area_cognitiva').val();
    let con_area_emocional = $('#con_area_emocional').val();
    let tipresult_id = $('#tipresult_id').val();
    var dataparametros = obtenerDataParametros();
    let mot_eva = $('#mot_eva').val();
    let tiem_lab = $('#tiem_lab').val();
    let prin_riesgos = $('#prin_riesgos').val();
    let med_seguridad = $('#med_seguridad').val();
    let dataantrelacionados = obtenerDataEmpresaAnt();
    let historia_familiar = $('#historia_familiar').val();
    let accid_enfer = $('#accid_enfer').val();
    let habitos = $('#habitos').val();
    let otras_observ = $('#otras_observ').val();

    const datosCompletos = {
        cita_id: cita_id,
        nuncom: nuncom,
        soexa: soexa,
        codpru_id: codpru_id,
        doc_adic_id: doc_adic_id,
        datains: datains,
        datainsrec: datainsrec,
        cod_present: cod_present,
        cod_postura: cod_postura,
        dis_ritmo: dis_ritmo,
        dis_tono: dis_tono,
        dis_articulacion: dis_articulacion,
        ori_tiempo: ori_tiempo,
        ori_espacio: ori_espacio,
        ori_persona: ori_persona,
        pro_cog_lucido_atento: pro_cog_lucido_atento,
        pro_cog_pensamiento: pro_cog_pensamiento,
        pro_cog_percepcion: pro_cog_percepcion,
        pro_cog_memoria: pro_cog_memoria,
        pro_cog_inteligencia: pro_cog_inteligencia,
        pro_cog_apetito: pro_cog_apetito,
        pro_cog_sueño: pro_cog_sueño,
        re_nivel_inte: re_nivel_inte,
        re_coord_visomotriz: re_coord_visomotriz,
        re_nivel_memoria: re_nivel_memoria,
        re_personalidad: re_personalidad,
        re_afectividad: re_afectividad,
        con_area_cognitiva: con_area_cognitiva,
        con_area_emocional: con_area_emocional,
        tipresult_id: tipresult_id,
        dataparametros: dataparametros,
        mot_eva: mot_eva,
        tiem_lab: tiem_lab,
        prin_riesgos: prin_riesgos,
        med_seguridad: med_seguridad,
        dataantrelacionados: dataantrelacionados,
        historia_familiar: historia_familiar,
        accid_enfer: accid_enfer,
        habitos: habitos,
        otras_observ: otras_observ
    };

    fetch('/pbpsicologia', {
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

};
function obtenerDataParametros() {
    var table = document.getElementById('tablaPsicologiaTest');

    var rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    var datainsrec = [];

    for (var i = 0; i < rows.length; i++) {
        var input = rows[i].getElementsByTagName('input');
        if (input.length >= 2 && input[0].value.trim() !== '') {
            var codpru_id = input[1].value;
            var valor_test = input[0].value;

            var rowDatarec = {
                codpru_id: codpru_id,
                valor_test: valor_test,

            };
            datainsrec.push(rowDatarec);
        }
    }
    return datainsrec;

};
function obtenerDataEmpresaAnt() {

    var table = document.getElementById('tablaEmpresaAnt');
    var rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    var datainsrec = [];

    for (var i = 0; i < rows.length; i++) {
        var input = rows[i].getElementsByTagName('input');
        if (input.length >= 6 && input[0].value.trim() !== '') {
            var fecha = input[0].value;
            var nombemp = input[1].value;
            var actiemp = input[2].value;
            var puesto = input[3].value;
            var tiempo = input[4].value;
            var causaret = input[5].value;

            var rowDatarec = {
                fecha: fecha,
                nombemp: nombemp,
                actiemp: actiemp,
                puesto: puesto,
                tiempo: tiempo,
                causaret: causaret,
            };
            datainsrec.push(rowDatarec);
        }
    }
    return datainsrec;
}

function obtenerPsicologiaTest() {
    mostrarDiv('cargatabla');
    ocultarDiv('tablaPsicologiaTest');

    let cita_id = document.getElementById('id').value;
    let soexa = document.getElementById('soexa').value;
    $.ajax({
        url: '/tablapsicologiatest',
        method: "GET",
        data: {
            cita_id: cita_id,
            soexa: soexa
        },
        success: function (result) {
            ocultarDiv('cargatabla');
            mostrarDiv('tablaPsicologiaTest');
            const tbodytest = $('#tbodytest');
            tbodytest.empty();
            if (result.length === 0) {
                tbodytest.append(`
                    <tr>
                        <td colspan="2" class="text-center">No hay resultados disponibles </td>
                    </tr>
                `);
            } else {
                result.forEach(resultado => {
                    tbodytest.append(`
                        <tr>
                            <td><input type="text" class="form-control" maxlength="80"></td>
                            <td>${resultado.desexadet}<input type="hidden" value="${resultado.codpru_id}"> </td>
                        </tr>
                    `);
                });

            }
        },
        error: function (Examenes) {
            alert('error');
        }
    });
};