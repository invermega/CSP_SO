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
      let tablehead = $('thead');
      tablehead.html('');
      let tablebody = $('tbody');
      tablebody.html('');
      if (Pacientes.length === 0) {
        tablehead.append(`
            <tr>
              <th>PACIENTES CITADOS</th>
            </tr>
          `);
        tablebody.append(`
            <tr>
              <td>No hay pacientes citados.</td>
            </tr>
          `);
      } else {
        // Construir el thead excluyendo la columna de ID
        tablehead.append('<tr>');
        for (let key in Pacientes[0]) {
          if (Pacientes[0].hasOwnProperty(key) && key !== 'ID' && key !== 'ICONO' && key !== 'MENSAJE') {
            tablehead.append(`<th>${key}</th>`);
          }
        }
        tablehead.append('</tr>');

        // Construir el tbody con los datos de los pacientes excluyendo la columna de ID
        Pacientes.forEach(Paciente => {
          tablebody.append('<tr>');
          let shouldConcatenate = false;
          for (let key in Paciente) {
            if (Paciente.hasOwnProperty(key) && key !== 'ID' && key !== 'ICONO' && key !== 'MENSAJE') {
              if (key === 'H. ADM') {
                shouldConcatenate = true;
                tablebody.append(`<td>${Paciente[key]}</td>`);
              } else if (shouldConcatenate && Paciente[key]) {
                console.log(`${Paciente[key]}/${Paciente.ID}`);
                tablebody.append(`<td class="text-center"><a style="color:white;background-color: cornflowerblue;" type="submit" href="${Paciente[key]}/${Paciente.ID}"  class="btn btn-circle btn-sm btn" target="_blank"><i class="fa-solid fa-file-lines"></i></a></td>`);
              } else {
                tablebody.append(`<td>${Paciente[key]}</td>`);
              }
            }
          }
          tablebody.append('</tr>');
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




