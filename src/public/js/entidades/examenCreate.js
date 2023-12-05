$(document).ready(function () {
    

});
var opc = 0;
function guardarExamen() {
    $("#btnExamen").prop("disabled", true);
    let soexa = $('#soexa');
    let desexa = $('#desexa');
    let ordimp = $('#ordimp');
    let ordprot = $('#ordprot');
    let starep = document.querySelector("input[name='starep']:checked").value;
    let staaddfile = document.querySelector("input[name='staaddfile']:checked").value;
    let reg_cie10 = document.querySelector("input[name='reg_cie10']:checked").value;
    validarFormulario('');
    $.ajax({
        url: '/insexamenes',
        method: "POST",
        data: {
            soexa: soexa.val(),
            desexa: desexa.val(),
            ordimp: ordimp.val(),
            ordprot: ordprot.val(),
            starep: starep,            
            staaddfile: staaddfile,
            reg_cie10: reg_cie10,
            opc:opc,
        },
        success: function (response) {
            opc = 0;
            if (response[0].tipo === 'success') {
                MensajeSIyNO(response[0].tipo, response[0].mensaje, '¿Desea volver?', function (respuesta) {
                    if (respuesta) {
                        $('input[type="text"]').val("");
                        rendersub('/examen');
                    } else {
                        if (data[0].mensaje === "Guardado correctamente") {
                            limpiarImput();
                        }
                        return;
                    }
                });
            } else {
                mensaje(response[0].tipo, response[0].response, 1500);
            }
            $("#btnExamen").prop("disabled", false);
        },
        error: function () {
            mensaje('error', 'Error al guardar, intente nuevamente', 1500);
            $("#btnCita").prop("disabled", false);
        }
    });
}