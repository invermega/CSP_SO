$(document).ready(function () {
    getPacienteCombos();
    $('#fecprocitaTime').clockTimePicker({
        duration: true,
        durationNegative: false,
        alwaysSelectHoursFirst: true,
        afternoonHoursInOuterCircle: true,
        //precision: 10,
        required: true,
        i18n: {
            cancelButton: 'Abbrechen'
        },
        onAdjust: function (newVal, oldVal) {            
        }
    });
});

function getcitas(id) {
    let fecini = '';//fecha inicio
    let fecfin = '';//fecha fin
    let paciente = '';//busqueda por dni o nombre
    let parametro3 = '';//estados
    let parametro4 = '';//protocolo
    let parametro5 = '';//checked por auditar
    let parametro6 = '';
    parametro6 = id;

    $.ajax({
        url: '/listarcitas',
        method: 'GET',
        data: {
            fecini: fecini,
            fecfin: fecfin,
            paciente: paciente,
            parametro3: parametro3,
            parametro4: parametro4,
            parametro5: parametro5,
            parametro6: parametro6
        },
        success: function (citas) {
            $('#cli_id').val(citas[0].cli_id);
            $('#razsoc').val(citas[0].razsoc);
            getempresam(citas[0].razsoc, citas[0].cli_id).then(function () {
                $('#codpro_id').val(citas[0].codpro_id);
                $('#tipexa_id').val(citas[0].tipexa_id);
                $('#pachis').val(citas[0].pachis);
                $('#appm_nom').val(citas[0].appm_nom);
                $('#fecprocitaDate').val(citas[0].fecprocitaDate);
                $('#fecprocitaTime').val(citas[0].fecprocitaTime);
                $('#obscita').val(citas[0].obscita);
                $('#cargo_actual').val(citas[0].cargo_actual);
                $('#fecing_cargo').val(citas[0].fecing_cargo);
                $('#area_actual').val(citas[0].area_actual);
                $('#fecing_area').val(citas[0].fecing_area);
                $('#fecing_empresa').val(citas[0].fecing_empresa);
                $('#altilab_id').val(citas[0].altilab_id);
                $('#superf_id').val(citas[0].superf_id);
                $('#tipseg_id').val(citas[0].tipseg_id);
                $('#cond_vehiculo').val(citas[0].cond_vehiculo);
                $('#ope_equipo_pesado').val(citas[0].ope_equipo_pesado);
                $('#envresult_correo').val(citas[0].envresult_correo);
                $('#com_info_medica').val(citas[0].com_info_medica);
                $('#ent_result_fisico').val(citas[0].ent_result_fisico);
                $('#usa_firma_formatos').val(citas[0].usa_firma_formatos);
                $('#res_lugar_trabajo').val(citas[0].res_lugar_trabajo);

                mensaje(citas[0].tipo, citas[0].response, 1500);
            }).catch(function (error) {
                console.error('Error en getempresam:', error);
            });
        },
        error: function () {
            alert('Error en la solicitud AJAX');
        },
    });
}
function getPacienteCombos() {
    $.ajax({
        url: '/listarCombosCitas',
        success: function (lista) {

            let altilab_id = $('#altilab_id'); // Selecionar el select de altitud
            let superf_id = $('#superf_id'); // Selecionar el select superficie
            let tipseg_id = $('#tipseg_id'); // Selecionar el select de tipo de seguro
            altilab_id.html('');
            superf_id.html('');
            tipseg_id.html('');
            lista.forEach(item => {
                let option = `<option value="${item.id}">${item.descripcion}</option>`;//sirve para que liste todos los combo
                if (item.tabla === 'altitud_labor') {
                    //altitud_labor
                    altilab_id.append(option); //Hace que liste el combo
                } else if (item.tabla === 'superficie') {
                    superf_id.append(option);
                } else if (item.tabla === 'tipo_seguros') {
                    tipseg_id.append(option);
                } 
            });


            const id = document.getElementById("inputid").value;
            if (id === "0") {
                var fecha = new Date().toISOString().slice(0, 10);
                document.getElementById("fecprocitaDate").value = fecha;
                document.getElementById("fecing_cargo").value = fecha;
                document.getElementById("fecing_area").value = fecha;
                document.getElementById("fecing_empresa").value = fecha;
                var horaActual = new Date();
                var horaInicial = horaActual.getHours() + ':' + horaActual.getMinutes();
                $('#fecprocitaTime').clockTimePicker('value', horaInicial);
            } else {
                getcitas(id);
            }
        },
        error: function () {
            alert('error');
        }
    });
}
document.getElementById("pacientemodal").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        let parametro = 0;
        var parametro1 = $('#pacientemodal').val();
        mostrarDiv('carga');
        ocultarDiv('tablapacientemodal');
        $.ajax({
            url: '/listarpacientes',
            method: 'GET',
            data: {
                parametro: parametro,
                parametro1: parametro1,
            },
            success: function (pacientes) {
                ocultarDiv('carga');
                mostrarDiv('tablapacientemodal');
                const tbodypac = $('#bodypacientemodal');
                tbodypac.empty();
                if (pacientes.length === 0) {
                    tbodypac.append(`
                    <tr>
                        <td colspan="3" class="text-center">No hay resultados disponibles </td>
                    </tr>
                `);
                } else {
                    pacientes.forEach(paciente => {
                        tbodypac.append(`
                        <tr>  
                        <td>              
                            <button onclick="getpacientem(this)" class="btn btn-circle btn-sm btn-info mr-1"><i class="fa-solid fa-plus"></i></button>              
                        </td>           
                        <td>${paciente.appm_nom}</td>
                        <td>${paciente.pachis}</td>
                        </tr>
                    `);
                    });

                }
            },
            error: function () {
                alert('Error en la solicitud AJAX');
            },
        });

    }
});
function getpacientem(btn) {
    event.preventDefault();
    var filaorigen = $(btn).closest("tr");
    var appm_nom = filaorigen.find("td:eq(1)").text();
    var pachis = filaorigen.find("td:eq(2)").text();
    $('#appm_nom').val(appm_nom);
    $('#pachis').val(pachis);
    var btncerrar = document.getElementById(`cerrarPacienteModal`);
    btncerrar.click();
    event.preventDefault();

}
document.getElementById("empresamodal").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        var parametro = $('#empresamodal').val();
        mostrarDiv('cargaEmpresa');
        ocultarDiv('tableEmpresamodal');
        console.log(parametro);
        $.ajax({
            url: '/empresas',
            method: 'GET',
            data: {
                empresa: parametro,
            },
            success: function (clientes) {
                ocultarDiv('cargaEmpresa');
                mostrarDiv('tableEmpresamodal');
                const tbodycli = $('#bodyEmpresa');
                tbodycli.empty();
                if (clientes.length === 0) {
                    tbodycli.append(`
                    <tr>
                        <td colspan="3" class="text-center">No hay resultados disponibles </td>
                    </tr>
                `);
                } else {
                    clientes.forEach(cliente => {
                        tbodycli.append(`
            <tr>
              <td>
               <button onclick="getempresam('${cliente.razsoc}','${cliente.cli_id}')" class="btn btn-circle btn-sm btn-info mr-1"><i class="fa-solid fa-plus"></i></button>              
              </td>
              <td>${cliente.razsoc}</td>
              <td>${cliente.NumDoc}</td>
              
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
});
function getclientes(parametro) {
    mostrarDiv('cargaempresamodal');
    ocultarDiv('tableempresamodal');
    $.ajax({
        url: '/empresas',
        method: 'GET',
        data: {
            empresa: parametro,
        },
        success: function (clientes) {
            ocultarDiv('cargaempresamodal');
            mostrarDiv('tableempresamodal');
            const tbodycli = $('#bodyempresamodal');
            tbodycli.empty();
            if (clientes.length === 0) {
                tbodycli.append(`
                    <tr>
                        <td colspan="3" class="text-center">No hay resultados disponibles </td>
                    </tr>
                `);
            } else {
                clientes.forEach(cliente => {
                    tbodycli.append(`
            <tr>
              <td>
               <button onclick="getempresam('${cliente.razsoc}','${cliente.cli_id}')" class="btn btn-circle btn-sm btn-info mr-1"><i class="fa-solid fa-plus"></i></button>              
              </td>
              <td>${cliente.razsoc}</td>
              <td>${cliente.NumDoc}</td>
              
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
    return new Promise(function (resolve, reject) {
        $('#razsoc').val(razsoc);
        $('#cli_id').val(cli_id);
        getprotocolo(cli_id).then(function () {
            var btncerrar = document.getElementById(`cerrarEmpresaModal`);
            btncerrar.click();
            resolve();
        }).catch(function (error) {
            reject(error);
        });
    });
}

function getprotocolo(parametro) {
    return new Promise(function (resolve, reject) {
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
                    codpro_id.on('change', function () {
                        let tercerColumna = obtenerTerceraColumna(lista, $(this).val());
                        $('#tipexa_id').val(tercerColumna);
                    });
                    codpro_id.trigger('change');
                }
                resolve();
            },
            error: function (error) {
                reject(error);
            },
        });
    });
}
function obtenerTerceraColumna(lista, idSeleccionado) {
    let tercerColumnaValor = '';
    lista.forEach(item => {
        if (item.id === idSeleccionado) {
            tercerColumnaValor = item.desexa;
        }
    });
    return tercerColumnaValor;
}
document.getElementById("codpro_id").addEventListener("change", function (event) {
    if (event.key === "Enter") {
        var parametro = this.value;
        getclientes(parametro);
    }
});
function Grabar() {
    var btnCita = document.getElementById("btnCita");
    btnCita.disabled = true;
    //$("#btnCita").prop("disabled", true);
    let inputid = $('#inputid');
    let cli_id = $('#cli_id');
    let codpro_id = $('#codpro_id');
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
    let cond_vehiculo = document.querySelector("input[name='cond_vehiculo']:checked").value;
    let ope_equipo_pesado = document.querySelector("input[name='ope_equipo_pesado']:checked").value;
    let envresult_correo = document.querySelector("input[name='envresult_correo']:checked").value;
    let com_info_medica = document.querySelector("input[name='com_info_medica']:checked").value;
    let ent_result_fisico = document.querySelector("input[name='ent_result_fisico']:checked").value;
    let usa_firma_formatos = document.querySelector("input[name='usa_firma_formatos']:checked").value;
    let res_lugar_trabajo = document.querySelector("input[name='res_lugar_trabajo']:checked").value;
    const validarFormulario1 = validarFormulario('empresamodal,pacientemodal,obscita');

    if (!validarFormulario1) {
        btnCita.disabled = false;
        return;
    }
    $.ajax({
        url: '/cita',
        method: "POST",
        data: {
            inputid: inputid.val(),
            cli_id: cli_id.val(),
            codpro_id: codpro_id.val(),
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
            cond_vehiculo: cond_vehiculo,
            ope_equipo_pesado: ope_equipo_pesado,
            envresult_correo: envresult_correo,
            com_info_medica: com_info_medica,
            ent_result_fisico: ent_result_fisico,
            usa_firma_formatos: usa_firma_formatos,
            res_lugar_trabajo: res_lugar_trabajo,
        },
        success: function (response) {
            btnCita.disabled = false;
            opc = 0;
            if (response[0].tipo === 'success') {
                MensajeSIyNO(response[0].tipo, response[0].mensaje, '¿Desea volver?', function (respuesta) {
                    if (respuesta) {
                        $('input[type="text"]').val("");
                        rendersub('/cita');
                    } else {
                        if (response[0].tipo === "success") {
                            limpiarImput();
                        }
                        return;
                    }
                });
            } else {
                btnCita.disabled = false;
                mensaje(response[0].tipo, response[0].mensaje, 1500);
            }
        },
        error: function (error) {
            mensaje('error', 'Error al guardar, intente nuevamente '+ error, 1500);
            btnCita.disabled = false;
            //$("#btnCita").prop("disabled", false);
        }
    });
}


