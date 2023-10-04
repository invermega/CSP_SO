$(document).ready(function () {
  getexamenes();
  getTipoExamen();
});

function getexamenes() {
  ocultarTabla("mydatatable");
  mostrarDiv("cargaacc");
  $.ajax({
    url: '/examenes',
    success: function (examenes) {
      ocultarDiv("cargaacc");
      mostrarTabla("mydatatable");
      let tbody = $('#tbodyexamen');
      tbody.html('');
      if (Array.isArray(examenes)) {
        examenes.forEach(examen => {
          const grupoetario = examen.grupoetario;
          var selectOptions = "";
          const grupoetarioArray = JSON.parse(grupoetario);
          
          grupoetarioArray.forEach((item) => {
            selectOptions += `<option value="${item.raneta_id}">${item.desrango}</option>`;
          });
          tbody.append(`
              <tr>
                <td class="text-left" style="vertical-align: middle;">${examen.desexa}</td>
                <td class="text-left" style="vertical-align: middle;">${examen.desexadet}</td>
                <td class="" style="vertical-align: middle;"><input onclick="activar('${examen.soexa}_${examen.codpru_id}')" id="check_${examen.soexa}_${examen.codpru_id}" type="checkbox" class="mt-1" value="${examen.soexa}_${examen.codpru_id}" ></td>
                <td>
                  <select class="form-select form-control form-control-sm" name="" id="select_${examen.soexa}_${examen.codpru_id}">
                    ${selectOptions}
                  </select>
                </td>
                <td>
                <input type="text" class="form-control form-control-sm" value="" id="precio_${examen.soexa}_${examen.codpru_id}"
                placeholder="Precio unitario" required>
                </td>
                <td>
                <input type="text" class="form-control form-control-sm" value="" id="comen_${examen.soexa}_${examen.codpru_id}"
                placeholder="Comentarios" required>
                </td>
              </tr>
            `);
          activar(examen.soexa + '_' + examen.codpru_id);
        });
      } else {
        // Manejar el caso de que "examenes" no sea un array, tal vez mostrar un mensaje de error
        console.error('La respuesta no es un array de examenes.');
      }
    },
    error: function (xhr, status, error) {
      console.error('Error en la solicitud AJAX:', status, error);
      alert('Error al cargar los examenes');
    }
  });
}

function activar(opcexa) {
  var checkboxPrincipal = document.getElementById("check_" + opcexa);
  var select = document.getElementById("select_" + opcexa);
  var precio = document.getElementById("precio_" + opcexa);
  var comentario = document.getElementById("comen_" + opcexa);
  if (checkboxPrincipal.checked) {
    select.disabled = false;
    precio.disabled = false;
    comentario.disabled = false;
  } else {
    select.disabled = true;
    precio.disabled = true;
    comentario.disabled = true;
  }
}


document.getElementById("empresamodal").addEventListener("keydown", function (event) {
  if (event.keyCode === 13) { // Verifica si se presionó la tecla Enter
    mostrarDiv('cargaempresamodal');
    ocultarTabla('tableempresamodal');
    let empresamodal = $('#empresamodal').val(); // Corregido: agregué el símbolo '#' para seleccionar el elemento por su ID
    event.preventDefault();
    $.ajax({
      url: '/empresas',
      method: "GET",
      data: {
        empresa: empresamodal,
      },
      success: function (lista) {
        ocultarDiv('cargaempresamodal');
        mostrarTabla('tableempresamodal');
        let bodyempleadomodal = $('#bodyempresamodal');
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
          <td style="vertical-align: middle;" class="text-left">${list.codemp}</td>
          <td style="vertical-align: middle;" class="text-left asignado">${list.razsoc}</td>
        </tr>
      `);
          });
        }
      },
      error: function () { // Corregido: eliminé el parámetro "lista" innecesario
        alert('error');
      }
    });

  }
});

function AgregarEmpresa(btn) {
  event.preventDefault();
  var filaOrigen = $(btn).closest("tr");
  var codemp = filaOrigen.find("td:eq(1)").text();
  var razsoc = filaOrigen.find("td:eq(2)").text();
  var codempresa = document.getElementById("codempresa");
  var nomempresa = document.getElementById("nomempresa");
  codempresa.value = codemp;
  nomempresa.value = razsoc;
  var btncerrar = document.getElementById(`cerrarempresa`);
  btncerrar.click();
}

function getTipoExamen() {
  $.ajax({
    url: '/tipoexamen',
    method: "GET",
    success: function (TipoExamenes) {
      let combo = $('#tipo');
      combo.html('');
      TipoExamenes.forEach(TipoExamen => {
        combo.append(`<option value="${TipoExamen.tipexa_id}">${TipoExamen.desexa}</option>
  `);
      });
      $("#comboesp option[value=0023]").attr("selected", true);
    },
    error: function (TipoExamenes) {
      alert('error');
    }
  });
}

function LimpiarEmpresa(btn){
  var codempresa = document.getElementById("codempresa");
  var nomempresa = document.getElementById("nomempresa");
  codempresa.value = "";
  nomempresa.value = "";
}
  


