
$(document).ready(function () {
    fechahoy('fecprocitaDate');
    fechahoy('fecing_cargo');
    fechahoy('fecing_area');
    fechahoy('fecing_empresa');

    horatime('fecprocitaTime');
    getPacienteCombos();
    /*const bloques = document.querySelectorAll('.bloque');

    bloques.forEach(function (bloque) {
        const radioButtons = bloque.querySelectorAll('input[type="radio"]');

        radioButtons.forEach(function (radioButton) {
            radioButton.addEventListener('change', function () {
                // Desmarca los otros botones de radio en el mismo bloque
                radioButtons.forEach(function (otherRadioButton) {
                    if (otherRadioButton !== radioButton && otherRadioButton.name === radioButton.name) {
                        otherRadioButton.checked = false;
                    }
                });
            });
        });
    });*/
});
function getPacienteCombos() {
    $.ajax({
        url: '/listarCombosCitas',
        success: function (lista) {
            let tipexa_id = $('#tipexa_id'); // Selecionar el select de tipo de examen
            let altilab_id = $('#altilab_id'); // Selecionar el select de altitud
            let superf_id = $('#superf_id'); // Selecionar el select superficie
            let tipseg_id = $('#tipseg_id'); // Selecionar el select de tipo de seguro
            let valapt_id = $('#valapt_id'); // Selecionar el select de aptitud
            
            tipexa_id.html('');
            altilab_id.html('');
            superf_id.html('');
            tipseg_id.html('');
            valapt_id.html('');
            lista.forEach(item => {
                let option = `<option value="${item.id}">${item.descripcion}</option>`;
                if (item.tabla === 'altitud_labor') {
                    tipexa_id.append(option);
                } else if (item.tabla === 'tipo_examen') {
                    altilab_id.append(option);
                } else if (item.tabla === 'superficie') {
                    superf_id.append(option);
                } else if (item.tabla === 'tipo_seguros') {
                    tipseg_id.append(option);
                }else if (item.tabla === 'valoraptitud') {
                    valapt_id.append(option);
                }
            });

        },
        error: function () {
            alert('error');
        }
    });
}
function getpacientes(parametro) {
    mostrarDiv('carga');
    ocultarDiv('tablapacientemodal');
    $.ajax({
        url: '/listarpacientes',
        method: 'GET',
        data: {
            parametro: parametro,
        },
        success: function (pacientes) {
            ocultarDiv('carga');
            mostrarDiv('tablapacientemodal');
            const tbodypac = $('#bodypacientemodal');
            tbodypac.empty();
            if (pacientes.length === 0) {
                tbodydistrito.append(`
                    <tr>
                        <td colspan="2" class="text-center">No hay resultados disponibles </td>
                    </tr>
                `);
            } else {
                pacientes.forEach(paciente => {
                    tbodypac.append(`
            <tr>             
              <td>${paciente.appm_nom}</td>
              <td>${paciente.pachis}</td>
              <td>
              
              <button onclick="getpacientem('${paciente.appm_nom}','${paciente.pachis}')" class="btn btn-circle btn-sm btn-warning mr-1"><i class="fa-regular fa-pen-to-square"></i></button>
              
              </td>
            </tr>
          `);
                });

            }
            mensaje(pacientes[0].tipo, pacientes[0].response, 1500);
        },
        error: function () {
            alert('Error en la solicitud AJAX');
        },
    });
}
document.getElementById("pacientemodal").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        var parametro = this.value;
        getpacientes(parametro);
    }
});
function getpacientem(appm_nom, pachis) {
    $('#appm_nom').val(appm_nom);
    $('#pachis').val(pachis);
    $('#modalFormpaciente [data-dismiss="modal"]').trigger('click');

    event.preventDefault();
}
document.getElementById("empresamodal").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        var parametro = this.value;
        console.log(parametro)
        getclientes(parametro);
    }
});
function getclientes(parametro) {
    mostrarDiv('cargaEmpresa');
    ocultarDiv('tableEmpresamodal');
    $.ajax({
        url: '/empresas',
        method: 'GET',
        data: {
            parametro: parametro,
        },
        success: function (clientes) {
            ocultarDiv('cargaEmpresa');
            mostrarDiv('tableEmpresamodal');
            const tbodycli = $('#bodyEmpresa');
            tbodycli.empty();
            if (clientes.length === 0) {
                tbodycli.append(`
                    <tr>
                        <td colspan="2" class="text-center">No hay resultados disponibles </td>
                    </tr>
                `);
            } else {
                clientes.forEach(cliente => {
                    tbodycli.append(`
            <tr>             
              <td>${cliente.razsoc}</td>
              <td>${cliente.NumDoc}</td>
              <td>
              <button onclick="getempresam('${cliente.razsoc}','${cliente.cli_id}')" class="btn btn-circle btn-sm btn-warning mr-1"><i class="fa-regular fa-pen-to-square"></i></button>
              
              </td>
            </tr>
          `);
                });

            }
            //mensaje(clientes[0].icono, clientes[0].mensaje, 1500);
        },
        error: function () {
            alert('Error en la solicitud AJAX');
        },
    });
}
function getempresam(razsoc, cli_id) {
    $('#razsoc').val(razsoc);
    $('#cli_id').val(cli_id);
    //$('#modalFormEmpresa [data-dismiss="modal"]').trigger('click');
    getprotocolo(cli_id);
    event.preventDefault();
}

function getprotocolo(parametro) {
    $.ajax({
        url: '/listarprotocolo',
        method: 'GET',
        data: {
            parametro: parametro,
        },
        success: function (lista) {
            let codpro_id = $('#codpro_id');
            codpro_id.html('');
            if (lista.length === 0) {
                let defaultOption = '<option value=""></option>';
                codpro_id.append(defaultOption);
            } else {
                lista.forEach(item => {
                    let option = `<option value="${item.id}">${item.descripcion}</option>`;
                    codpro_id.append(option);

                });
            }
        },
        error: function () {
            alert('Error en la solicitud AJAX');
        },
    });
}

function guardarCita(){
    $("#btnCita").prop("disabled", true);
    let cli_id = $('#cli_id');
    let codpro_id = $('#codpro_id');
    let tipexa_id = $('#tipexa_id');
    let pachis = $('#pachis');
    let fecprocitaDate = $('#fecprocitaDate');
    let fecprocitaTime = $('#fecprocitaTime');
    let obscita = $('#obscita');
    let cargo_actual = $('#cargo_actual');
    let fecing_cargo = $('#fecing_cargo');
    let area_actual = $('#area_actual');
    let fecing_area = $('#fecing_area');
    let fecing_empresa = $('#fecing_empresa');
    let altilab_id = $('#altilab_id');
    let superf_id = $('#superf_id');
    let tipseg_id = $('#tipseg_id');
    let valapt_id = $('#valapt_id');
    let cond_vehiculo = document.querySelector("input[name='cond_vehiculo']:checked").value;
    let ope_equipo_pesado = document.querySelector("input[name='ope_equipo_pesado']:checked").value;
    let envresult_correo = document.querySelector("input[name='envresult_correo']:checked").value;
    let com_info_medica = document.querySelector("input[name='com_info_medica']:checked").value;
    let ent_result_fisico = document.querySelector("input[name='ent_result_fisico']:checked").value;
    let usa_firma_formatos = document.querySelector("input[name='usa_firma_formatos']:checked").value;
    let res_lugar_trabajo = document.querySelector("input[name='res_lugar_trabajo']:checked").value;
    validarFormulario('body1','');
    $.ajax({
        url: '/cita',
        method: "POST",
        data: {
            cli_id: cli_id.val(),
            codpro_id: codpro_id.val(),
            tipexa_id: tipexa_id.val(),
            pachis: pachis.val(),
            fecprocitaDate: fecprocitaDate.val(),
            fecprocitaTime: fecprocitaTime.val(),
            obscita: obscita.val(),
            cargo_actual: cargo_actual.val(),
            fecing_cargo: fecing_cargo.val(),
            area_actual: area_actual.val(),
            fecing_area: fecing_area.val(),
            fecing_empresa: fecing_empresa.val(),
            altilab_id: altilab_id.val(),
            superf_id: superf_id.val(),
            tipseg_id: tipseg_id.val(),
            valapt_id: valapt_id.val(),            
            cond_vehiculo: cond_vehiculo,
            ope_equipo_pesado: ope_equipo_pesado,
            envresult_correo: envresult_correo,
            com_info_medica: com_info_medica,
            ent_result_fisico: ent_result_fisico,
            usa_firma_formatos: usa_firma_formatos,
            res_lugar_trabajo: res_lugar_trabajo,
        },
        success: function (response) {
            $('input[type="text"]').val("");
            opc = 0;
            //limpiar();
            mensaje(response[0].tipo, response[0].response, 1500);
            $("#btnCita").prop("disabled", false);
        },
        error: function () {
            mensaje('error', 'Error al guardar, intente nuevamente', 1500);
            $("#btnCita").prop("disabled", false);
        }
    });
}