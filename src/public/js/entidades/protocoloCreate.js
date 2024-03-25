$(document).ready(function () {
  ocultarDiv("cotiza_cant_pac");
  
  $('input[name="estado"]').change(function () {
    let estado = $(this).val();  // Obtener el valor actual del radio button
    if (estado === 'C') {
      mostrarDiv("cotiza_cant_pac");
    } else {
      ocultarDiv("cotiza_cant_pac");
    }
  });


  const id = document.getElementById("inputid").value;
  getexamenes(id);
  getTipoExamen();
  if (id === "0") {
    CalcularFecVen();
  } else {
    llenarFormulario(id);
  }
  $('#ex1 a[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
    var activeTabId = e.target.getAttribute('aria-controls');
    const btnAdherir = document.getElementById("btnAdherir");
    if (activeTabId === 'ex1-tabs-2') {
      btnAdherir.style.display = "";
    } else {
      btnAdherir.style.display = "none";
    }
  });
});

function llenarFormulario(id) {
  // Selecciona los elementos una sola vez y guárdalos en variables
  var formElements = {
    codemp: document.getElementById('codemp'),
    nomempresa: document.getElementById('nomempresa'),
    vigente: document.getElementById('vigente'),
    historico: document.getElementById('historico'),
    cotizacion: document.getElementById('cotizacion'),
    anulado: document.getElementById('anulado'),
    tipexa_id: document.getElementById('tipexa_id'),
    nompro: document.getElementById('nompro'),
    comentarios: document.getElementById('comentarios'),
    tiemval_cermed: document.getElementById('tiemval_cermed'),
    fecvcto_cermed: document.getElementById('fecvcto_cermed'),
    fec_emi: document.getElementById('fec_emi'),
    cant_pac: document.getElementById('cant_pac'),
    med_id: document.getElementById('med_id'),
    medapmn: document.getElementById('medapmn'),
  };

  $.ajax({
    url: '/protocolodatos/' + id,
    success: function (datos) {

      var data = datos[0];
      formElements.codemp.value = data.codemp;
      formElements.nomempresa.value = data.razsoc;
      switch (data.estado) {
        case "V":
          formElements.vigente.checked = true;
          break;
        case "H":
          formElements.historico.checked = true;
          break;
        case "C":
          formElements.cotizacion.checked = true;
          break;
        case "A":
          formElements.anulado.checked = true;
          break;
        default:
          break;
      }
      formElements.tipexa_id.value = data.tipexa_id;
      formElements.nompro.value = data.nompro;
      formElements.comentarios.value = data.comentarios;
      formElements.tiemval_cermed.value = data.tiemval_cermed;
      formElements.fecvcto_cermed.value = new Date(data.fecvcto_cermed).toISOString().split('T')[0];
      formElements.fec_emi.value = new Date(data.fec_emi).toISOString().split('T')[0];

      formElements.cant_pac.value = data.cant_pac;
      formElements.med_id.value = data.med_id;
      formElements.medapmn.value = data.medapmn;

      let estado = $('input[type="radio"][name="estado"]');
      estado.filter('[value="C"]').trigger('change');



    },
    error: function (xhr, status, error) {
      console.error('Error en la solicitud AJAX:', status, error);
      alert('Error al cargar los datos');
    }
  });


}

function getexamenes(id) {
  var btncerrar = document.getElementById(`cerrarprotocolo`);
  btncerrar.click();
  const ruta = (id === "0") ? '/examenes' : '/examenes/' + id;
  ocultarTabla("mydatatable");
  mostrarDiv("cargaacc");
  $.ajax({
    url: ruta,
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
            const selectedAttr = (item.raneta_id === examen.raneta_id) ? 'selected' : '';
            selectOptions += `<option value="${item.raneta_id}" ${selectedAttr}>${item.desrango}</option>`;
          });
          const checked = (examen.checkbox === "S") ? 'checked' : '';
          tbody.append(`
              <tr>
                <td class="text-left" style="vertical-align: middle;">${examen.desexa}</td>
                <td class="text-left" style="vertical-align: middle;">${examen.desexadet}</td>
                <td class="" style="vertical-align: middle;"><input onclick="activar('${examen.soexa}_${examen.codpru_id}')" id="check_${examen.soexa}_${examen.codpru_id}" type="checkbox" class="mt-1" value="${examen.soexa}_${examen.codpru_id}" ${checked}></td>
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
  if (event.key === 'Enter') { // Verifica si se presionó la tecla Enter
    buscarEmpresa();
  }
});
function buscarEmpresa() {
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

document.getElementById("protocolomodal").addEventListener("keydown", function (event) {
  if (event.key === 'Enter') {
    mostrarDiv('cargaprotocolomodal');
    ocultarTabla('tableprotocolomodal');
    let protocolomodal = $('#protocolomodal').val();
    event.preventDefault();
    $.ajax({
      url: '/protocololistimport',
      method: "GET",
      data: {
        protocolo: protocolomodal,
      },
      success: function (lista) {
        ocultarDiv('cargaprotocolomodal');
        mostrarTabla('tableprotocolomodal');
        let bodyprotocolomodal = $('#bodyprotocolomodal');
        bodyprotocolomodal.html('');
        if (lista.length === 0) {
          bodyprotocolomodal.append(`
      <tr>
        <td colspan="3">No hay protocolos el nombre proporcionado</td>
      </tr>
    `);
        } else {

          lista.forEach(list => {
            bodyprotocolomodal.append(`
        <tr>
          <td class="align-middle"><button class="btn btn-info btn-circle btn-sm" onclick="getexamenes('${list.codpro_id}')"><i class="fa-solid fa-plus"></i></button></td>
          <td style="vertical-align: middle;" class="text-left">${list.codpro_id}</td>
          <td style="vertical-align: middle;" class="text-left asignado">${list.nompro}</td>
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
});

function AgregarEmpresa(btn) {
  event.preventDefault();
  var filaOrigen = $(btn).closest("tr");
  var codemp = filaOrigen.find("td:eq(1)").text();
  var razsoc = filaOrigen.find("td:eq(2)").text();
  var codempresa = document.getElementById("codemp");
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
      let combo = $('#tipexa_id');
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

function LimpiarEmpresa(btn) {
  var codempresa = document.getElementById("codemp");
  var nomempresa = document.getElementById("nomempresa");
  codempresa.value = "";
  nomempresa.value = "";
}

function CalcularFecVen() {
  var cadcer = parseInt(document.getElementById("tiemval_cermed").value, 10);
  if (!isNaN(cadcer)) {
    var fechaActual = new Date();
    fechaActual.setFullYear(fechaActual.getFullYear() + cadcer);
    var año = fechaActual.getFullYear();
    var mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
    var dia = fechaActual.getDate().toString().padStart(2, '0');
    var fechaFormateada = año + '-' + mes + '-' + dia;
    document.getElementById("fecvcto_cermed").value = fechaFormateada;
  } else {

  }
}

function Guardar() {
  let empresa = document.getElementById("nomempresa").value;
  if (empresa === "") {
    mensajecentral('error', 'Debe registrar un cliente.');
    return;
  }
  const id = document.getElementById("inputid").value;
  var table = document.getElementById('mydatatable');
  var rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
  var datains = [];
  for (var i = 0; i < rows.length; i++) {
    var checkboxes = rows[i].getElementsByTagName('input');
    var value = checkboxes[0].value;
    var soexa = value.split('_')[0];
    var codpru_id = value.split('_')[1];
    var select = document.getElementById(`select_${soexa}_${codpru_id}`).value;
    var precio = document.getElementById(`precio_${soexa}_${codpru_id}`).value;
    var comen = document.getElementById(`comen_${soexa}_${codpru_id}`).value;
    var rowData = {
      codpru_id: codpru_id,
      soexa: soexa,
      raneta_id: select,
      precio: precio,
      obs: comen

    };

    if (checkboxes[0].checked) {
      datains.push(rowData);
    }
  }

  if (datains.length === 0) {
    mensajecentral('error', 'No ha seleccionado ningún examen.');
  } else {
    const codemp = document.getElementById("codemp").value
    const nompro = document.getElementById("nompro").value
    const comentarios = document.getElementById("comentarios").value
    const tipexa_id = document.getElementById("tipexa_id").value
    const fec_emi = document.getElementById("fec_emi").value
    const cant_pac = document.getElementById("cant_pac").value
    const med_id = document.getElementById("med_id").value
    var vigente = document.getElementById("vigente");
    var historico = document.getElementById("historico");
    var cotizacion = document.getElementById("cotizacion");
    //var data_cantidad_pacientes = document.getElementById("cant_paci").value
    var anulado = document.getElementById("anulado");
    let estado;
    //let cantidad_pacientes;


    if (vigente.checked === true) {
      estado = vigente.value;
      //data_cantidad_pacientes = 0;
    }
    if (historico.checked === true) {
      estado = historico.value;
      //data_cantidad_pacientes = 0;
    }
    if (cotizacion.checked === true) {
      estado = cotizacion.value;
      //cantidad_pacientes =  data_cantidad_pacientes;
    }
    if (anulado.checked === true) {
      estado = anulado.value;
      //data_cantidad_pacientes = 0;
    }
    const tiemval_cermed = document.getElementById("tiemval_cermed").value
    const fecvcto_cermed = document.getElementById("fecvcto_cermed").value

    const datosCompletos = {
      codemp: codemp,
      nompro: nompro,
      comentarios: comentarios,
      tipexa_id: tipexa_id,
      estado: estado,
      fec_emi: fec_emi,
      cant_pac: cant_pac,
      med_id: med_id,
      tiemval_cermed: tiemval_cermed,
      fecvcto_cermed: fecvcto_cermed,
      id: id,
      datains: datains
    };

    fetch('/protocolo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datosCompletos)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la solicitud');
        }
        return response.json();
      })
      .then(data => {
        MensajeSIyNO(data[0].icono, data[0].mensaje, '¿Desea volver?', function (respuesta) {
          if (respuesta) {
            rendersub('/protocolo');
          } else {
            if (data[0].mensaje === "Guardado correctamente") {
              limpiarImput();
            }
            return;
          }
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
}



document.getElementById("medicomodal").addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    var parametro = this.value;
    getmedico(parametro);
  }
});

function getmedico(parametro1) {
  mostrarDiv('cargamedico');
  ocultarDiv('tablamedicomodal');
  let parametro = 0;
  $.ajax({
    url: '/listarmedicos',
    method: 'GET',
    data: {
      parametro: parametro,
      parametro1: parametro1,
    },
    success: function (medicos) {
      ocultarDiv('cargamedico');
      mostrarDiv('tablamedicomodal');
      const tbodymed = $('#bodymedicomodal');
      tbodymed.empty();
      if (medicos.length === 0) {
        tbodymed.append(`
                  <tr>
                      <td colspan="2" class="text-center">No hay resultados disponibles </td>
                  </tr>
              `);
      } else {
        medicos.forEach(medico => {
          tbodymed.append(`
                  <tr>
                  <td>
                  <button onclick="getmedicom('${medico.med_id}','${medico.medapmn}')" class="btn btn-circle btn-sm btn-info mr-1"><i class="fa-solid fa-plus"></i></button>                    
                  </td>
                  <td>${medico.medapmn}</td>
                  <td>${medico.nundoc}</td>
                  
                </tr>
              `);
        });
        mensaje(medicos[0].tipo, medicos[0].response, 1500);
      }
    },
    error: function () {
      alert('Error en la solicitud AJAX');
    },
  });
}

function getmedicom(med_idM, medapmnM,) {
  $('#med_id').val(med_idM);
  $('#medapmn').val(medapmnM);
  var btncerrar = document.getElementById(`cerrarmedicomodal`);
  btncerrar.click();
}



