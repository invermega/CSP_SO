$(document).ready(function () {
    getCitasCombo();

    const refresh = document.getElementById('refresh');
    refresh.addEventListener('click', getcitas);
    const search = document.getElementById('search');
    search.addEventListener('click', getcitas);
    var fechaActual = new Date().toISOString().split('T')[0];
    var fechaActual = new Date().toISOString().split('T')[0];
    $("#fecini").val(fechaActual);
    $("#fecfin").val(fechaActual);
    render();
});

function getcitas() {
    let fecini = $('#fecini');//fecha inicio
    let fecfin = $('#fecfin');//fecha fin
    let paciente = $('#paciente');//busqueda por dni o nombre
    let parametro3 = $('#stacita');//estados
    let parametro4 = $('#codpro_id');//protocolo
    let parametro5 = 'N';//checked por auditar
    let parametro6 = $('#inputid');
    if ($("#parametro5").prop("checked")) {
        parametro5 = 'S'
    } else {
        parametro5 = 'N'
    }
    parametro6 = 0;
    $.ajax({
        url: '/listarcitas',
        method: 'GET',
        data: {
            fecini: fecini.val(),
            fecfin: fecfin.val(),
            paciente: paciente.val(),
            parametro3: parametro3.val(),
            parametro4: parametro4.val(),
            parametro5: parametro5,
            parametro6: parametro6
        },
        success: function (citas) {
            ocultarDiv('carga');
            mostrarDiv('mydatatable');
            const tbody = $('#bodyCita');
            tbody.empty();

            if (citas.length === 0) {
                tbody.append(`
                    <tr>
                        <td colspan="6" class="text-center">No hay resultados disponibles </td>
                    </tr>
                `);
            } else {
                citas.forEach(cita => {
                    tbody.append(`
            <tr data-id="${cita.id}">
              <td class="align-middle"><input id="check_${cita.id}" value="id_${cita.id}" type="checkbox" class="mt-1" ></td>
              <td>${cita.appm_nom}</td>
              <td>${cita.numdoc}</td>
              <td>${cita.Fecha}</td>
              <td>${cita.Hora}</td>
              <td>${cita.Turno}</td>
            </tr>
          `);
                });
                mensaje(citas[0].tipo, citas[0].response, 1500);
            }

        },
        error: function () {
            alert('Error en la solicitud AJAX');
        },
    });
}
function getCitasCombo() {
    $.ajax({
        url: '/listarCombosCitas',
        success: function (lista) {
            let stacita = $('#stacita');
            stacita.html('');
            stacita.append('<option value="%">TODOS</option>');
            lista.forEach(item => {
                let option = `<option value="${item.id}">${item.descripcion}</option>`;
                if (item.tabla === 'so_estadocita') {
                    stacita.append(option);
                }
            });
            stacita.val('G');
        },
        error: function () {
            alert('error');
        }
    });
}

document.getElementById("empresamodal").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        var parametro = this.value;
        getclientes(parametro);
    }
});
function getclientes(parametro) {
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
                codpro_id.on('change', function () {
                    let tercerColumna = obtenerTerceraColumna(lista, $(this).val());
                    $('#tipexa_id').val(tercerColumna);
                });
                codpro_id.trigger('change');
            }

        },
        error: function () {
            alert('Error en la solicitud AJAX');
        },
    });
}

function eliminar() {
    var table = document.getElementById('mydatatable');
    if (!table) {
        console.error('La tabla no se encontró.');
        return;
    }
    var rows = table.querySelectorAll('tbody tr');
    var seleccionados = [];
    for (var i = 0; i < rows.length; i++) {
        var checkbox = rows[i].querySelector('input[type="checkbox"]');

        if (checkbox && checkbox.checked) {
            var cita_id = checkbox.value.split('_')[1];
            seleccionados.push({ cita_id: cita_id });
        }
    }
    if (seleccionados.length === 0) {
        mensajecentral('error', 'Debes seleccionar algún registro.');
    } else {
        MensajeSIyNO('warning', '', '¿Está seguro de eliminar las citas seleccionadas?', function (respuesta) {
            console.log(seleccionados);
            if (respuesta) {
                fetch('/citadel', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(seleccionados)
                })
                    .then(response => {
                        if (!response.ok) {
                            console.error('Error en la solicitud');
                            throw new Error('Error en la solicitud');
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data[0].icono === "success") {
                            for (var i = 0; i < seleccionados.length; i++) {
                                var citaId = seleccionados[i].cita_id;
                                var fila = table.querySelector('tr[data-id="' + citaId + '"]');
                                if (fila) {
                                    fila.remove(); 
                                }
                            }
                        }
                        mensaje(data[0].icono, data[0].mensaje, 1500);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            }
        });
    }
}