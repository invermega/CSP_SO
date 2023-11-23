$(document).ready(function () {
    getmedico();
    render();
    const refresh = document.getElementById('refresh');
    refresh.addEventListener('click', getmedico);
    const search = document.getElementById('search');
    search.addEventListener('click', getmedico);
});

function getmedico() {
    mostrarDiv('carga');
    ocultarTabla('mydatatable');
    let medico = $('#medico').val();
    $.ajax({
      url: '/listarmedicos',
      method: "GET",
      data: {
        medico: medico,
      },
      success: function (medicos) {
        ocultarDiv('carga');
        mostrarTabla('mydatatable');
        let tablebody1 = $('tbody');
        tablebody1.html('');
        if (medicos.length === 0) {
          tablebody1.append(`
              <tr>
                <td colspan="6">No hay médico con los datos proporcinado</td>
              </tr>
            `);
        } else {
            medicos.forEach(medico => {
                tablebody1.append(`
                <tr data-id="${medico.med_id}">
                <td class="align-middle"><input id="check_${medico.med_id}" value="id_${medico.med_id}" type="checkbox" class="mt-1" ></td>
                <td style="vertical-align: middle;" class="text-left">${medico.medapmn}</td>
                <td style="vertical-align: middle;" class="text-left">${medico.nundoc}</td>
                <td style="vertical-align: middle;" class="text-left">${medico.esp_id}</td>
              </tr>
      `);
            });
          mensaje(medicos[0].icono, medicos[0].mensaje, 1500);
        }
      },
      error: function () {
        $('#error-message').text('Se produjo un error al cargar los medicos.');
      }
    });
  }

