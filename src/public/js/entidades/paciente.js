$(document).ready(function () {
    render();
    const refresh = document.getElementById('refresh');
    refresh.addEventListener('click', getpaciente);
    const search = document.getElementById('search');
    search.addEventListener('click', getpaciente);
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            getpaciente();
        }
    });
});

function getpaciente() {    
    ocultarDiv('mydatatable');
    mostrarDiv('carga');     
    let parametro = 0;
    let paciente = document.getElementById('paciente').value;
    $.ajax({
        url: '/listarpacientes',
        method: 'GET',
        data: {            
            parametro: parametro,
            parametro1 : paciente,
        },
        success: function (pacientes) {
            ocultarDiv('carga');
            mostrarDiv('mydatatable');
            const tbody = $('#bodyPaciente');
            tbody.empty();

            if (pacientes.length === 0) {
                tbody.append(`
                    <tr>
                        <td colspan="7" class="text-center">No hay resultados disponibles </td>
                    </tr>
                `);
            } else {
                pacientes.forEach(paciente => {
                    tbody.append(`
                        <tr data-id="${paciente.pachis}">
                        <td class="align-middle"><input id="check_${paciente.pachis}" value="id_${paciente.pachis}" type="checkbox" class="mt-1" ></td>
                        <td>${paciente.appm_nom}</td>
                        <td>${paciente.numdoc}</td> 
                        <td>${paciente.celular}</td>
                        <td>${paciente.correo}</td>
                        <td>${paciente.nacionalidad}</td>
                        <td>${paciente.fecnac}</td>
                        
                        </tr>
                    `);
                });
                mensaje(pacientes[0].tipo, pacientes[0].response, 1500);
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
            var pachis = checkbox.value.split('_')[1];
            seleccionados.push({ pachis: pachis });
        }
    }
    if (seleccionados.length === 0) {
        mensajecentral('error', 'Debes seleccionar algún registro.');
    } else {
        MensajeSIyNO('warning', '', '¿Está seguro de eliminar los pacientes seleccionadas?', function (respuesta) {
            console.log(seleccionados);
            if (respuesta) {
                fetch('/deletePac', {
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
                                var pachis = seleccionados[i].pachis;
                                var fila = table.querySelector('tr[data-id="' + pachis + '"]');
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

