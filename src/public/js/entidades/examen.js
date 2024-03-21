$(document).ready(function () {
    getexamenes();
    const refresh = document.getElementById('refresh');
    refresh.addEventListener('click', getexamenes);
    const search = document.getElementById('search');
    search.addEventListener('click', getexamenes);

    render();
});
function getexamenes() {
    ocultarDiv('mydatatable');
    mostrarDiv('carga');
    let examen = document.getElementById('examen').value;
    let soexa = '0';
    $.ajax({
        url: '/listarexamenes',
        method: 'GET',
        data: {
            busqueda: examen,
            soexa: soexa,
        },
        success: function (citas) {
            ocultarDiv('carga');
            mostrarDiv('mydatatable');
            const tbody = $('#bodyExamen');
            tbody.empty();

            if (citas[0].tipo === "error") {
                tbody.append(`
                    <tr>
                        <td colspan="7" class="text-center">No hay resultados disponibles </td>
                    </tr>
                `);
                mensaje(citas[0].tipo, citas[0].mensaje, 1500);
            } else {
                citas.forEach(cita => {
                    const checkboxStarep = cita.starep === 'S' ? '<i class="fa-solid fa-circle-check text-success"></i>' : '<i class="fa-solid fa-circle-xmark text-danger"></i>';
                    const checkboxStaaddfile = cita.staaddfile === 'S' ? '<i class="fa-solid fa-circle-check text-success"></i>' : (cita.staaddfile === 'N' ? '<i class="fa-solid fa-circle-xmark text-danger"></i>' : cita.staaddfile);
                    const checkboxreg_cie10 = cita.reg_cie10 === 'S' ? '<i class="fa-solid fa-circle-check text-success"></i>' : (cita.reg_cie10 === 'N' ? '<i class="fa-solid fa-circle-xmark text-danger"></i>' : cita.reg_cie10);
                    tbody.append(`
                        <tr data-id="${cita.soexa}">
                            <td class="align-middle"><input id="check_${cita.soexa}" value="id_${cita.soexa}" type="checkbox" class="mt-1" ></td>
                            <td>${cita.desexa}</td>
                            <td>${cita.ordimp}</td> 
                            <td>${cita.ordprot}</td>
                            <td>${checkboxStarep}</td>
                            <td>${checkboxStaaddfile}</td>
                            <td>${checkboxreg_cie10}</td>
                        </tr>
                    `);
                });
                mensaje(citas[0].tipo, citas[0].mensaje, 1500);
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
            var soexa = checkbox.value.split('_')[1];
            seleccionados.push({ soexa: soexa });
        }
    }
    if (seleccionados.length === 0) {
        mensajecentral('error', 'Debes seleccionar algún registro.');
    } else {
        MensajeSIyNO('warning', '', '¿Está seguro de eliminar los registros seleccionadas?', function (respuesta) {
            if (respuesta) {
                fetch('/deleteExamenes', {
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
                                var soexa = seleccionados[i].soexa;
                                var fila = table.querySelector('tr[data-id="' + soexa + '"]');
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