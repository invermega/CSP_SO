function render() {
  const contentContainer = $('#contenedoropciones');
  const loadingHtml = `
  <div class="jm-loadingpage">
      <lottie-player src="/img/jsonimg/loadingint.json" class="" background="transparent" speed="1"
      style="width: 250px; height: 250px;" loop autoplay></lottie-player>
  </div>
  `;

  const links = $('a.opcionform');
  if (!links.data('eventAssigned')) {
    links.data('eventAssigned', true);

    links.on('click', async (e) => {
      e.preventDefault();

      const url = e.currentTarget.getAttribute('href');
      /*if (window.innerWidth <= 768) {
        const sidebarToggle = document.getElementById('sidebarToggle');
        sidebarToggle.click();
      }*/

      contentContainer.html(loadingHtml);

      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const response = await $.ajax({
          url: url,
          method: 'GET',
        });
        contentContainer.animate({ opacity: 0 }, 1000, () => {
          contentContainer.html(response);
          contentContainer.animate({ opacity: 1 }, 500);
        });
      } catch (error) {
        console.error(error);
        // Mostrar un mensaje de error al usuario si lo deseas
        contentContainer.html(`<div class="container">
                                      <div class="row justify-content-center">
                                          <div class="col-lg-6">
                                              <div class="text-center mt-4">
                                                  <img class="mb-4 img-error" src="/img/404logo.jpg" />
                                                  <p class="lead">
                                                      Esta URL solicitada no se encontró en este servidor.</p>
                                                  <a href="/">
                                                      <i class="fas fa-arrow-left me-1"></i>
                                                      Regresar
                                                  </a>
                                              </div>
                                          </div>
                                      </div>
                                  </div>`);
      }

    });
  }
}

async function rendersub(ruta) {
  console.log(ruta);
  const contentContainer = $('#contenedoropciones');
  const loadingHtml = `
  <div class="jm-loadingpage">
      <lottie-player src="/img/jsonimg/loadingint.json" class="" background="transparent" speed="1"
      style="width: 250px; height: 250px;" loop autoplay></lottie-player>
  </div>
  `;
  /*if (window.innerWidth <= 768) {
    const sidebarToggle = document.getElementById('sidebarToggle');
    sidebarToggle.click();
  }*/
  contentContainer.html(loadingHtml);

  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const response = await $.ajax({
      url: ruta,
      method: 'GET',
    });
    contentContainer.animate({ opacity: 0 }, 1000, () => {
      contentContainer.html(response);
      contentContainer.animate({ opacity: 1 }, 500);
    });
  } catch (error) {
    console.error(error);
    // Mostrar un mensaje de error al usuario si lo deseas
    contentContainer.html(`<div class="container">
                                      <div class="row justify-content-center">
                                          <div class="col-lg-6">
                                              <div class="text-center mt-4">
                                                  <img class="mb-4 img-error" src="/img/404logo.jpg" />
                                                  <p class="lead">
                                                      Esta URL solicitada no se encontró en este servidor.</p>
                                                  <a href="/">
                                                      <i class="fas fa-arrow-left me-1"></i>
                                                      Regresar
                                                  </a>
                                              </div>
                                          </div>
                                      </div>
                                  </div>`);
  }
}

function navegaredit(iddatatableble, rutaparcial) {
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
    rendersub(nuevaRuta);
  }
}





window.addEventListener('DOMContentLoaded', event => {
  // Toggle the side navigation
  const sidebarToggle = document.body.querySelector('#sidebarToggle');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', event => {
      event.preventDefault();
      document.body.classList.toggle('sb-sidenav-toggled');
      localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
    });
  }
});

function filtrosMostrarOcultar(btnId, divId) {
  let isVisible = false;

  document.getElementById(btnId).addEventListener("click", function () {
    // Si está oculto, lo mostramos; si está visible, lo ocultamos
    if (isVisible) {
      ocultarDiv(divId);
    } else {
      mostrarDiv(divId);
    }
    // Cambiamos el estado de visibilidad
    isVisible = !isVisible;
  });
}



function mensaje(icono, titulo, duracion) {
  const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: duracion,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  Toast.fire({
    icon: icono,
    title: titulo
  })
}

function mensajecentral(icono, titulo) {
  Swal.fire({
    icon: icono,
    title: titulo,
    showConfirmButton: true,
    timer: null,
    timerProgressBar: false,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
    confirmButtonText: 'OK'
  });
}

function mensajecentral2(icono, titulo, mensaje) {
  Swal.fire({
    icon: icono,
    title: titulo,
    text: mensaje,
    showConfirmButton: true,
    timer: null,
    timerProgressBar: false,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
    confirmButtonText: 'OK'
  });
}

function MensajeSIyNO(icono, titulo, mensaje, callback) {
  Swal.fire({
    icon: icono,
    title: titulo,
    text: mensaje,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí',
    cancelButtonText: 'No'
  }).then((result) => {
    if (result.isConfirmed) {
      // Acción cuando el usuario hace clic en "Sí"
      callback(true);
    } else {
      // Acción cuando el usuario hace clic en "No"
      callback(false);
    }
  });
}

function fechahoy(idfecha) {
  var date = new Date();

  var year = date.getFullYear();
  var month = String(date.getMonth() + 1).padStart(2, '0');
  var day = String(date.getDate()).padStart(2, '0');

  var fechaActual = `${year}-${month}-${day}`;
  document.getElementById(idfecha).setAttribute('max', fechaActual);
  document.getElementById(idfecha).value = fechaActual;
}

function Maxdatemeses(id) {
  var input = document.getElementById(id);

  // Establece el atributo "max" para limitar la fecha máxima a la actual
  var today = new Date();
  var month = today.getMonth() + 1; // +1 ya que los meses comienzan en 0
  var year = today.getFullYear();
  var maxDate = year + '-' + month.toString().padStart(2, '0');
  input.setAttribute('max', maxDate);

  // Establece el valor predeterminado como el mes actual
  var defaultValue = today.toISOString().slice(0, 7); // Obtiene el año y mes en formato ISO (AAAA-MM)
  input.setAttribute('value', defaultValue);
}

function converirselectaño(id) {
  var yearSelect = document.getElementById(id);

  var selectOptions = '';
  var currentYear = new Date().getFullYear();
  for (var year = 2019; year <= currentYear; year++) {
    selectOptions += '<option value="' + year + '">' + year + '</option>';
  }

  yearSelect.innerHTML = selectOptions;
  yearSelect.value = currentYear;
}



function paginaciontabla(idtabla, columna, orden) {
  var table = $(idtabla).DataTable({
    "dom": 'B<"float-left"i><"float-right"f>t<"float-left"l><"float-right"p><"clearfix">',
    "responsive": false,
    "language": {
      "sProcessing": "Procesando...",
      "sLengthMenu": "Mostrar _MENU_ registros",
      "sZeroRecords": "No se encontraron resultados",
      "sEmptyTable": "Ningún dato disponible en esta tabla",
      "sInfo": "Registros del _START_ al _END_ de _TOTAL_ registros",
      "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
      "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
      "sInfoPostFix": "",
      "sSearch": "Buscar:",
      "sUrl": "",
      "sInfoThousands": ",",
      "sLoadingRecords": "Cargando...",
      "oPaginate": {
        "sFirst": "Primero",
        "sLast": "Último",
        "sNext": "Siguiente",
        "sPrevious": "Anterior"
      },

      "oAria": {
        "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
      }
    },
    "order": [[columna, orden]],
    "lengthMenu": [10, 25, 50, 100, 200, 500, 1000, 10000],
    "initComplete": function () {
      this.api().columns().every(function () {
        var that = this;


      })
    }
  });
}

function paginaciontablaregistro(idtabla, columna, orden, cantreg) {
  var table = $(idtabla).DataTable({
    "dom": 'B<"float-left"i><"float-right"f>t<"float-left"l><"float-right"p><"clearfix">',
    "responsive": false,
    "language": {
      "sProcessing": "Procesando...",
      "sLengthMenu": "Mostrar _MENU_ registros por página",
      "sZeroRecords": "No se encontraron resultados",
      "sEmptyTable": "Ningún dato disponible en esta tabla",
      "sInfo": "Registros del _START_ al _END_ de _TOTAL_ registros",
      "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
      "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
      "sInfoPostFix": "",
      "sSearch": "Buscar:",
      "sUrl": "",
      "sInfoThousands": ",",
      "sLoadingRecords": "Cargando...",
      "oPaginate": {
        "sFirst": "Primero",
        "sLast": "Último",
        "sNext": "Siguiente",
        "sPrevious": "Anterior"
      },
      "oAria": {
        "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
      }
    },
    "order": [[columna, orden]],
    "lengthMenu": [5, 10, 25, 50, 100, 200, 500, 1000, 10000],
    "pageLength": cantreg,
    "initComplete": function () {
      this.api().columns().every(function () {
        var that = this;


      })
    }
  });
}

function limitarCaracteresNumericos(input, maxLength) {
  input.value = input.value.replace(/\D/g, '').slice(0, maxLength);
}

function LimpiarTabla(IdTabla) {
  var tabla = document.getElementById(IdTabla);
  var rowCount = tabla.rows.length;
  // Iterar sobre las filas de la tabla y eliminarlas
  for (var i = rowCount - 1; i > 0; i--) {
    tabla.deleteRow(i);
  }
}
function limpiartbodyTabla(idtbody) {
  var tbody = document.getElementById(idtbody);
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }
}

function limpiarinputs() {
  var inputs = document.querySelectorAll('.needs-validation input');
  inputs.forEach(function (input) {
    input.value = '';
  });
}

function mostrarTabla(idtabla) {
  var tabla = document.getElementById(idtabla);
  tabla.style.display = "table";
}

function ocultarTabla(idtabla) {
  var tabla = document.getElementById(idtabla);
  tabla.style.display = "none";
}

function mostrarDiv(idDiv) {
  var div = document.getElementById(idDiv);
  div.style.display = "";
}

function ocultarDiv(idDiv) {
  var div = document.getElementById(idDiv);
  div.style.display = "none";
}

function mostraretiqueta(idetiqueta) {
  var etiqueta = document.getElementById(idetiqueta);
  etiqueta.classList.toggle("ocultaretiqueta");
}

function exportarTablaExcel(tablaId, nombreReporte) {
  var datos = obtenerDatosCompletos(tablaId);
  var workbook = XLSX.utils.book_new();
  var hoja = XLSX.utils.json_to_sheet(datos);
  XLSX.utils.book_append_sheet(workbook, hoja, "Tabla");
  var fecha = new Date().toISOString().slice(0, 10);
  var nombreArchivo = nombreReporte + "_" + fecha + ".xlsx";
  XLSX.writeFile(workbook, nombreArchivo);
}

function validarEspacios(inputId) {
  var input = document.getElementById(inputId);
  var value = input.value;

  if (value.indexOf(" ") !== -1) {
    mensaje('error', 'No se permitenespacios', 2000);
    return false;
  }
}

function quitarvalidacionformularios() {
  var forms = document.getElementsByClassName('needs-validation');
  Array.prototype.filter.call(forms, function (form) {
    form.classList.remove('was-validated');
  });
}

function removeData(myPieChart) {
  myPieChart.data.labels.pop();
  myPieChart.data.datasets.forEach((dataset) => {
    dataset.data.pop();
  });
  myPieChart.update();
}

function agregarRequired(idinput) {
  var input = document.getElementById(idinput);
  input.required = true;
}

function quitarRequired(idinput) {
  var input = document.getElementById(idinput);
  input.required = false;
}

function limpiarImput() {
  $('input').val('');
  $('textarea').val('');
}

function validarFormulario(excluirIds) {
  let camposValidos = true;
  let campoFaltante = '';

  $('input, select, textarea').each(function() {
    const id = $(this).attr('id');
    if (excluirIds && excluirIds.includes(id)) {
      return true;
    }

    if (!$(this).val()) {
      camposValidos = false;
      campoFaltante = id;
      $(this).addClass('is-invalid');
    } else {
      $(this).removeClass('is-invalid');
      $(this).addClass('is-valid');
    }
  });

  if (!camposValidos) {
    mensaje('error', 'Por favor, complete todos los campos.', 1800);
    console.log('Campo faltante: ' + campoFaltante);
  }

  return camposValidos;
}




function validarFormulario2(contenedor, incluirIds) {
  let camposValidos = true;
  $(contenedor).find('input, select, textarea').each(function () {
    const id = $(this).attr('id');
    if (incluirIds && incluirIds.includes(id)) {
      $(this).removeClass('is-valid');
      $(this).addClass('is-invalid');
      return true;
    } else {
      if (!$(this).val()) {
        camposValidos = false;
        $(this).addClass('is-valid');
      } else {
        $(this).removeClass('is-valid');
        $(this).addClass('is-invalid');
      }
    }
  });
  if (!camposValidos) {
    mensaje('error', 'Por favor, complete todos los campos.', 1800);
  }
  return camposValidos;
}
function horatime(input) {
  var horaActual = new Date().toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute: '2-digit'
  }); 
  document.getElementById(input).value = horaActual;
}

