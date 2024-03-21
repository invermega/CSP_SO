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
              <td colspan="6">No hay protocolo con la descripción proporcionada</td>
            </tr>
          `);
      } else {
        Protocolos.forEach(Protocolo => {
          let colorestado = '';
          if (Protocolo.estado === 'VIGENTE') {
            colorestado = '#2FC458'
          } else if (Protocolo.estado === 'HISTÓRICO') {
            colorestado = '#8A8688'
          } else if (Protocolo.estado === 'COTIZACIÓN') {
            colorestado = '#FF9E0D'
          } else if (Protocolo.estado === 'ANULADO') {
            colorestado = '#FF1111'
          }
          tablebody.append(`
              <tr data-id="${Protocolo.codpro_id}">
                <td class="align-middle"><input id="check_${Protocolo.codpro_id}" value="id_${Protocolo.codpro_id}" type="checkbox" class="mt-1" ></td>
                <td style="vertical-align: middle;" class="text-left">${Protocolo.nompro}</td>
                <td style="vertical-align: middle;" class="text-left">${Protocolo.razsoc}</td>
                <td style="vertical-align: middle;" class="text-left">${Protocolo.cliente}</td>
                <td style="vertical-align: middle;" class="text-left">${Protocolo.desexa}</td>
                <td style="vertical-align: middle;" class="text-center estado"><span class="badge estado" style="background-color:${colorestado}; color:white; font-size:90%" >${Protocolo.estado}</span></td>
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
      var codpro_id = checkbox.value.split('_')[1];
      seleccionados.push({ codpro_id: codpro_id });
    }
  }
  if (seleccionados.length === 0) {
    mensajecentral('error', 'Debes seleccionar algún registro.');
  } else {
    MensajeSIyNO('warning', '', '¿Está seguro de eliminar los protoclos seleccionados?', function (respuesta) {
      if (respuesta) {
        fetch('/protocolodel', {
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
                var codpro_id = seleccionados[i].codpro_id;
                var celda = table.querySelector('tr[data-id="' + codpro_id + '"] .estado');
                if (celda) {
                  celda.innerHTML = '<span class="badge estado" style="background-color:#FF1111; color:white; font-size:90%" >ANULADO</span>';
                }
              }
            }
            mensaje(data[0].icono, data[0].mensaje, 1500);
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
    });
  }
}

function exportarprotocolo(iddatatableble, rutaparcial) {
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
    var nuevaRuta = `/${rutaparcial}/${seleccionados[0]}`;
    $.ajax({
      url: nuevaRuta,
      method: "GET",
      success: function () {
        window.location.href = nuevaRuta;
      },
      error: function () { // Corregido: eliminé el parámetro "lista" innecesario
        alert('error');
      }
    });
  }
}

document.getElementById("empresamodal").addEventListener("keydown", function (event) {
  if (event.key === 'Enter') {
    buscarEmpresa();
  }
});
function buscarEmpresa() {
  mostrarDiv('cargaempmodal');
  ocultarDiv('tablaempmodal');
  let empresamodal = $('#empresamodal').val();
  event.preventDefault();
  $.ajax({
    url: '/empresas',
    method: "GET",
    data: {
      empresa: empresamodal,
    },
    success: function (lista) {
      ocultarDiv('cargaempmodal');
      mostrarDiv('tablaempmodal');
      let bodyempleadomodal = $('#bodyempmodal');
      bodyempleadomodal.html('');
      if (lista.length === 0) {
        bodyempleadomodal.append(`
          <tr>
            <td colspan="3">No hay empresas con el nombre proporcionado</td>
          </tr>
        `);
      } else {

        lista.forEach(list => {
          bodyempleadomodal.append(`
            <tr>
              <td class="align-middle"><button class="btn btn-info btn-circle btn-sm" onclick="AgregarEmpresa(this)"><i class="fa-solid fa-plus"></i></button></td>
              <td style="vertical-align: middle;" class="text-left">${list.cli_id}</td>
              <td style="vertical-align: middle;" class="text-left asignado">${list.razsoc}</td>
            </tr>
          `);
        });
        mensaje(lista[0].icono, lista[0].mensaje, 1500);
      }
    },
    error: function () { // Corregido: eliminé el parámetro "lista" innecesario
      alert('error');
    }
  });
}

function AgregarEmpresa(btn) {
  event.preventDefault();
  var filaorigen = $(btn).closest("tr");
  var cli_id = filaorigen.find("td:eq(1)").text();
  var razsoc = filaorigen.find("td:eq(2)").text();

  $('#cli_id').val(cli_id);
  $('#razsoc').val(razsoc);
  var btncerrar = document.getElementById(`cerrarempresa`);
  btncerrar.click();
  event.preventDefault();
}






