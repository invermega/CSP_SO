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
              <tr>
              <td style="vertical-align: middle;" class="text-left">${Paciente.FECHADECITA}</td>
              <td style="vertical-align: middle;" class="text-left">${Paciente.PACIENTE}</td>
                <td style="vertical-align: middle;" class="text-left">${Paciente.EDAD}</td>
                <td style="vertical-align: middle;" class="text-left">${Paciente.CLIENTE}</td>
                <td style="vertical-align: middle;" class="text-left">${Paciente.TIPOEX}</td>
                <td style="vertical-align: middle;" class="text-left">${Paciente.HADM}</td>
                <td class="text-center"><a style="color:white;background-color: cornflowerblue;" type="submit" href="${Paciente.RUTA}"  class="btn btn-circle btn-sm btn" target="_blank"><i class="fa-solid fa-file-lines"></i></a></td>
                <td><button style="color:white;background-color: cornflowerblue;" class="btn btn-circle btn-sm btn"><i class="fa-solid fa-ellipsis-vertical"></i></button></td>               
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




