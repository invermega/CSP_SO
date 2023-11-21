$(document).ready(function () {
    //const id = document.getElementById("inputid").value;
    getPacienteCombos();

    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const originalImage = new Image();
    let originalImageSrc = '../img/medicos/default.webp'; // Almacena la URL de la imagen original

    originalImage.onload = function () {
        drawImageOnCanvas(originalImage);
    };
    originalImage.src = originalImageSrc; // Utiliza la URL almacenada

    // Función para cargar la imagen en el canvas y mostrarla como círculo
    function drawImageOnCanvas(image) {
        const width = 250; // Ancho fijo para el canvas
        const height = 125; // Altura fija para el canvas
        context.clearRect(0, 0, width, height);
        context.save();
        context.rect(0, 0, width, height);
        context.clip();
        context.drawImage(image, 0, 0, width, height);
        context.restore();
    }

    function resetCanvasWithImage(imageSrc) {
        event.preventDefault();
        const image = new Image();
        image.onload = function () {
            drawImageOnCanvas(image);
            $('#reset-btn').css('display', 'inline-block');
        };
        image.src = imageSrc;
    }

    $('#upload-btn').on('click', function (event) {
        event.preventDefault();
        $('#file-input').click();
    });

    $('#reset-btn').on('click', function (event) {
        resetCanvasWithImage(originalImageSrc);
    });

    $('#file-input').on('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                resetCanvasWithImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
});



function getPacienteCombos() {
    $.ajax({
        url: '/listarCombosPac',
        success: function (lista) {
            let docident = $('#docide'); // Selecionar el select de tipo documento
            let espme = $('#esp_id');  // Seleccionar el select de especialidad
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
            $('#esp_id').val("2");
        },
        error: function () {
            alert('error');
        }
    });
}

var opc = 0;
function guardarMedico() {

    const canvas = document.getElementById('canvas');
    let camposValidosmed = validarFormulario('file-input,docide,med_cmp,medcel,medTelfij,med_correo,meddir,esp_id,med_rne,medicomodal');
    if (!camposValidosmed) {
        return;
    }
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
    let esp_id = $('#esp_id');
    let feccre = $('#feccre');
    var picmed = canvas.toDataURL();
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
            esp_id: esp_id.val(),
            feccre: feccre.val(),
            opc: opc,
            picmed: picmed,
        },
        success: function (response) {
            opc = 0;
            if (response[0].tipo === 'success') {
                MensajeSIyNO(response[0].tipo, response[0].mensaje, '¿Desea volver?', function (respuesta) {
                    if (respuesta) {
                        $('input[type="text"]').val("");
                        rendersub('/medicos');
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
            $("#btnMed").prop("disabled", false);
        },
        error: function () {
            mensaje('error', 'Error al guardar, intente nuevamente', 1500);
        }
    });
}



/*
function llenarFormulariomedico(id) {
    // Selecciona los elementos una sola vez y guárdalos en variables
    var formElements = {
        medap: document.getElementById('medap'),
        medam: document.getElementById('medam'),
        mednam: document.getElementById('mednam'),
        docide: document.getElementById('docide'),
        nundoc: document.getElementById('nundoc'),
        med_cmp: document.getElementById('med_cmp'),
        med_rne: document.getElementById('med_rne'),
        medTelfij: document.getElementById('medTelfij'),
        medcel: document.getElementById('medcel'),
        med_correo: document.getElementById('med_correo'),
        meddir: document.getElementById('meddir'),
        esp_id: document.getElementById('esp_id')
    };

    $.ajax({
        url: '/medicodatos/' + id,
        success: function (datos) {
            console.log(datos);
            var data = datos[0];
            formElements.medap.value = data.medap;
            formElements.medam.value = data.medam;
            formElements.mednam.value = data.mednam;
            formElements.docide.value = data.docide;
            formElements.nundoc.value = data.nundoc;
            formElements.med_cmp.value = data.med_cmp;
            formElements.med_rne.value = data.med_rne;
            formElements.medTelfij.value = data.medTelfij;
            formElements.medcel.value = data.medcel;
            formElements.med_correo.value = data.med_correo;
            formElements.meddir.value = data.meddir;
            formElements.esp_id.value = data.esp_id;
        },
        error: function (xhr, status, error) {
            console.error('Error en la solicitud AJAX:', status, error);
            alert('Error al cargar los datos');
        }
    });
}
*/

function eliminarMed(dni) {

    med_id = parseInt(dni);
    $.ajax({
        url: '/deleteMed',
        method: "DELETE",
        data: {
            dni: dni,
        },
        success: function (med) {
            $('#modalFormmedico [data-dismiss="modal"]').trigger('click');
            const tbodymed = $('#bodymedicomodal');
            tbodymed.empty();
            mensaje(med[0].tipo, med[0].response, 1800);
        },
        error: function () {
            alert('error');
        }
    });

}
