$(document).ready(function () {
    getpermisos();
});

function getpermisos() {
    ocultarTabla("mydatatable");
    mostrarDiv("cargaacc");

    $.ajax({
        url: '/listaroles',
        success: function (roles) {
            ocultarDiv("cargaacc");
            mostrarTabla("mydatatable");
            let tbody = $('tbody');
            console.log(roles);
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
