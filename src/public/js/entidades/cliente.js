
$(document).ready(function () {
    getPacienteCombos();
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const originalImage = new Image();
    let originalImageSrc = '../img/fondo.png'; // Almacena la URL de la imagen original

    originalImage.onload = function () {
        drawImageOnCanvas(originalImage);
    };
    originalImage.src = originalImageSrc; // Utiliza la URL almacenada

    // Función para cargar la imagen en el canvas y mostrarla como rectamgulo
    function drawImageOnCanvas(image) {
        const width = 400; // Ancho fijo para el canvas
        const height = 150; // Altura fija para el canvas
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

    const docideSelect = $('#docide');
    const numDocInput = $('#NumDoc');
    mascaraDocumentoIdentidad(docideSelect, numDocInput);

    $('#docide').on('change', function () {
        mascaraDocumentoIdentidad(docideSelect, numDocInput);
    }); 


    $("#celular").inputmask("999 999 999", {
        placeholder: "999 999 999",
        rightAlign: false,
    });
    $("#telefono").inputmask("999 9999", {
        placeholder: "999 9999",
        rightAlign: false
    });


    document.getElementById("clientemodal").addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            getcliente();
        }
    });

});

function getPacienteCombos() {
    $.ajax({
        url: '/listarCombosPac',
        success: function (lista) {
            let docident = $('#docide'); // Selecionar el select de tipo documento
            let forpa = $('#forpag_id');// Seleccionar el select de forma de pago
            docident.html('');
            forpa.html('');
            lista.forEach(item => {
                let option = `<option value="${item.id}">${item.descripcion}</option>`;
                if (item.tabla === 'documento_identidad') {
                    docident.append(option);
                } else if (item.tabla === 'formapago') {
                    forpa.append(option);
                }
            });
            $("#docide").val("06");
            $('#forpag_id').val("1");
        },
        error: function () {
            alert('error');
        }
    });
}

function getcliente() {
    var parametro = $("#clientemodal").val();
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
                        <td colspan="3" class="text-center">No hay resultados disponibles </td>
                    </tr>
                `);
            } else {
                clientes.forEach(cliente => {
                    tbodycli.append(`
            <tr>   
            <td>
            <button class="btn btn-info btn-circle btn-sm" onclick="getclientem('${cliente.docide}','${cliente.NumDoc}','${cliente.razsoc}','${cliente.actividad_economica}','${cliente.Direccion}','${cliente.contacto}','${cliente.emailcon}','${cliente.celular}','${cliente.telefono}','${cliente.emailmedocu}','${cliente.forpag_id}','${cliente.cadcermed}','${cliente.incfirmmedexa}','${cliente.Incfirpacexa}','${cliente.Inchuepacexa}','${cliente.incfordatper}','${cliente.incdecjur}','${cliente.incfirhueforadi}','${cliente.creusucatocu}','${cliente.Encorvctocert}','${cliente.encorvusuexi}','${cliente.notinfmed_medocu}','${cliente.notinfmedpac}')" class="btn btn-circle btn-sm "><i class="fa-regular fa-pen-to-square"></i></button>
            
            </td>  
              <td style="vertical-align: middle;" class="text-left">${cliente.NumDoc}</td>
              <td class="text-left">${cliente.razsoc}</td>    
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

function restablecerSeleccionPredeterminada() {
    var radios = document.querySelectorAll('.needs-validation input[type="radio"]');
    radios.forEach(function (radio) {
        // Comprueba si el botón de radio tiene un valor predeterminado definido
        if (radio.hasAttribute('data-valor-predeterminado')) {
            radio.checked = radio.getAttribute('data-valor-predeterminado') === 'true';
        }
    });
}

// Guarda los valores predeterminados al cargar la página 
var radios = document.querySelectorAll('.needs-validation input[type="radio"]');
radios.forEach(function (radio) {
    radio.setAttribute('data-valor-predeterminado', radio.checked);
});



var opc = 0;
function guardarcliente() {
    const canvas = document.getElementById('canvas');
    let cli_id = $('#cli_id').val();
    let camposValidoscli = validarFormulario('clientemodal,notinfmedpacS,notinfmedpacN,telefono ,emailcon,contacto, celular, emailmedocu,forpag_id, feccre, cadcermed, incfirmmedexa, Incfirpacexa, Inchuepacexa,Incfordatper, incdecjur, Incfirhueforadi, creusucatocu,encorvusuexi,Encorvctocert, notinfmed_medocu, notinfmedpac, actividad_economica,logo,file-input');
    if (!camposValidoscli) {
        return;
    }
    let razsoc = $('#razsoc');
    let docide = $('#docide');
    let NumDoc = $('#NumDoc');
    let Direccion = $('#Direccion');
    let telefono = $('#telefono').inputmask('unmaskedvalue');
    let emailcon = $('#emailcon');
    let contacto = $('#contacto');
    let celular = $('#celular').inputmask('unmaskedvalue');
    let emailmedocu = $('#emailmedocu');
    let forpag_id = $('#forpag_id');
    let feccre = $('#feccre');
    let actividad_economica = $('#actividad_economica');
    var piccli = canvas.toDataURL();

    var sip1 = document.getElementById("cadcermedS");
    var nop1 = document.getElementById("cadcermedN");
    let cadcermed;

    if (sip1.checked === true) {
        cadcermed = sip1.value;
    }
    if (nop1.checked === true) {
        cadcermed = nop1.value;
    }
    var sip2 = document.getElementById("incfirmmedexaS");
    var nop2 = document.getElementById("incfirmmedexaN");
    let incfirmmedexa;

    if (sip2.checked === true) {
        incfirmmedexa = sip2.value;
    }
    if (nop2.checked === true) {
        incfirmmedexa = nop2.value;
    }
    var sip3 = document.getElementById("IncfirpacexaS");
    var nop3 = document.getElementById("IncfirpacexaN");
    let Incfirpacexa;

    if (sip3.checked === true) {
        Incfirpacexa = sip3.value;
    }
    if (nop3.checked === true) {
        Incfirpacexa = nop3.value;
    }
    var sip4 = document.getElementById("InchuepacexaS");
    var nop4 = document.getElementById("InchuepacexaN");
    let Inchuepacexa;

    if (sip4.checked === true) {
        Inchuepacexa = sip4.value;
    }
    if (nop4.checked === true) {
        Inchuepacexa = nop4.value;
    }
    var sip5 = document.getElementById("IncfordatperS");
    var nop5 = document.getElementById("IncfordatperN");
    let Incfordatper;

    if (sip5.checked === true) {
        Incfordatper = sip5.value;
    }
    if (nop5.checked === true) {
        Incfordatper = nop5.value;
    }
    var sip6 = document.getElementById("incdecjurS");
    var nop6 = document.getElementById("incdecjurN");
    let incdecjur;

    if (sip6.checked === true) {
        incdecjur = sip6.value;
    }
    if (nop6.checked === true) {
        incdecjur = nop6.value;
    }
    var sip7 = document.getElementById("IncfirhueforadiS");
    var nop7 = document.getElementById("IncfirhueforadiN");
    let Incfirhueforadi;

    if (sip7.checked === true) {
        Incfirhueforadi = sip7.value;
    }
    if (nop7.checked === true) {
        Incfirhueforadi = nop7.value;
    }
    var sip8 = document.getElementById("creusucatocuS");
    var nop8 = document.getElementById("creusucatocuN");
    let creusucatocu;

    if (sip8.checked === true) {
        creusucatocu = sip8.value;
    }
    if (nop8.checked === true) {
        creusucatocu = nop8.value;
    }
    var sip9 = document.getElementById("EncorvctocertS");
    var nop9 = document.getElementById("EncorvctocertN");
    let Encorvctocert;

    if (sip9.checked === true) {
        Encorvctocert = sip9.value;
    }
    if (nop9.checked === true) {
        Encorvctocert = nop9.value;
    }
    var sip10 = document.getElementById("envcorusuexiS");
    var nop10 = document.getElementById("envcorusuexiN");
    let envcorusuexi;

    if (sip10.checked === true) {
        envcorusuexi = sip10.value;
    }
    if (nop10.checked === true) {
        envcorusuexi = nop10.value;
    }
    var sip11 = document.getElementById("notinfmed_medocuS");
    var nop11 = document.getElementById("notinfmed_medocuN");
    let notinfmed_medocu;

    if (sip11.checked === true) {
        notinfmed_medocu = sip11.value;
    }
    if (nop11.checked === true) {
        notinfmed_medocu = nop11.value;
    }
    var sip12 = document.getElementById("notinfmedpacS");
    var nop12 = document.getElementById("notinfmedpacN");
    let notinfmedpac;

    if (sip12.checked === true) {
        notinfmedpac = sip12.value;
    }
    if (nop12.checked === true) {
        notinfmedpac = nop12.value;
    }

    $.ajax({
        url: '/cliente',
        method: "POST",
        data: {

            razsoc: razsoc.val(),
            docide: docide.val(),
            NumDoc: NumDoc.val(),
            Direccion: Direccion.val(),
            telefono: telefono,
            emailcon: emailcon.val(),
            contacto: contacto.val(),
            celular: celular,
            emailmedocu: emailmedocu.val(),
            forpag_id: forpag_id.val(),
            feccre: feccre.val(),
            cadcermed: cadcermed,
            incfirmmedexa: incfirmmedexa,
            Incfirpacexa: Incfirpacexa,
            Inchuepacexa: Inchuepacexa,
            Incfordatper: Incfordatper,
            incdecjur: incdecjur,
            Incfirhueforadi: Incfirhueforadi,
            creusucatocu: creusucatocu,
            Encorvctocert: Encorvctocert,
            envcorusuexi: envcorusuexi,
            notinfmed_medocu: notinfmed_medocu,
            notinfmedpac: notinfmedpac,
            actividad_economica: actividad_economica.val(),
            opc: opc,
            cli_id: cli_id,
            piccli: piccli,
        },
        success: function (response) {
            if(response[0].tipo === 'success'){              

                mensaje(response[0].tipo, response[0].response, 1500);
            }else{
                mensaje(response[0].tipo, response[0].response, 1500);
            }
        },
        error: function () {
            mensaje('error', 'Error al guardar, intente nuevamente', 1500);
        }
    });
}

function getclientem(docideM, NumDocM, razsocM, actividad_economicaM, DireccionM, contactoM, emailconM, celularM, telefonoM, emailmedocuM, forpag_idM,) {
    opc = 1;
    $('#docide').val(docideM);
    $('#NumDoc').val(NumDocM);
    $('#razsoc').val(razsocM);
    $('#actividad_economica').val(actividad_economicaM);
    $('#Direccion').val(DireccionM);
    $('#contacto').val(contactoM);
    $('#emailcon').val(emailconM);
    $('#celular').val(celularM);
    $('#telefono').val(telefonoM);
    $('#emailmedocu').val(emailmedocuM);
    $('#forpag_id').val(forpag_idM);

    const canvas = $('#canvas')[0];
    const image = new Image();
    const context = canvas.getContext('2d');
    image.onload = function () {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);
    };
    image.src = `./img/cliente/${NumDocM}.webp`;

    $('#modalFormactcliente [data-dismiss="modal"]').trigger('click');
}



