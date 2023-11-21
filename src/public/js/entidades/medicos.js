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
/*
function navegargetid(iddatatableble, tipo) {
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
    obtenerDatosCabeceramed(`${seleccionados[0]}`);
    obtenerDatosDetalle(`${seleccionados[0]}`);
  }
}*/
/*
function obtenerDatosCabeceramed(idmed) {
  return new Promise(function (resolve, reject) {
      var cabeceraData;
      $.ajax({
          url: '/listarmedico',
          method: 'GET',
          data: {
            idmed: idmed,
          },
          success: function (lista) {
              cabeceraData.medap = lista[0].medap;
              cabeceraData.medam = lista[0].medam;
              cabeceraData.mednam = lista[0].mednam;
              cabeceraData.docide = lista[0].docide;
              cabeceraData.nundoc = lista[0].nundoc;
              cabeceraData.med_cmp = lista[0].med_cmp;
              cabeceraData.med_rne = lista[0].med_rne;
              cabeceraData.medTelfij = lista[0].medTelfij;
              cabeceraData.medcel = lista[0].medcel;
              cabeceraData.med_correo = lista[0].med_correo;
              cabeceraData.meddir = lista[0].meddir;
              cabeceraData.esp_id = lista[0].esp_id;              
              resolve(cabeceraData);
          },
          error: function (error) {
              // Manejo de errores aquí, si es necesario
              // Rechaza la promesa en caso de error
              reject(error);
          }
      });
  });
}

*/