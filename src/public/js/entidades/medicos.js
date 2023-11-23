$(document).ready(function () {
    getPacienteCombos();

});


function getPacienteCombos() {
    $.ajax({
        url: '/listarCombosPac',
        success: function (lista) {
            let docident = $('#docide'); // Selecionar el select de tipo documento
            let espme = $('#esp_id');  // Seleccionar el select de especialidad
            console.log(lista);
            docident.html('');
            espme.html('');

            lista.forEach(item => {
                let option = `<option value="${item.id}">${item.descripcion}</option>`;
                if (item.tabla === 'documento_identidad') {
                    docident.append(option);
                } if (item.tabla === 'especialidad') {
                    espme.append(option);
                }
            });
            $("#docide").val("01");
            $('#esp_id').val("1");

            //pais.val('9589');
        },
        error: function () {
            alert('error');
        }
    });
}

/*function guardarMedico() {
    validarFormulario('medcel,medTelfij,med_correo,meddir,med_firma');
}*/
document.getElementById("medicomodal").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        var parametro = this.value;
        getmedico(parametro);
    }
});

function getmedico(parametro) {
    mostrarDiv('carga');
    ocultarDiv('tablamedicomodal');
    $.ajax({
        url: '/listarmedicos',
        method: 'GET',
        data: {
            parametro: parametro,
        },
        success: function (medicos) {
            console.log(medicos);
            ocultarDiv('carga');
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
                    <td>${medico.medapmn}</td>
                    <td>${medico.nundoc}</td>
                    <td>
                    <button onclick="getmedicom('${medico.medap}','${medico.medam}','${medico.mednam}','${medico.docide}','${medico.nundoc}','${medico.med_cmp}','${medico.med_rne}','${medico.medTelfij}','${medico.medcel}','${medico.med_correo}','${medico.meddir}','${medico.med_firma}','${medico.esp_id}','${medico.usenam}')" class="btn btn-circle btn-sm btn-warning mr-1"><i class="fa-regular fa-pen-to-square"></i></button>
                    <a style="color:white" type="button" class="btn btn-circle btn-sm btn-danger mr-1" onclick=eliminarMed("${medico.med_id}")><i class="fa-solid fa-trash-can"></i></a>
                    </td>
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

function eliminarMed() {

    med_id = parseInt(med_id);
    $.ajax({
        url: '/deleteMed',
        method: "DELETE",
        data: {
            med_id: med_id,
        },
        success: function (user) {
            $('#modalFormmedico [data-dismiss="modal"]').trigger('click');
            const tbodymed = $('#bodymedicomodal');
            tbodymed.empty();
            mensaje(user[0].tipo, user[0].response, 1800);
        },
        error: function () {
            alert('error');
        }
    });

}


var opc = 0;
function guardarMedico() {

    let medap = $('#medap');
    let medam = $('#medam');
    let mednam = $('#mednam');
    let docide = $('#docide');
    let nundoc = $('#nundoc');
    let med_cmp = $('#med_cmp');
    let med_rne = $('#med_rne');
    let medTelfij = $('#medTelfij');
    let medcel = $('#medcel');
    let med_correo = $('#med_correo');
    let meddir = $('#meddir');
    let med_firma = $('#med_firma');
    let esp_id = $('#esp_id');
    let feccre = $('#feccre');
    console.log(medap, medam, mednam, docide, nundoc, med_cmp, med_rne, medTelfij, medcel, med_correo, meddir, med_firma, esp_id, feccre);

    $.ajax({
        url: '/medico',
        method: "POST",
        data: {
            medap: medap.val(),
            medam: medam.val(),
            mednam: mednam.val(),
            docide: docide.val(),
            nundoc: nundoc.val(),
            med_cmp: med_cmp.val(),
            med_rne: med_rne.val(),
            medTelfij: medTelfij.val(),
            medcel: medcel.val(),
            med_correo: med_correo.val(),
            meddir: meddir.val(),
            med_firma: med_firma.val(),
            esp_id: esp_id.val(),
            feccre: feccre.val(),
            opc: opc,
        },
        success: function (response) {

            $('input[type="text"]').val("");
            opc = 0;

            mensaje(response[0].tipo, response[0].response, 1500);
        },
        error: function () {
            mensaje('error', 'Error al guardar, intente nuevamente', 1500);
        }
    });
}


function getmedicom(medapM, medamM, mednamM, docideM, nundocM, med_cmpM, med_rneM, medTelfijM, medcelM, med_correoM, meddirM, med_firmaM, esp_idM) {
    opc = 1;
    $('#medap').val(medapM);
    $('#medam').val(medamM);
    $('#mednam').val(mednamM);
    $('#docide').val(docideM);
    $('#nundoc').val(nundocM);
    $('#med_cmp').val(med_cmpM);
    $('#med_rne').val(med_rneM);
    $('#medTelfij').val(medTelfijM);
    $('#medcel').val(medcelM);
    $('#med_correo').val(med_correoM);
    $('#meddir').val(meddirM);
    //$('#med_firma').val(med_firmaM);
    $('#esp_id').val(esp_idM);
    //$('#usenam').val(usenamM);
    //$('#contrasena').val('123456789').prop('disabled', true);
    $('#modalFormmedico [data-dismiss="modal"]').trigger('click');
    //$('#iduser').val(0);
}


















