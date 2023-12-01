$(document).ready(function () {
  render();
  getmedico();
  const refresh = document.getElementById('refresh');
  refresh.addEventListener('click', getmedico);
  const search = document.getElementById('search');
  search.addEventListener('click', getmedico);
});

function getmedico() {
  mostrarDiv('carga');
  ocultarTabla('mydatatable');
  let parametro = $('#medico');
  let opc=0;

  $.ajax({
    url: '/listarmedicos',
    method: "GET",
    data: {
      parametro: parametro.val(),
      opc:opc
    },
    success: function (medicos) {
      console.log(medicos);
      ocultarDiv('carga');
      mostrarTabla('mydatatable');
      const tablebodymed = $('#bodymedicos');
      tablebodymed.empty();
      if (medicos.length === 0) {
        tablebodymed.append(`
              <tr>
                <td colspan="6">No hay médico con los datos proporcinado</td>
              </tr>
            `);
      } else {
        medicos.forEach(medico => {
          tablebodymed.append(`
                <tr data-id="${medico.med_id}">
                <td class="align-middle"><input id="check_${medico.med_id}" value="id_${medico.med_id}" type="checkbox" class="mt-1" ></td>
                <td style="vertical-align: middle;" class="text-left">${medico.medapmn}</td>
                <td style="vertical-align: middle;" class="text-left">${medico.nundoc}</td>
                <td style="vertical-align: middle;" class="text-left">${medico.des_esp}</td>
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

function navegarmededit(iddatatableble, rutaparcial) {
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
  } 
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
      MensajeSIyNO('warning','', '¿Está seguro de eliminar los medicos seleccionados?', function (respuesta) {
          if (respuesta) {
              fetch('/medicosdel', {
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
                              var medId = seleccionados[i].med_id;
                              var fila = table.querySelector('tr[data-id="' + medId + '"]');
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