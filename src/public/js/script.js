

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

function sumarcolumatabla(td, id) {
  var data = [];
  $(td).each(function () {
    var valor = parseFloat($(this).text().replace(/[^0-9.-]+/g, "").replace(",", ""));
    data.push(valor);
  });
  var suma = data.reduce(function (a, b) { return a + b; }, 0);
  $(id).html(suma.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","));
}

function diferenciacolumatabla(td, td1, id) {
  var data = [];
  $(td).each(function () {
    var valor = parseFloat($(this).text().replace(/[^0-9.-]+/g, "").replace(",", ""));
    data.push(valor);
  });
  var suma = data.reduce(function (a, b) { return a + b; }, 0);
  var data1 = [];
  $(td1).each(function () {
    var valor1 = parseFloat($(this).text().replace(/[^0-9.-]+/g, "").replace(",", ""));
    data1.push(valor1);
  });
  var suma1 = data1.reduce(function (a, b) { return a + b; }, 0);

  $(id).html((suma - suma1).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","));
}

function promediocolumnatabla(td, td1, id) {
  var data = [];
  $(td).each(function () {
    var valor = parseFloat($(this).text().replace(/[^0-9.-]+/g, "").replace(",", ""));
    data.push(valor);
  });
  var suma = data.reduce(function (a, b) { return a + b; }, 0);

  var data1 = [];
  $(td1).each(function () {
    var valor1 = parseFloat($(this).text().replace(/[^0-9.-]+/g, "").replace(",", ""));
    data1.push(valor1);
  });
  var suma1 = data1.reduce(function (a, b) { return a + b; }, 0);

  $(id).html(((suma / suma1) * 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","));
}


function promediocolumatabla(td, id) {
  var data = [];
  $(td).each(function () {
    data.push(parseFloat($(this).text()));
  });
  var suma = 0;
  for (var x = 0; x < data.length; x++) {
    suma += data[x];
  }
  var promedio = suma / data.length;
  $(id).html(promedio.toFixed(2));
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

function obtenerDatosCompletos(tablaId) {
  var datos = [];
  var tabla = document.getElementById(tablaId);

  // Obtener los datos del thead
  var encabezados = [];
  var encabezadosRow = tabla.tHead.rows[0];
  for (var i = 0; i < encabezadosRow.cells.length; i++) {
    encabezados.push(encabezadosRow.cells[i].textContent);
  }
  datos.push(encabezados);

  // Recorrer todas las filas del tbody
  var filas = tabla.tBodies[0].rows;
  for (var i = 0; i < filas.length; i++) {
    var fila = [];
    var celdas = filas[i].cells;
    for (var j = 0; j < celdas.length; j++) {
      fila.push(celdas[j].textContent);
    }
    datos.push(fila);
  }

  // Obtener los datos del tfoot
  if (tabla.tFoot) {
    var pie = [];
    var pieRow = tabla.tFoot.rows[0];
    for (var i = 0; i < pieRow.cells.length; i++) {
      pie.push(pieRow.cells[i].textContent);
    }
    datos.push(pie);
  }

  return datos;
}

function exportarTablaExcel(tablaId, nombreReporte) {
  // Obtener los datos completos de la tabla
  var datos = obtenerDatosCompletos(tablaId);

  // Crear una instancia de Workbook de xlsx
  var workbook = XLSX.utils.book_new();

  // Crear una hoja de cálculo
  var hoja = XLSX.utils.json_to_sheet(datos);

  // Agregar la hoja de cálculo al libro de trabajo
  XLSX.utils.book_append_sheet(workbook, hoja, "Tabla");

  // Generar un archivo de Excel
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



function imprimirGuia(cabeceraData, detalleData) {
  // Obtener el contenido de la guía
  const contenidoGuia = obtenerContenidoGuia(cabeceraData, detalleData);

  // Abrir una nueva ventana con el tamaño y opciones deseadas
  const opciones = 'width=595,height=842,menubar=no,toolbar=no,location=no,resizable=no,maximize=no';
  const ventanaImpresion = window.open('', '_blank', opciones);

  // Escribir el contenido de la guía en la ventana
  ventanaImpresion.document.write(contenidoGuia);
  ventanaImpresion.document.close();

  // Esperar a que el contenido se cargue completamente antes de imprimir
  ventanaImpresion.onload = function () {
    ventanaImpresion.print();
    ventanaImpresion.close();
  };
}





function obtenerContenidoGuia(cabeceraData, detalleData) {
  // Construir el contenido del contenedor de imagen y título
  var contenedorImagenTitulo = "<div style='display: flex; align-items: center; margin-bottom: 20px;'>";
  contenedorImagenTitulo += "<img src='/img/logo.png' alt='Logo' style='width: 120px; height: 75px;'>";
  contenedorImagenTitulo += "<div style='border-left: 1px solid black; margin-left: 10px; padding-left: 10px;'>";
  contenedorImagenTitulo += "<p style='margin-bottom: 2px; font-size: 60%;'>" + cabeceraData.empresa + "</p>";
  contenedorImagenTitulo += "<p style='margin-bottom: 2px; font-size: 60%;'>" + cabeceraData.direccion + "</p>";
  contenedorImagenTitulo += "<p style='margin-bottom: 2px; font-size: 60%;'>" + cabeceraData.telefono + "</p>";
  contenedorImagenTitulo += "</div>";
  contenedorImagenTitulo += "</div>";

  // Agregar el título centrado
  var tituloCentrado = "<h4 style='text-align: center;'>MOVIMIENTO DE ACTIVO FIJO</h4>";

  // Construir el contenido de la cabecera
  var contenidoCabecera = "<h5 style='font-weight: bold; margin-bottom: 5px; font-size: 12px;'>DATOS DEL MOVIMIENTO</h5>";
  contenidoCabecera += "<div style='display: flex;'>";
  contenidoCabecera += "<div style='flex: 1;'>";
  contenidoCabecera += "<p style='margin-left: 20px; font-size: 10px;'><strong>N° MOVIMIENTO:</strong> " + cabeceraData.comboMovimiento + "-" + cabeceraData.correlativo + "</p>";
  contenidoCabecera += "<p style='margin-left: 20px; font-size: 10px;'><strong>FECHA:</strong> " + cabeceraData.fecha + "</p>";
  contenidoCabecera += "<p style='margin-left: 20px; font-size: 10px;'><strong>T. MOVIMIENTO:</strong> " + cabeceraData.TipoMovimiento + "</p>";
  contenidoCabecera += "<p style='margin-left: 20px; font-size: 10px;'><strong>MOVIMIENTO:</strong> " + cabeceraData.Movimiento + "</p>";
  contenidoCabecera += "<p style='margin-left: 20px; font-size: 10px;'><strong>MOTIVO:</strong> " + cabeceraData.motivo + "</p>";
  contenidoCabecera += "</div>";
  contenidoCabecera += "<div style='flex: 1;'>";
  contenidoCabecera += "<p style='margin-left: 20px; font-size: 10px;'><strong>RESPONSABLE:</strong> " + cabeceraData.responsable + "</p>";
  contenidoCabecera += "<p style='margin-left: 20px; font-size: 10px;'><strong>N° DOCUMENTO:</strong> " + cabeceraData.ndocumento + "</p>";
  contenidoCabecera += "<p style='margin-left: 20px; font-size: 10px;'><strong>EST. DE ORIGEN:</strong> " + cabeceraData.origen + "</p>";
  contenidoCabecera += "<p style='margin-left: 20px; font-size: 10px;'><strong>EST. DE DESTINO:</strong> " + cabeceraData.destino + "</p>";
  contenidoCabecera += "</div>";
  contenidoCabecera += "</div>";

  // Construir el contenido del detalle (tabla)
  var contenidoDetalle = "<h4 style='font-weight: bold; margin-bottom: 5px; font-size: 12px;'>DETALLE DEL MOVIMIENTO</h4>";
  contenidoDetalle += "<div style='border: 1px solid #ccc; padding: 5px;'>";
  contenidoDetalle += "<table style='width: 100%; border-collapse: collapse;'>";
  // Agregar encabezados de columna de la tabla
  contenidoDetalle += "<thead>";
  contenidoDetalle += "<tr style='background-color: #0FA0A7; color: white;'>";
  contenidoDetalle += "<th style='border: 1px solid #ccc; padding: 5px; font-size: 10px;'>CÓDIGO</th>";
  contenidoDetalle += "<th style='border: 1px solid #ccc; padding: 5px; font-size: 10px;'>ACTIVO</th>";
  contenidoDetalle += "<th style='border: 1px solid #ccc; padding: 5px; font-size: 10px;'>MARCA</th>";
  contenidoDetalle += "<th style='border: 1px solid #ccc; padding: 5px; font-size: 10px;'>MODELO</th>";
  contenidoDetalle += "<th style='border: 1px solid #ccc; padding: 5px; font-size: 10px;'>SERIE</th>";
  contenidoDetalle += "<th style='border: 1px solid #ccc; padding: 5px; font-size: 10px;'>UBICACIÓN</th>";
  // ... Agregar más encabezados de columna según corresponda
  contenidoDetalle += "</tr>";
  contenidoDetalle += "</thead>";

  // Agregar filas de datos de la tabla
  contenidoDetalle += "<tbody>";
  detalleData.forEach(function (detalle) {
    contenidoDetalle += "<tr>";
    contenidoDetalle += "<td style='border: 1px solid #ccc; padding: 5px; font-size: 10px;'>" + detalle.codigo + "</td>";
    contenidoDetalle += "<td style='border: 1px solid #ccc; padding: 5px; font-size: 10px;'>" + detalle.activo + "</td>";
    contenidoDetalle += "<td style='border: 1px solid #ccc; padding: 5px; font-size: 10px;'>" + detalle.marca + "</td>";
    contenidoDetalle += "<td style='border: 1px solid #ccc; padding: 5px; font-size: 10px;'>" + detalle.modelo + "</td>";
    contenidoDetalle += "<td style='border: 1px solid #ccc; padding: 5px; font-size: 10px;'>" + detalle.serie + "</td>";
    contenidoDetalle += "<td style='border: 1px solid #ccc; padding: 5px; font-size: 10px;'>" + detalle.destinonom + "</td>";
    // ... Agregar más columnas de datos según corresponda
    contenidoDetalle += "</tr>";
  });
  contenidoDetalle += "</tbody>";
  contenidoDetalle += "</table>";
  contenidoDetalle += "</div>";

  // Agregar las líneas horizontales y textos "Firme aquí"
  // Agregar la línea horizontal y el texto "Firme aquí"
  var lineaFirma = "<div style='display: flex; justify-content: center; margin-top: 20px;'>";
  lineaFirma += "<hr style='width: 35%; margin-top: 50px;'>";
  lineaFirma += "</div>";
  lineaFirma += "<p style='font-size: 10px; text-align: center;'>RESPONSABLE</p>";

  // Agregar pie de página
  // Agregar pie de página
  var fechaHoraImpresion = new Date().toLocaleString();
  var contadorPaginas = "<div style='position: fixed; bottom: 20px; left: 20px; font-size: 10px;'>" +
    "F y H de impresión: " + fechaHoraImpresion +
    "</div>";
  // Construir el contenido final de la guía
  var contenidoGuia = "<div style='font-family: Arial, sans-serif;'>" +
    contenedorImagenTitulo +
    tituloCentrado +
    contenidoCabecera +
    contenidoDetalle +
    lineaFirma +
    contadorPaginas +
    "</div>";

  // Retornar el contenido de la guía
  return contenidoGuia;
}

function imprimirGuiadet(cabeceraData, detalleData) {
  // Obtener el contenido de la guía
  const contenidoGuia = obtenerContenidoGuiadet(cabeceraData, detalleData);

  // Abrir una nueva ventana con el tamaño y opciones deseadas
  const opciones = 'width=595,height=842,menubar=no,toolbar=no,location=no,resizable=no,maximize=no';
  const ventanaImpresion = window.open('', '_blank', opciones);

  // Escribir el contenido de la guía en la ventana
  ventanaImpresion.document.write(contenidoGuia);
  ventanaImpresion.document.close();

  // Esperar a que el contenido se cargue completamente antes de imprimir
  ventanaImpresion.onload = function () {
    ventanaImpresion.print();
    ventanaImpresion.close();
  };
}

function agregarRequired(idinput) {
  var input = document.getElementById(idinput);
  input.required = true;
}

function quitarRequired(idinput) {
  var input = document.getElementById(idinput);
  input.required = false;
}


function obtenerContenidoGuiadet(cabeceraData, detalleData) {
  // Construir el contenido del contenedor de imagen y título
  var contenedorImagenTitulo = "<div style='display: flex; align-items: center; margin-bottom: 20px;'>";
  contenedorImagenTitulo += "<img src='/img/logo.png' alt='Logo' style='width: 120px; height: 75px;'>";
  contenedorImagenTitulo += "<div style='border-left: 1px solid black; margin-left: 10px; padding-left: 10px;'>";
  contenedorImagenTitulo += "<p style='margin-bottom: 2px; font-size: 60%;'>" + cabeceraData[0].empresa + "</p>";
  contenedorImagenTitulo += "<p style='margin-bottom: 2px; font-size: 60%;'>" + cabeceraData[0].direccion + "</p>";
  contenedorImagenTitulo += "<p style='margin-bottom: 2px; font-size: 60%;'>" + cabeceraData[0].telefono + "</p>";
  contenedorImagenTitulo += "</div>";
  contenedorImagenTitulo += "</div>";

  // Agregar el título centrado
  var tituloCentrado = "<h4 style='text-align: center;'>MOVIMIENTO DE ACTIVO FIJO</h4>";

  // Construir el contenido de la cabecera
  var contenidoCabecera = "<h5 style='font-weight: bold; margin-bottom: 5px; font-size: 12px;'>DATOS DEL MOVIMIENTO</h5>";
  contenidoCabecera += "<div style='display: flex;'>";
  contenidoCabecera += "<div style='flex: 1;'>";
  contenidoCabecera += "<p style='margin-left: 20px; font-size: 10px;'><strong>N° MOVIMIENTO:</strong> " + cabeceraData[0].correlativo + "</p>";
  contenidoCabecera += "<p style='margin-left: 20px; font-size: 10px;'><strong>FECHA:</strong> " + cabeceraData[0].fecha + "</p>";
  contenidoCabecera += "<p style='margin-left: 20px; font-size: 10px;'><strong>T. MOVIMIENTO:</strong> " + cabeceraData[0].TipoMovimiento + "</p>";
  contenidoCabecera += "<p style='margin-left: 20px; font-size: 10px;'><strong>MOVIMIENTO:</strong> " + cabeceraData[0].Movimiento + "</p>";
  contenidoCabecera += "<p style='margin-left: 20px; font-size: 10px;'><strong>MOTIVO:</strong> " + cabeceraData[0].motivo + "</p>";

  contenidoCabecera += "</div>";
  contenidoCabecera += "<div style='flex: 1;'>";
  contenidoCabecera += "<p style='margin-left: 20px; font-size: 10px;'><strong>RESPONSABLE:</strong> " + cabeceraData[0].responsable + "</p>";
  contenidoCabecera += "<p style='margin-left: 20px; font-size: 10px;'><strong>N° DOCUMENTO:</strong> " + cabeceraData[0].ndocumento + "</p>";
  contenidoCabecera += "<p style='margin-left: 20px; font-size: 10px;'><strong>EST. DE ORIGEN:</strong> " + cabeceraData[0].origen + "</p>";
  contenidoCabecera += "<p style='margin-left: 20px; font-size: 10px;'><strong>EST. DE DESTINO:</strong> " + cabeceraData[0].destino + "</p>";
  contenidoCabecera += "</div>";
  contenidoCabecera += "</div>";

  // Construir el contenido del detalle (tabla)
  var contenidoDetalle = "<h4 style='font-weight: bold; margin-bottom: 5px; font-size: 12px;'>DETALLE DEL MOVIMIENTO</h4>";
  contenidoDetalle += "<div style='border: 1px solid #ccc; padding: 5px;'>";
  contenidoDetalle += "<table style='width: 100%; border-collapse: collapse;'>";
  // Agregar encabezados de columna de la tabla
  contenidoDetalle += "<thead>";
  contenidoDetalle += "<tr style='background-color: #0FA0A7; color: white;'>";
  contenidoDetalle += "<th style='border: 1px solid #ccc; padding: 5px; font-size: 10px;'>CÓDIGO</th>";
  contenidoDetalle += "<th style='border: 1px solid #ccc; padding: 5px; font-size: 10px;'>ACTIVO</th>";
  contenidoDetalle += "<th style='border: 1px solid #ccc; padding: 5px; font-size: 10px;'>MARCA</th>";
  contenidoDetalle += "<th style='border: 1px solid #ccc; padding: 5px; font-size: 10px;'>MODELO</th>";
  contenidoDetalle += "<th style='border: 1px solid #ccc; padding: 5px; font-size: 10px;'>SERIE</th>";
  contenidoDetalle += "<th style='border: 1px solid #ccc; padding: 5px; font-size: 10px;'>UBICACIÓN</th>";
  // ... Agregar más encabezados de columna según corresponda
  contenidoDetalle += "</tr>";
  contenidoDetalle += "</thead>";

  // Agregar filas de datos de la tabla
  contenidoDetalle += "<tbody>";
  detalleData.forEach(function (detalle) {
    contenidoDetalle += "<tr>";
    contenidoDetalle += "<td style='border: 1px solid #ccc; padding: 5px; font-size: 10px;'>" + detalle.codigo + "</td>";
    contenidoDetalle += "<td style='border: 1px solid #ccc; padding: 5px; font-size: 10px;'>" + detalle.activo + "</td>";
    contenidoDetalle += "<td style='border: 1px solid #ccc; padding: 5px; font-size: 10px;'>" + detalle.marca + "</td>";
    contenidoDetalle += "<td style='border: 1px solid #ccc; padding: 5px; font-size: 10px;'>" + detalle.modelo + "</td>";
    contenidoDetalle += "<td style='border: 1px solid #ccc; padding: 5px; font-size: 10px;'>" + detalle.serie + "</td>";
    contenidoDetalle += "<td style='border: 1px solid #ccc; padding: 5px; font-size: 10px;'>" + detalle.destinonom + "</td>";
    // ... Agregar más columnas de datos según corresponda
    contenidoDetalle += "</tr>";
  });
  contenidoDetalle += "</tbody>";
  contenidoDetalle += "</table>";
  contenidoDetalle += "</div>";

  // Agregar las líneas horizontales y textos "Firme aquí"
  // Agregar la línea horizontal y el texto "Firme aquí"
  var lineaFirma = "<div style='display: flex; justify-content: center; margin-top: 20px;'>";
  lineaFirma += "<hr style='width: 35%; margin-top: 50px;'>";
  lineaFirma += "</div>";
  lineaFirma += "<p style='font-size: 10px; text-align: center;'>RESPONSABLE</p>";

  // Agregar pie de página
  // Agregar pie de página
  var fechaHoraImpresion = new Date().toLocaleString();
  var contadorPaginas = "<div style='position: fixed; bottom: 20px; left: 20px; font-size: 10px;'>" +
    "F y H de impresión: " + fechaHoraImpresion +
    "</div>";
  // Construir el contenido final de la guía
  var contenidoGuia = "<div style='font-family: Arial, sans-serif;'>" +
    contenedorImagenTitulo +
    tituloCentrado +
    contenidoCabecera +
    contenidoDetalle +
    lineaFirma +
    contadorPaginas +
    "</div>";

  // Retornar el contenido de la guía
  return contenidoGuia;
}


function limpiarImput(){
  $('input').val('');
}

function validarFormulario(excluirIds) {
  let camposValidos = true;
  $('input, select, textarea').each(function() {
      const id = $(this).attr('id');
      if (excluirIds && excluirIds.includes(id)) {
          return true;
      }

      if (!$(this).val()) {
          camposValidos = false;
          $(this).addClass('is-invalid');
      } else {
          $(this).removeClass('is-invalid');
          $(this).addClass('is-valid');
      }
  });

  if (!camposValidos) {
      mensaje('error', 'Por favor, complete todos los campos.', 1800);
  }

  return camposValidos;
}


