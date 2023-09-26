$(document).ready(function () {
  getpermisos();
});

function guardarrol() {
  let newrol = $('#newrol');
  $.ajax({
    url: '/grupousuario',
    method: "POST",
    data: {
      nomrol: newrol.val()
    },
    success: function (lista) {
      mensaje('success', 'Guardado correctamente', 1000);
      getpermisos();
      $('input[type="text"]').val("");
      var btncerrar = document.getElementById('cerrar');
      btncerrar.click();
    },
    error: function () {
      alert('error');
    }
  });
}

function getpermisos() {
  ocultarTabla("mydatatable");
  mostrarDiv("cargaacc");

  $.ajax({
    url: '/listaroles',
    success: function (roles) {
      ocultarDiv("cargaacc");
      mostrarTabla("mydatatable");
      let tbody = $('tbody');

      tbody.html('');
      roles.forEach(rol => {
        tbody.append(`
            <tr>
              <td class="rolcod">${rol.codrol}</td>
              <td class="nomrol">${rol.desrol}</td>
              <td>
                <button class="btn btn-info btn-circle btn-sm" onclick="event.preventDefault();getaccesos('${rol.codrol}')"><i class="fas fa-align-justify"></i></button>
              </td>
            </tr>
            `)
      });
    },
    error: function () { // Corregido: eliminé el parámetro "lista" innecesario
      alert('error');
    }
  });
}

function getaccesos(codrol) {
  mostrarDiv('carga');
  ocultarDiv('tablagrupousuario');
  $.ajax({
    url: '/accesos',
    method: 'GET',
    data: {
      codrol: codrol,
    },
    success: function (accesos) {
      ocultarDiv('carga');
      mostrarDiv('tablagrupousuario');
      const tbodygrupousu = $('#tbodygrupousu');
      tbodygrupousu.empty(); // Limpia el contenido anterior en lugar de usar tbodygrupousu.html('')
      accesos.forEach(acceso => {
        const valor1 = acceso.acceso === 'S' ? 'checked' : '';
        const valor2 = acceso.lectura === 'S' ? 'checked' : '';
        const valor3 = acceso.escritura === 'S' ? 'checked' : '';
        tbodygrupousu.append(`
          <tr>        
            <td>${acceso.desmod}</td>      
            <td>${acceso.opcsis}</td>
            <td>${acceso.desopc}</td>
            <td><input id="acceso${acceso.opcsis}" type="checkbox" class="mt-1" value="${acceso.opcsis}_${codrol}" ${valor1}></td>
            <td><input id="lectura${acceso.opcsis}" type="checkbox" class="mt-1" value="${acceso.opcsis}_${codrol}" ${valor2}></td>
            <td><input id="escritura${acceso.opcsis}" type="checkbox" class="mt-1" value="${acceso.opcsis}_${codrol}" ${valor3}></td>
          </tr>
        `);
      });

      mensaje('success', 'Accesos extraídos correctamente', 1000);
    },
    error: function () {
      alert('Error en la solicitud AJAX');
    },
  });
}

function guardar() {
  var table = document.getElementById('mydatatable1');
  var rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
  var data = [];
  for (var i = 0; i < rows.length; i++) {
    var checkbox = rows[i].getElementsByTagName('input')[0];
    var checkbox1 = rows[i].getElementsByTagName('input')[1];
    var checkbox2 = rows[i].getElementsByTagName('input')[2];
    if (checkbox.checked) {
      var value = checkbox.value;
      var valuesArray = value.split('_');
      var opcsis = valuesArray[0];
      var codrol = valuesArray[1];
      var lectura = "";
      var escritura = "";
      if (checkbox1.checked) {
        lectura = "S"
      }
      else {
        lectura = "N"
      }
      if (checkbox2.checked) {
        escritura = "S"
      }
      else {
        escritura = "N"
      }
      var rowData = {
        opcsis: opcsis,
        codrol: codrol,
        estado: "S",
        lectura: lectura,
        escritura: escritura
      };
      data.push(rowData);
    }
  }

  console.log('Datos capturados:', data);

  $.ajax({
    url: '/accesos',
    method: "POST",
    contentType: "application/json", // Agregar el encabezado para indicar que los datos son JSON
    data: JSON.stringify({ data: data }), // Convertir el arreglo a JSON antes de enviarlo
    success: function (lista) {
      getaccesos(data[0].codrol);
      mensaje('success', 'Guardado correctamente', 1000);
    },
    error: function () {
      alert('error');
    }
  });
}
