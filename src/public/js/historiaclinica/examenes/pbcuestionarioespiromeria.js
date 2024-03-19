(function poblarcampos() {
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
        url: '/resultcuestionarioespirometria',
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
                if (result[0].cuestionario_espirometria) {
                    let cuestionario_espirometriaArray = JSON.parse(result[0].cuestionario_espirometria);
                    let registro = cuestionario_espirometriaArray[0];
                    $('input[type="radio"][name="ce_pre1"][value="' + registro.ce_pre1 + '"]').prop('checked', true);
                    $('input[type="radio"][name="ce_pre2"][value="' + registro.ce_pre2 + '"]').prop('checked', true);
                    $('input[type="radio"][name="ce_pre3"][value="' + registro.ce_pre3 + '"]').prop('checked', true);
                    $('input[type="radio"][name="ce_pre4"][value="' + registro.ce_pre4 + '"]').prop('checked', true);
                    $('input[type="radio"][name="ce_pre5"][value="' + registro.ce_pre5 + '"]').prop('checked', true);
                    $('input[type="radio"][name="ce_pre6"][value="' + registro.ce_pre6 + '"]').prop('checked', true);
                    $('input[type="radio"][name="ce_pre7"][value="' + registro.ce_pre7 + '"]').prop('checked', true);
                    $('input[type="radio"][name="ce_pre8"][value="' + registro.ce_pre8 + '"]').prop('checked', true);
                    $('input[type="radio"][name="ce_pre9"][value="' + registro.ce_pre9 + '"]').prop('checked', true);
                    $('input[type="radio"][name="ce_pre10"][value="' + registro.ce_pre10 + '"]').prop('checked', true);
                    $('input[type="radio"][name="ce_pre11"][value="' + registro.ce_pre11 + '"]').prop('checked', true);
                    $('input[type="radio"][name="ce_pre12"][value="' + registro.ce_pre12 + '"]').prop('checked', true);
                    $('input[type="radio"][name="ce_pre13"][value="' + registro.ce_pre13 + '"]').prop('checked', true);
                    $('input[type="radio"][name="ce_pre14"][value="' + registro.ce_pre14 + '"]').prop('checked', true);
                    $('input[type="radio"][name="ce_pre15"][value="' + registro.ce_pre15 + '"]').prop('checked', true);
                    $('input[type="radio"][name="ce_pre16"][value="' + registro.ce_pre16 + '"]').prop('checked', true);
                    $('input[type="radio"][name="ce_pre17"][value="' + registro.ce_pre17 + '"]').prop('checked', true);
                    $('input[type="radio"][name="ce_pre18"][value="' + registro.ce_pre18 + '"]').prop('checked', true);
                    $('input[type="radio"][name="ce_pre19"][value="' + registro.ce_pre19 + '"]').prop('checked', true);
                    $('input[type="radio"][name="ce_pre20"][value="' + registro.ce_pre20 + '"]').prop('checked', true);
                    $('input[type="radio"][name="ce_pre21"][value="' + registro.ce_pre21 + '"]').prop('checked', true);
                    $('input[type="radio"][name="ce_pre22"][value="' + registro.ce_pre22 + '"]').prop('checked', true);
                    $('input[type="radio"][name="ce_pre23"][value="' + registro.ce_pre23 + '"]').prop('checked', true);
                    $('input[type="radio"][name="ce_pre24"][value="' + registro.ce_pre24 + '"]').prop('checked', true);
                    $('input[type="radio"][name="ce_pre25"][value="' + registro.ce_pre25 + '"]').prop('checked', true);
                    $('input[type="radio"][name="ce_pre26"][value="' + registro.ce_pre26 + '"]').prop('checked', true);
                    $('input[type="radio"][name="ce_pre27"][value="' + registro.ce_pre27 + '"]').prop('checked', true);
                    $('#ce_pre21_rpta').val(registro.ce_pre21_rpta);
                }
                //$('input[type="radio"][name="ce_pre1"][value="' + valor + '"]').prop('checked', true);

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

    var dataparametros = obtenerDataParametros();
    const datosCompletos = {
        cita_id: cita_id,
        nuncom: nuncom,
        soexa: soexa,
        codpru_id: codpru_id,
        doc_adic_id: doc_adic_id,
        datains: datains,
        datainsrec: datainsrec,
        dataparametros: dataparametros
    };

    fetch('/pbcuestionarioespiromeria', {
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
    var data = [];
    var elements = document.querySelectorAll('#formPreguntas input[type="radio"]:checked');
    
    if (elements.length > 0) {
        var rowData = {};
        elements.forEach(function (element) {
            var name = element.name;
            var value = element.value;
            rowData[name] = value;
        });

        // Suponiendo que ce_pre21_rpta es un ID único
        var ce_pre21_rpta = document.getElementById('ce_pre21_rpta');
        if (ce_pre21_rpta) {
            rowData['ce_pre21_rpta'] = ce_pre21_rpta.value;
        }
        
        data.push(rowData);
    }
    
    return data;
}


function obtenerDataParametros1() {
    var data = [];
    var ce_pre1 = document.querySelector('input[name="ce_pre1"]:checked').value;
    var ce_pre2 = document.querySelector('input[name="ce_pre2"]:checked').value;
    var ce_pre3 = document.querySelector('input[name="ce_pre3"]:checked').value;
    var ce_pre4 = document.querySelector('input[name="ce_pre4"]:checked').value;
    var ce_pre5 = document.querySelector('input[name="ce_pre5"]:checked').value;
    var ce_pre6 = document.querySelector('input[name="ce_pre6"]:checked').value;
    var ce_pre7 = document.querySelector('input[name="ce_pre7"]:checked').value;
    var ce_pre8 = document.querySelector('input[name="ce_pre8"]:checked').value;
    var ce_pre9 = document.querySelector('input[name="ce_pre9"]:checked').value;
    var ce_pre10 = document.querySelector('input[name="ce_pre10"]:checked').value;
    var ce_pre11 = document.querySelector('input[name="ce_pre11"]:checked').value;
    var ce_pre12 = document.querySelector('input[name="ce_pre12"]:checked').value;
    var ce_pre13 = document.querySelector('input[name="ce_pre13"]:checked').value;
    var ce_pre14 = document.querySelector('input[name="ce_pre14"]:checked').value;
    var ce_pre15 = document.querySelector('input[name="ce_pre15"]:checked').value;
    var ce_pre16 = document.querySelector('input[name="ce_pre16"]:checked').value;
    var ce_pre17 = document.querySelector('input[name="ce_pre17"]:checked').value;
    var ce_pre18 = document.querySelector('input[name="ce_pre18"]:checked').value;
    var ce_pre19 = document.querySelector('input[name="ce_pre19"]:checked').value;
    var ce_pre20 = document.querySelector('input[name="ce_pre20"]:checked').value;
    var ce_pre21 = document.querySelector('input[name="ce_pre21"]:checked').value;
    var ce_pre22 = document.querySelector('input[name="ce_pre22"]:checked').value;
    var ce_pre23 = document.querySelector('input[name="ce_pre23"]:checked').value;
    var ce_pre24 = document.querySelector('input[name="ce_pre24"]:checked').value;
    var ce_pre25 = document.querySelector('input[name="ce_pre25"]:checked').value;
    var ce_pre26 = document.querySelector('input[name="ce_pre26"]:checked').value;
    var ce_pre27 = document.querySelector('input[name="ce_pre27"]:checked').value;

    var ce_pre21_rpta = document.getElementById('ce_pre21_rpta').value;
    var rowData = {
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
        ce_pre27: ce_pre27,
        ce_pre21_rpta:ce_pre21_rpta,
    };

    data.push(rowData);

    return data;
};

