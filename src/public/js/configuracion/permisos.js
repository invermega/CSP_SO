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
    success: function (accesos) {
      ocultarDiv("cargaacc");
      mostrarTabla("mydatatable");
      let tbody = $('tbody');

      tbody.html('');
      accesos.forEach(acces => {
        tbody.append(`
            <tr>
              <td class="rolcod ocultar2">${acces.codrol}</td>
              <td class="nomrol">${acces.desrol}</td>
              <td>
                <button class="btn btn-info btn-circle btn-sm" onclick="event.preventDefault();getreglas('${acces.codrol}')"><i class="fas fa-align-justify"></i></button>
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