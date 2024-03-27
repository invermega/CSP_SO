(function poblarcampos() {
    obtenerOftalmologiaTest();
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
        url: '/resultoftalmologia',
        method: "GET",
        data: {
            cita_id: cita_id,
            soexa: soexa
        },
        success: function (result) {
            if (result[0].mensaje != 'sin datos') {
                nuncom.value = result[0].nuncom;
                doc_adic_id.value = result[0].doc_adic_id;
                $('#antecedentes').val(result[0].antecedentes);
                $('input[type=radio][name=usa_lentes][value="' + result[0].usa_lentes + '"]').prop('checked', true);
                $('#ultima_act').val(result[0].ultima_act);
                if (result[0].agudeza_visual) {
                    let agudeza_visualArray = JSON.parse(result[0].agudeza_visual);
                    let tableRows = document.querySelectorAll("#agudeza_visual tbody tr");
                    agudeza_visualArray.forEach(function (item, index) {
                        let row = tableRows[index];
                        row.querySelector("td:first-child span").textContent = item.texto;
                        let inputs = row.querySelectorAll("td input");
                        inputs[0].value = item.sincorrecionlejos;
                        inputs[1].value = item.concorrecionlejos;
                        inputs[2].value = item.agujeroestenopeico;
                        inputs[3].value = item.sincorrecioncerca;
                        inputs[4].value = item.concorrecioncerca;
                    });
                }
                if (result[0].Refraccion) {
                    let RefraccionArray = JSON.parse(result[0].Refraccion);
                    let registro = RefraccionArray;
                    $('#lodesfera').val(registro.lodesfera);
                    $('#lodcilindro').val(registro.lodcilindro)
                    $('#lodeje').val(registro.lodeje)
                    $('#lodav').val(registro.lodav)
                    $('#loicilindro').val(registro.loicilindro)
                    $('#loieje').val(registro.loieje)
                    $('#loiav').val(registro.loiav)
                    $('#loddip').val(registro.loddip)
                    $('#codcilindro').val(registro.codcilindro)
                    $('#codeje').val(registro.codeje)
                    $('#codav').val(registro.codav)
                    $('#coiesfera').val(registro.coiesfera)
                    $('#coicilindro').val(registro.coicilindro)
                    $('#coieje').val(registro.coieje)
                    $('#coiav').val(registro.coiav)
                    $('#coddip').val(registro.coddip)
                }
                if (result[0].oftalmodet) {
                    let parametrosArray = JSON.parse(result[0].oftalmodet);
                    const tabla = document.getElementById('tablaOftalmologiaTest');
                    parametrosArray.forEach(dato => {
                        const codpru_id = dato.codpru_id;
                        const resultado_test = dato.resultado_test;
                        const input_oculto = [...tabla.querySelectorAll('input[type="hidden"]')].find(input => input.value === codpru_id.toString());
                        if (input_oculto) {
                            const input_texto = input_oculto.parentElement.parentElement.querySelector('input[type="text"]');
                            if (input_texto) {
                                input_texto.value = resultado_test;
                            }
                        }
                    });
                }
                $('input[type=radio][name=Reconoce_colores][value="' + result[0].Reconoce_colores + '"]').prop('checked', true);
                $('#hallazgos').val(result[0].hallazgos);
                if (result[0].doc_adic_id != '0') {
                    resultcrearMiniatura(result[0].rutarch, result[0].nomarch);
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
    let antecedentes = document.getElementById('antecedentes').value;
    var usa_lentes = $('input[name="usa_lentes"]:checked').val();
    let ultima_act = document.getElementById('ultima_act').value;
    var agudeza_visual = obtenerDataAgudeza_visual();
    var Refraccion = obtenerDataRefraccion();
    var oftalmologiaTest = obtenerDataParametros();
    var Reconoce_colores = $('input[name="Reconoce_colores"]:checked').val();
    let hallazgos = document.getElementById('hallazgos').value;
    let doc_adic_id = document.getElementById('doc_adic_id').value;
    var datains = obtenerDataIns();
    var datainsrec = obtenerDataInsRec();
    const datosCompletos = {
        cita_id: cita_id,
        nuncom: nuncom,
        soexa: soexa,
        codpru_id: codpru_id,
        antecedentes: antecedentes,
        usa_lentes: usa_lentes,
        ultima_act: ultima_act,
        agudeza_visual: agudeza_visual,
        Refraccion: Refraccion,
        oftalmologiaTest: oftalmologiaTest,
        Reconoce_colores: Reconoce_colores,
        hallazgos: hallazgos,
        doc_adic_id: doc_adic_id,
        datains: datains,
        datainsrec: datainsrec
    };
    fetch('/pboftalmologia', {
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
function obtenerDataAgudeza_visual() {
    var data = [];
    $('#agudeza_visual tbody tr').each(function () {
        var fila = $(this);
        var texto = fila.find('td:first span').text();
        var sincorrecionlejos = fila.find('td:nth-child(2) input[type=text]').val();
        var concorrecionlejos = fila.find('td:nth-child(3) input[type=text]').val();
        var agujeroestenopeico = fila.find('td:nth-child(4) input[type=text]').val();
        var sincorrecioncerca = fila.find('td:nth-child(5) input[type=text]').val();
        var concorrecioncerca = fila.find('td:nth-child(6) input[type=text]').val();
        var rowData = {
            texto: texto,
            sincorrecionlejos: sincorrecionlejos,
            concorrecionlejos: concorrecionlejos,
            agujeroestenopeico: agujeroestenopeico,
            sincorrecioncerca: sincorrecioncerca,
            concorrecioncerca: concorrecioncerca
        };
        data.push(rowData);
    });
    return data;
}
function obtenerOftalmologiaTest() {
    mostrarDiv('cargatabla');
    ocultarDiv('tablaOftalmologiaTest');

    let cita_id = document.getElementById('id').value;
    let soexa = document.getElementById('soexa').value;
    $.ajax({
        url: '/tablaoftalmologiatest',
        method: "GET",
        data: {
            cita_id: cita_id,
            soexa: soexa
        },
        success: function (result) {
            ocultarDiv('cargatabla');
            mostrarDiv('tablaOftalmologiaTest');
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
function obtenerDataParametros() {
    var table = document.getElementById('tablaOftalmologiaTest');

    var rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    var datainsrec = [];

    for (var i = 0; i < rows.length; i++) {
        var input = rows[i].getElementsByTagName('input');
        if (input.length >= 2 && input[0].value.trim() !== '') {
            var codpru_id = input[1].value;
            var resultado_test = input[0].value;

            var rowDatarec = {
                codpru_id: codpru_id,
                resultado_test: resultado_test,

            };
            datainsrec.push(rowDatarec);
        }
    }
    return datainsrec;

};
function obtenerDataRefraccion() {
    var data = {
        lodesfera: $('#lodesfera').val(),
        lodcilindro: $('#lodcilindro').val(),
        lodeje: $('#lodeje').val(),
        lodav: $('#lodav').val(),
        loiesfera: $('#loiesfera').val(),
        loicilindro: $('#loicilindro').val(),
        loieje: $('#loieje').val(),
        loiav: $('#loiav').val(),
        loddip: $('#loddip').val(),
        codesfera: $('#codesfera').val(),
        codcilindro: $('#codcilindro').val(),
        codeje: $('#codeje').val(),
        codav: $('#codav').val(),
        coiesfera: $('#coiesfera').val(),
        coicilindro: $('#coicilindro').val(),
        coieje: $('#coieje').val(),
        coiav: $('#coiav').val(),
        coddip: $('#coddip').val(),
    };
    return data;
};