$(document).ready(function () {
    getProtocolo();
    render();
    const refresh = document.getElementById('refresh');
    refresh.addEventListener('click', getProtocolo);
    const search = document.getElementById('search');
    search.addEventListener('click', getProtocolo);
});

function getProtocolo() {
    mostrarDiv('carga');
    ocultarTabla('mydatatable');
    let protocolo = $('#protocolo').val();
    $.ajax({
        url: '/protocololist',
        method: "GET",
        data: {
            protocolo: protocolo,
        },
        success: function (Protocolos) {
            ocultarDiv('carga');
            mostrarTabla('mydatatable');
            let tablebody = $('tbody');
            tablebody.html('');
            if (Protocolos.length === 0) {
                tablebody.append(`
            <tr>
              <td colspan="3">No hay protocolo con la descripción proporcionada</td>
            </tr>
          `);
            } else {
                Protocolos.forEach(Protocolo => {
                    tablebody.append(`
              <tr>
                <td class="align-middle"><input id="check_${Protocolo.codpro_id}" type="checkbox" class="mt-1" ></td>
                <td style="vertical-align: middle;" class="text-left">${Protocolo.nompro}</td>
                <td style="vertical-align: middle;" class="text-left asignado">${Protocolo.razsoc}</td>
                <td style="vertical-align: middle;" class="text-left asignado">${Protocolo.desexa}</td>
                <td style="vertical-align: middle;" class="text-left asignado">${Protocolo.estado}</td>
              </tr>
            `);
                });
                mensaje(Protocolos[0].icono, Protocolos[0].mensaje, 1500);
            }
        },
        error: function () {
            $('#error-message').text('Se produjo un error al cargar los protocolos.');
        }
    });
}




