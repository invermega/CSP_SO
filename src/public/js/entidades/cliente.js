
$(document).ready(function () {
    getPacienteCombos();
});
/*function guardarCliente() {
    validarFormulario('contacto,celular');
}
*/
function getPacienteCombos() {
    $.ajax({
        url: '/listarCombosPac',
        success: function (lista) {
            let docident = $('#docide'); // Selecionar el select de tipo documento

            docident.html('');

            lista.forEach(item => {
                let option = `<option value="${item.id}">${item.descripcion}</option>`;
                //console.log(item.id);
                if (item.tabla === 'documento_identidad') {
                    docident.append(option);
                }
            });
            $("#docide").val("01");
            //pais.val('9589');
        },
        error: function () {
            alert('error');
        }
    });
}
document.getElementById("clientemodal").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        var parametro = this.value;
        getcliente(parametro);
    }
});

function getcliente(parametro) {
    mostrarDiv('carga');
    ocultarDiv('tablaclientemodal');
    $.ajax({
        url: '/listarcliente',
        method: 'GET',
        data: {
            parametro: parametro,
        },
        success: function (clientes) {

            ocultarDiv('carga');
            mostrarDiv('tablaclientemodal');
            const tbodycli = $('#bodycliente');
            tbodycli.empty();
            if (clientes.length === 0) {
                tbodycli.append(`
                    <tr>
                        <td colspan="2" class="text-center">No hay resultados disponibles </td>
                    </tr>
                `);
            } else {
                clientes.forEach(cliente => {
                    tbodycli.append(`
            <tr>             
              <td>${cliente.razsoc}</td>
              <td>${cliente.NumDoc}</td>
              <td>
              <button onclick="getclientem('${cliente.docide}','${cliente.NumDoc}','${cliente.razsoc}','${cliente.actividad_economica}','${cliente.Direccion}','${cliente.contacto}','${cliente.emailcon}','${cliente.celular}','${cliente.telefono}','${cliente.emailmedocu}','${cliente.cadcermed}','${cliente.incfirmmedexa}','${cliente.Incfirpacexa}','${cliente.Inchuepacexa}','${cliente.incfordatper}','${cliente.incdecjur}','${cliente.incfirhueforadi}','${cliente.creusucatocu}','${cliente.Encorvctocert}','${cliente.encorvusuexi}','${cliente.creusucatprev}','${cliente.notinfmed_medocu}','${cliente.notinfmedpac}')" class="btn btn-circle btn-sm btn-warning mr-1"><i class="fa-regular fa-pen-to-square"></i></button>
              <a style="color:white" type="button" class="btn btn-circle btn-sm btn-danger mr-1" onclick=eliminarCli("${cliente.cli_id}")><i class="fa-solid fa-trash-can"></i></a>
              </td>
            </tr>
          `);
                });
            }
        },
        error: function () {
            alert('Error en la solicitud AJAX');
        },
    });
}

function limpiarinputsradio() {
    var radios = document.querySelectorAll('.needs-validation input[type="radio"]');
    radios.forEach(function (radio) {
        radio.checked = false;
    });
}

function eliminarCli() {

    cli_id = parseInt(cli_id);
    $.ajax({
        url: '/deleteCli',
        method: "DELETE",
        data: {
            cli_id: cli_id,
        },
        success: function (user) {
            $('#modalFormactcliente [data-dismiss="modal"]').trigger('click');
            const tbodycli = $('#bodycliente');
            tbodycli.empty();
            mensaje(user[0].tipo, user[0].response, 1800);
        },
        error: function () {
            alert('error');
        }
    });

}

var opc = 0;
function guardarcliente() {


    let razsoc = $('#razsoc');
    let docide = $('#docide');
    let NumDoc = $('#NumDoc');
    let Direccion = $('#Direccion');
    let telefono = $('#telefono');
    let emailcon = $('#emailcon');
    let contacto = $('#contacto');
    let celular = $('#celular');
    let emailmedocu = $('#emailmedocu');
    let feccre = $('#feccre');
    let cadcermed = $('#cadcermed');
    let incfirmmedexa = $('#incfirmmedexa');
    let Incfirpacexa = $('#Incfirpacexa');
    let Inchuepacexa = $('#Inchuepacexa');
    let Incfordatper = $('#Incfordatper');
    let incdecjur = $('#incdecjur');
    let Incfirhueforadi = $('#Incfirhueforadi');
    let creusucatocu = $('#creusucatocu');
    let Encorvctocert = $('#Encorvctocert');
    let envcorusuexi = $('#envcorusuexi');
    let creusucatprev = $('#creusucatprev');
    let notinfmed_medocu = $('#notinfmed_medocu');
    let notinfmedpac = $('#notinfmedpac');
    let actividad_economica = $('#actividad_economica');
    let logo = $('#logo');

    $.ajax({
        url: '/cliente',
        method: "POST",
        data: {

            razsoc: razsoc.val(),
            docide: docide.val(),
            NumDoc: NumDoc.val(),
            Direccion: Direccion.val(),
            telefono: telefono.val(),
            emailcon: emailcon.val(),
            contacto: contacto.val(),
            celular: celular.val(),
            emailmedocu: emailmedocu.val(),
            feccre: feccre.val(),
            cadcermed: cadcermed.val(),
            incfirmmedexa: incfirmmedexa.val(),
            Incfirpacexa: Incfirpacexa.val(),
            Inchuepacexa: Inchuepacexa.val(),
            Incfordatper: Incfordatper.val(),
            incdecjur: incdecjur.val(),
            Incfirhueforadi: Incfirhueforadi.val(),
            creusucatocu: creusucatocu.val(),
            Encorvctocert: Encorvctocert.val(),
            envcorusuexi: envcorusuexi.val(),
            creusucatprev: creusucatprev.val(),
            notinfmed_medocu: notinfmed_medocu.val(),
            notinfmedpac: notinfmedpac.val(),
            actividad_economica: actividad_economica.val(),
            logo: logo.val(),
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


function getclientem(docideM, NumDocM, razsocM, actividad_economicaM, DireccionM, contactoM, emailconM, celularM, telefonoM, emailmedocuM, cadcermedM, incfirmmedexaM, IncfirpacexaM, InchuepacexaM, IncfordatperM, incdecjurM, IncfirhueforadiM, creusucatocuM, EncorvctocertM, envcorusuexiM, creusucatprevM, notinfmed_medocuM, notinfmedpacM) {
    opc = 1;

    $('#docide').val(docideM);
    $('#NumDoc').val(NumDocM);
    $('#razsoc').val(razsocM);
    $('#actividad_economica').val(actividad_economicaM);
    $('#Direccion').val(DireccionM);
    //$('#logo').val(logoM);
    $('#contacto').val(contactoM);
    $('#emailcon').val(emailconM);
    $('#celular').val(celularM);
    $('#telefono').val(telefonoM);
    $('#emailmedocu').val(emailmedocuM);
    $('#cadcermed').val(cadcermedM);
    $('#incfirmmedexa').val(incfirmmedexaM);
    $('#Incfirpacexa').val(IncfirpacexaM);
    $('#Inchuepacexa').val(InchuepacexaM);
    $('#Incfordatper').val(IncfordatperM);
    $('#incdecjur').val(incdecjurM);
    $('#Incfirhueforadi').val(IncfirhueforadiM);
    $('#creusucatocu').val(creusucatocuM);
    $('#Encorvctocert').val(EncorvctocertM);
    $('#envcorusuexi').val(envcorusuexiM);
    $('#creusucatprev').val(creusucatprevM);
    $('#notinfmed_medocu').val(notinfmed_medocuM);
    $('#notinfmedpac').val(notinfmedpacM);

    $('#modalFormactcliente [data-dismiss="modal"]').trigger('click');
   
}

