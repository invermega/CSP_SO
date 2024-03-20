$(document).ready(function () {
    render();
    getequipos();
    const refresh = document.getElementById('recargar');
    refresh.addEventListener('click', getequipos);
    const search = document.getElementById('buscar');
    search.addEventListener('click', getequipos);
});

document.getElementById("equipos").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        getequipos();
    }
});

function getequipos() {
    mostrarDiv('carga');
    ocultarTabla('mydatatable');
    let equipos = $('#equipos');
    let opc = 1;
    $.ajax({
        url: '/listarequipos',
        method: "GET",
        data: {
            equipos: equipos.val(),
            opc: opc
        },
        success: function (equiposs) {
            ocultarDiv('carga');
            mostrarTabla('mydatatable');
            const tabody = $('#bodyequipos');
            tabody.empty();
            if (equiposs.length === 0) {
                tabody.append(`
                <tr>
                <td colspan="6">No hay equipos con la descripción proporcionada</td>
                </tr>`);
            } else {
                equiposs.forEach(equipos => {
                    tabody.append(`              
                    <tr data-id="${equipos.equi_id}">
                        <td class="align-middle"><input id="check_${equipos.equi_id}" value="id_${equipos.equi_id}" type="checkbox" class="mt-1" ></td>
                        <td style="vertical-align: middle;" class="text-left">${equipos.desequi}</td>
                        <td style="vertical-align: middle;" class="text-left">${equipos.marca}</td>
                        <td style="vertical-align: middle;" class="text-left">${equipos.modelo}</td>
                        <td style="vertical-align: middle;" class="text-center">${equipos.feccali}</td>
                        <td style="vertical-align: middle;" class="text-left">${equipos.desexa}</td>
                    </tr>
                                `);
                });
                mensaje(equiposs[0].icono, equiposs[0].mensaje, 1500);
            }
        },
        error: function () {
            $('#error-message').text('Se produjo un error al cargar los equipos')
        }
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
            var equi_id = checkbox.value.split('_')[1];
            seleccionados.push({ equi_id: equi_id });
        }
    }
    if (seleccionados.length === 0) {
        mensajecentral('error', 'Debes seleccionar algún registro.');
    } else {
        MensajeSIyNO('warning', '', '¿Está seguro de eliminar los equipos seleccionados?', function (respuesta) {
            if (respuesta) {
                fetch('/equiposdel', {
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
                                var equiId = seleccionados[i].equi_id;
                                var fila = table.querySelector('tr[data-id="' + equiId + '"]');
                                if (fila) {
                                    fila.remove();
                                }
                            }
                        }
                        mensaje(data[0].icono, data[0].mensaje, 1500);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    })
            }
        })
    }
}