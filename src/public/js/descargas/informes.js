$(document).ready(function () {
    fechahoy('fechainicio');
    fechahoy('fechafin');

});

function getPacientesDescarga() {
    var select = document.getElementById('codpro_id');
    var selectedValue = select.value;
    if (selectedValue !== '') {
        mostrarDiv('carga');
        ocultarTabla('mydatatable');
        let fechainicio = $('#fechainicio').val();
        let fechafin = $('#fechafin').val();
        let protocolo = $('#codpro_id').val();
        let empresa = $('#cli_id').val();
        $.ajax({
            url: '/pacientesdescargalist',
            method: "GET",
            data: {
                fechainicio: fechainicio,
                fechafin: fechafin,
                protocolo: protocolo,
                empresa: empresa
            },
            success: function (Pacientes) {
                ocultarDiv('carga');
                mostrarTabla('mydatatable');
                let tablebody = $('#tbodypac');
                tablebody.html('');
                if (Pacientes.length === 0) {
                    tablebody.append(`
              <tr>
                <td colspan="8">No hay pacientes con los filtros proporcionados</td>
              </tr>
            `);
                } else {
                    Pacientes.forEach(Paciente => {
                        tablebody.append(`
            <tr data-id="${Paciente.ID}">
            <td class="align-middle"><input id="check_${Paciente.ID}" value="id_${Paciente.ID}" type="checkbox" class="mt-1" ></td>
                <td style="vertical-align: middle;" class="text-left">${Paciente.FECHADECITA}</td>
                <td style="vertical-align: middle;" class="text-left">${Paciente.PACIENTE}</td>
                  <td style="vertical-align: middle;" class="text-left">${Paciente.EDAD}</td>
                  <td style="vertical-align: middle;" class="text-left">${Paciente.CLIENTE}</td>
                  <td style="vertical-align: middle;" class="text-left">${Paciente.TIPOEX}</td>
                  <td style="vertical-align: middle;" class="text-left">${Paciente.HADM}</td>
                </tr>
              `);
                    });
                    mensaje(Pacientes[0].ICONO, Pacientes[0].MENSAJE, 1500);

                }
            },
            error: function () {
                $('#error-message').text('Se produjo un error al cargar los pacientes citados.');
            }
        });
    } else {
        mensajecentral('error', 'Debes seleccionar un protocolo');
    }

}

function exportarinforme(iddatatableble) {
    var table = document.getElementById(iddatatableble);
    var rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    var seleccionados = []; // Array para almacenar los elementos checkbox seleccionados

    for (var i = 0; i < rows.length; i++) {
        var checkbox = rows[i].querySelector('input[type="checkbox"]');

        if (checkbox && checkbox.checked) {
            var id = checkbox.value.split('_')[1];
            seleccionados.push(id); // Agregar el id al array de seleccionados
        }
    }

    if (seleccionados.length === 0) {
        mensajecentral('error', 'Debes seleccionar algún registro.');
    } else {
        mostrarDiv('cargaExamnesmodal');
        ocultarDiv('examenesmodal');
        $('#modalFormExamnes').modal('show');
        $.ajax({
            url: '/descargapruebas/' + seleccionados,
            method: "GET",
            success: function (pruebas) {
                ocultarDiv('cargaExamnesmodal');
                mostrarDiv('examenesmodal');
                let examenes = $('#examenesmodal');
                examenes.html('');
                pruebas.forEach(prueba => {
                    examenes.append(`
                    <div class="form-inline col-sm-12 form-group mb-1 mt-1">
                            <div class="input-group-text"
                                style="border-bottom-right-radius: 0px; border-top-right-radius: 0px;background-color: white; width:10%">
                                <input class="form-check-input mt-0" type="checkbox" style="border-radius: 0px;" id="examen${prueba.soexa}" value="${prueba.soexa}_${prueba.ordimp}">
                            </div>
                            <label class="control-label input-group-text" for="examen${prueba.soexa}"
                                style="height: 30px;border-top-left-radius: 0px;border-bottom-left-radius: 0px; width:90%; justify-content: left; align-items: center">${prueba.desexa}</label>
                        </div>
                      `);
                });

            },
            error: function () {
                $('#error-message').text('Se produjo un error al cargar los protocolos.');
            }
        });
    }
}

function cerrarModal() {
    $('#modalFormExamnes').modal('hide');
}

function imprimir(iddiv, iddatatableble) {
    var table = document.getElementById(iddatatableble);
    var rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    var seleccionadoscitas = []; // Array para almacenar los elementos checkbox seleccionados

    for (var i = 0; i < rows.length; i++) {
        var checkbox = rows[i].querySelector('input[type="checkbox"]');

        if (checkbox && checkbox.checked) {
            var id = checkbox.value.split('_')[1];
            seleccionadoscitas.push(id); // Agregar el id al array de seleccionados
        }
    }


    var div = document.getElementById(iddiv);
    var checkboxes = div.querySelectorAll('input[type="checkbox"]');
    var seleccionados = [];

    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            var id = checkboxes[i].value.split('_')[0];
            var orimp = checkboxes[i].value.split('_')[1];
            seleccionados.push({ id: id, orimp: orimp });
        }
    }

    // Ordenar el array por el valor de orimp
    seleccionados.sort(function (a, b) {
        return a.orimp - b.orimp;
    });

    // Extraer solo los ID ordenados
    var idsOrdenados = seleccionados.map(function (item) {
        return item.id;
    });

    console.log(idsOrdenados);
    console.log(seleccionadoscitas);
    var consolidado = document.getElementById("consolidado");
    var detalle = document.getElementById("detalle");
    let tipodescarga;
    if (consolidado.checked === true) {
        tipodescarga = consolidado.value;
    }
    if (detalle.checked === true) {
        tipodescarga = detalle.value;
    }
    $.ajax({
        url: tipodescarga,
        method: 'GET',
        data: {
            examenes: idsOrdenados,
            citas_id: seleccionadoscitas
        },
        xhrFields: {
            responseType: 'blob' // Establece el tipo de respuesta como blob (binary large object)
        },
        success: function (blob) {
            // Crear un enlace temporal y simular un clic para descargar el archivo ZIP
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'Informes.zip'; // Cambiado el nombre del archivo a ZIP
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        error: function () {
            $('#error-message').text('Se produjo un error al cargar los protocolos.');
        }
    });

}

document.getElementById("empresamodal").addEventListener("keydown", function (event) {
    if (event.key === 'Enter') {
        var parametro = $('#empresamodal').val();
        mostrarDiv('cargaEmpresa');
        ocultarDiv('tableEmpresamodal');
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
                    <tr class="text-center">
                        <td colspan="3">No hay resultados disponibles</td>
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

            },
            error: function () {
                alert('Error en la solicitud AJAX');
            },
        });
    }
});

function getempresam(razsoc, cli_id) {
    $('#razsoc').val(razsoc);
    $('#cli_id').val(cli_id);
    getprotocolo(cli_id);
    var btncerrar = document.getElementById(`cerrarEmpresaModal`);
    btncerrar.click();
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

function obtenerTerceraColumna(lista, idSeleccionado) {
    let tercerColumnaValor = '';
    lista.forEach(item => {
        if (item.id === idSeleccionado) {
            tercerColumnaValor = item.desexa;
        }
    });
    return tercerColumnaValor;
}