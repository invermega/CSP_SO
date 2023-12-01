$(document).ready(function () {
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
        event.preventDefault();
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

function getmedico(id) {
    let opc =1;
    $.ajax({
        url: '/listarmedicos',
        method: "GET",
        data: {
            parametro:id,
            opc: opc
        },
        success: function (medicos) {
            $('#medap').val(medicos[0].medap);
            $('#medam').val(medicos[0].medam);
            $('#mednam').val(medicos[0].mednam);
            $('#docide').val(medicos[0].docide);
            $('#nundoc').val(medicos[0].nundoc);
            $('#med_cmp').val(medicos[0].med_cmp);
            $('#med_rne').val(medicos[0].med_rne);
            $('#medTelfij').val(medicos[0].medTelfij);
            $('#medcel').val(medicos[0].medcel);
            $('#med_correo').val(medicos[0].med_correo);
            $('#meddir').val(medicos[0].meddir);
            $('#med_firma').val(medicos[0].med_firma);
            $('#esp_id').val(medicos[0].esp_id);

            mensaje(medicos[0].tipo, medicos[0].response, 1500)
            
        },
        
        error: function () {
            alert('Error en la solicitud AJAX');
        },
    });
}

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
            const id=document.getElementById("inputid").value;
            if (id === "0") {
                $("#docide").val("01");
                $('#esp_id').val("2");
            } else {
                getmedico(id);
            }
        },
        error: function () {
            alert('error');
        }
    });
}

function guardarmedico() {
    const canvas = document.getElementById('canvas');
    let camposValidosmed = validarFormulario('file-input,docide,med_cmp,medcel,medTelfij,med_correo,meddir,esp_id,med_rne,medicomodal');
    if (!camposValidosmed) {
        return;
    }
    let inputid = $('#inputid');
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
            inputid: inputid.val(),
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
            picmed: picmed,
        },
        success: function (response) {
            opc = 0;
            if (response[0].icono === 'success') {
                MensajeSIyNO(response[0].icono, response[0].mensaje, '¿Desea volver?', function (respuesta) {
                    if (respuesta) {
                        $('input[type="text"]').val("");
                        rendersub('/medico');
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
        },
        error: function () {
            mensaje('error', 'Error al guardar, intente nuevamente', 1500);
        }
    });
}
