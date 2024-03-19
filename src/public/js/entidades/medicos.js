$(document).ready(function () {
    render();
    const refresh = document.getElementById('refresh');
    refresh.addEventListener('click', getmedico);
    const search = document.getElementById('search');
    search.addEventListener('click', getmedico);
    const medicoInput = document.getElementById('medico');
    medicoInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            getmedico();
        }
    });
    getmedico();
});

function getmedico() {    
    ocultarDiv('mydatatable');
    mostrarDiv('carga');     
    let parametro = 0;
    let parametro1 = document.getElementById('medico').value;
    $.ajax({
        url: '/listarmedicos',
        method: 'GET',
        data: {            
            parametro: parametro,
            parametro1 : parametro1,
        },
        success: function (medicos) {
            ocultarDiv('carga');
            mostrarDiv('mydatatable');
            const tbody = $('#bodyMedico');
            tbody.empty();

            if (medicos.length === 0) {
                tbody.append(`
                    <tr>
                        <td colspan="7" class="text-center">No hay resultados disponibles </td>
                    </tr>
                `);
            } else {
                medicos.forEach(medico => {
                    tbody.append(`
                        <tr data-id="${medico.med_id}">
                            <td class="align-middle"><input id="check_${medico.med_id}" value="id_${medico.med_id}" type="checkbox" class="mt-1" ></td>
                            <td>${medico.medapmn}</td>
                            <td>${medico.nundoc}</td> 
                            <td>${medico.med_cmp}</td>
                            <td>${medico.medcel}</td>
                            <td>${medico.med_correo}</td>
                            <td>${medico.des_esp}</td>                        
                        </tr>
                    `);
                });
                mensaje(medicos[0].tipo, medicos[0].mensaje, 1500);
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
            var med_id = checkbox.value.split('_')[1];
            seleccionados.push({ med_id: med_id });
        }
    }
    if (seleccionados.length === 0) {
        mensajecentral('error', 'Debes seleccionar algún registro.');
    } else {
        MensajeSIyNO('warning', '', '¿Está seguro de eliminar los médicos seleccionadas?', function (respuesta) {
            if (respuesta) {
                fetch('/deleteMed', {
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
                                var med_id = seleccionados[i].med_id;
                                var fila = table.querySelector('tr[data-id="' + med_id + '"]');
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

