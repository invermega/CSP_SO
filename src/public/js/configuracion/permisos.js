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
            <td><input onclick="activarCheckbox('${acceso.opcsis}')" id="acceso${acceso.opcsis}" type="checkbox" class="mt-1" value="${acceso.opcsis}_${codrol}" ${valor1}></td>
            <td><input id="lectura${acceso.opcsis}" type="checkbox" class="mt-1" value="${acceso.opcsis}_${codrol}" ${valor2}></td>
            <td><input id="escritura${acceso.opcsis}" type="checkbox" class="mt-1" value="${acceso.opcsis}_${codrol}" ${valor3}></td>
          </tr>
        `);
        activarCheckbox(acceso.opcsis);
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
  var datains = [];
  var datadel = [];
  for (var i = 0; i < rows.length; i++) {
    var checkboxes = rows[i].getElementsByTagName('input');
    var value = checkboxes[0].value;
    var opcsis = value.split('_')[0];
    var codrol = value.split('_')[1];
    var lectura = checkboxes[1].checked ? 'S' : 'N';
    var escritura = checkboxes[2].checked ? 'S' : 'N';
    var rowData = {
      opcsis: opcsis,
      codrol: codrol,
      estado: 'S',
      lectura: lectura,
      escritura: escritura
    };
    var rowDatadelete = {
      opcsis: opcsis,
      codrol: codrol
    };
    if (checkboxes[0].checked) {
      datains.push(rowData);
    } else {
      datadel.push(rowDatadelete);
    }
  }
  $.ajax({
    url: '/accesos',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ datains: datains }),
    success: function (lista) {
    },
    error: function () {
      alert('error');
    }
  });
  $.ajax({
    url: '/accesos',
    method: 'DELETE',
    contentType: 'application/json',
    data: JSON.stringify({ datadel: datadel }),
    success: function (lista) {
      mensaje('success', 'Guardado correctamente', 1000);
    },
    error: function () {
    }
  });
}

function activarCheckbox(opcsis) {
  var checkboxPrincipal = document.getElementById("acceso" + opcsis);
  var checkboxlectura = document.getElementById("lectura" + opcsis);
  var checkboxescritura = document.getElementById("escritura" + opcsis);
  if (checkboxPrincipal.checked) {
    checkboxlectura.disabled = false;
    checkboxescritura.disabled = false;
  } else {
    checkboxlectura.disabled = true;
    checkboxescritura.disabled = true;
    checkboxlectura.checked = false;
    checkboxescritura.checked = false;
  }
}
