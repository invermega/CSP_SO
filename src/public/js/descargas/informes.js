$(document).ready(function () {
    fechahoy('fechainicio');
    fechahoy('fechafin');
    getExamen();

});

function getPacientesCitados() {
    mostrarDiv('carga');
    ocultarTabla('mydatatable');
    let fechainicio = $('#fechainicio').val();
    let fechafin = $('#fechafin').val();
    let paciente = $('#paciente').val();
    let estado = $('#estado').val();
    let examen = $('#examen').val();
    $.ajax({
        url: '/pacientescitadoslist',
        method: "GET",
        data: {
            fechainicio: fechainicio,
            fechafin: fechafin,
            paciente: paciente,
            estado: estado,
            examen: examen
        },
        success: function (Pacientes) {
            ocultarDiv('carga');
            mostrarTabla('mydatatable');
            let tablebody = $('tbody');
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
}

function getExamen() {
    $.ajax({
        url: '/cmbexamen',
        method: "GET",
        success: function (Examenes) {
            let combo = $('#examen');
            combo.html('');
            combo.append(`<option value="%">Todos</option>`);
            Examenes.forEach(Examen => {
                combo.append(`<option value="${Examen.desexa}">${Examen.desexa}</option>
      `);
            });
            getPacientesCitados()
        },
        error: function (Examenes) {
            alert('error');
        }
    });
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
    } else if (seleccionados.length > 1) {
        mensajecentral('error', 'Debes seleccionar solo un registro.');
    } else {
        mostrarDiv('cargaExamnesmodal');
        ocultarDiv('examenesmodal');
        $('#modalFormExamnes').modal('show');
        $.ajax({
            url: '/arbolpruebas/' + seleccionados,
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

function imprimir(iddiv) {
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
    $.ajax({
        url: 'exportarinforme',
        method: "GET",
        data: {
            examenes: idsOrdenados,
        },
        xhrFields: {
            responseType: 'blob' // Establece el tipo de respuesta como blob (binary large object)
        },
        success: function (blob) {
            // Crear un enlace temporal y simular un clic para descargar el archivo
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'combined_output.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        error: function () {
            $('#error-message').text('Se produjo un error al cargar los protocolos.');
        }
    });
}