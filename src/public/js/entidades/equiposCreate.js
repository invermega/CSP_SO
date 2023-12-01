$(document).ready(function () {
    getPacienteCombos();
})

function getPacienteCombos() {
    $.ajax({
        url: '/listarCombosPac',
        success: function (lista) {
            let soexant = $('#soexa'); // Selecionar el select de tipo de examen
            soexant.html('');
            lista.forEach(item => {
                let option = `<option value="${item.id}">${item.descripcion}</option>`;
                if (item.tabla === 'so_examenes') {
                    soexant.append(option);
                }
            });
            const id = document.getElementById("inputid").value;
            if (id === "0") {
                $("#soexa").val("001");
            } else {
                getequipos(id);
            }
        },
        error: function () {
            alert('error');
        }
    });
}

function getequipos(id) {
    let codpru_id = '';
    let opc = 2;
    $.ajax({
        url: '/listarequipos',
        method: "GET",
        data: {
            codpru_id: codpru_id,
            equipos: id,
            opc: opc
        },
        success: function (equipos) {
            $('#marca').val(equipos[0].marca);
            $('#modelo').val(equipos[0].modelo);
            $('#soexa').val(equipos[0].soexa);
            $('#desequi').val(equipos[0].desequi);
            var feccali = new Date(equipos[0].feccali.split('/').reverse().join('-'));
            document.getElementById('feccali').valueAsDate = feccali;
            var fecfab = new Date(equipos[0].fecfab.split('/').reverse().join('-'));
            document.getElementById('fecfab').valueAsDate = fecfab;
            mensaje(equipos[0].tipo, equipos[0].response, 1500);
        },
        error: function () {
            alert('Error en la solicitud AJAX');
        },
    });
}

function guardarequipos() {
    $("#btnGrabar").prop("disabled", true);
    let inputid = $('#inputid');
    let marca = $('#marca');
    let modelo = $('#modelo');
    let soexa = $('#soexa');
    let desequi = $('#desequi');
    let feccali = $('#feccali');
    let fecfab = $('#fecfab');
    validarFormulario('desequi,fecfab');
    $.ajax({
        url: '/equipos',
        method: "POST",
        data: {
            inputid: inputid.val(),
            marca: marca.val(),
            modelo: modelo.val(),
            desequi: desequi.val(),
            feccali: feccali.val(),
            fecfab: fecfab.val(),
            soexa: soexa.val(),
        },
        success: function (response) {
            opc = 0;
            if (response[0].icono === 'success') {
                MensajeSIyNO(response[0].icono, response[0].mensaje, '¿Desea volver?', function (respuesta) {
                    if (respuesta) {
                        $('input[type="text"]').val("");
                        rendersub('/equipos');
                    } else {
                        if (response[0].mensaje === "Guardado correctamente") {
                            limpiarImput();
                            inputid.val("0");
                        }
                        return;
                    }
                });
            } else {
                mensaje(response[0].icono, response[0].response, 1500);
            }
            $("#btnGrabar").prop("disabled", false);
        },
        error: function () {
            mensaje('error', 'Error al guardar, intente nuevamente', 1500);
            $("#btnGrabar").prop("disabled", false);
        }
    });
}

