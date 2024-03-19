$(document).ready(function () {
    getPacienteCombos();
    let inputid = document.getElementById('inputid').value;
    if (inputid === '0') {
        let idPais = document.getElementById('ippais');
        let nacionalidad = document.getElementById('nacionalidad');
        idPais.value = '9589';
        nacionalidad.value = 'PERÚ';
        initializeCanvas('foto', '../img/logo.png');
        initializeCanvas('huella', '../img/logo.png');
        initializeCanvas('firma', '../img/logo.png');
    } else {
        getpacientes(inputid);
    }

    $('#numdoc').on('input', function () {
        if ($('#docide').val() === '01') {
            // Permitir solo números del 0 al 9
            $(this).val($(this).val().replace(/[^0-9]/g, ''));
        } else {

        }
    });


});
function getpacientes(id) {
    initializeCanvas('foto', '../img/logo.png');
    initializeCanvas('huella', '../img/logo.png');
    initializeCanvas('firma', '../img/logo.png');
    let parametro = id;
    let parametro1 = '';

    $.ajax({
        url: '/listarpacientes',
        method: 'GET',
        data: {
            parametro: parametro,
            parametro1: parametro1,
        },
        success: function (pacientes) {
            $('#docide').val(pacientes[0].docide);
            $('#numdoc').val(pacientes[0].numdoc);
            $('#pachis').val(pacientes[0].pachis);
            $('#nombres').val(pacientes[0].nombres);
            $('#appaterno').val(pacientes[0].appaterno);
            $('#apmaterno').val(pacientes[0].apmaterno);
            $('#sexo_id').val(pacientes[0].sexo_id);
            $('#grainst_id').val(pacientes[0].grainst_id);
            $('#estciv_id').val(pacientes[0].estciv_id);
            $('#codtipcon').val(pacientes[0].codtipcon);
            $('#cod_ubigeo').val(pacientes[0].cod_ubigeo);
            $('#des_ubigeo1').val(pacientes[0].des1);
            $('#fecnac').val(pacientes[0].fecnac);
            console.log(pacientes[0].ippais)
            $('#ippais').val(pacientes[0].ippais);
            $('#nacionalidad').val(pacientes[0].nacionalidad);
            $('#dirpac').val(pacientes[0].dirpac);
            $('#cod_ubigeo2').val(pacientes[0].cod_ubigeo2);
            $('#des_ubigeo2').val(pacientes[0].des2);
            $('#pcd').val(pacientes[0].pcd);
            $('#telefono').val(pacientes[0].telefono);
            $('#celular').val(pacientes[0].celular);
            $('#correo').val(pacientes[0].correo);
            $('#numhijos').val(pacientes[0].numhijos);
            $('#numdep').val(pacientes[0].numdep);
            cargarImagenEnCanvas('foto', './img/paciente/foto', pacientes[0].foto);
            cargarImagenEnCanvas('huella', './img/paciente/huella', pacientes[0].huella);
            cargarImagenEnCanvas('firma', './img/paciente/firma', pacientes[0].firma);
            mensaje(pacientes[0].tipo, pacientes[0].response, 1500)
        },
        error: function () {
            alert('Error en la solicitud AJAX');
        },
    });
}
function initializeCanvas(sectionId, originalImageSrc) {
    const canvas = document.getElementById(sectionId);
    const context = canvas.getContext('2d');
    const originalImage = new Image();

    originalImage.onload = function () {
        drawImageOnCanvas(originalImage);
    };

    originalImage.src = originalImageSrc;

    function drawImageOnCanvas(image) {
        const width = canvas.width;
        const height = canvas.height;
        context.clearRect(0, 0, width, height);
        context.drawImage(image, 0, 0, width, height);
    }

    function resetCanvasWithImage(imageSrc) {
        event.preventDefault();
        const image = new Image();
        image.onload = function () {
            drawImageOnCanvas(image);
            $(`#${sectionId}-reset-btn`).css('display', 'inline-block');
        };
        image.src = imageSrc;
    }

    $(`#${sectionId}-upload-btn`).on('click', function (event) {
        event.preventDefault();
        $(`#${sectionId}-file-input`).click();
    });

    $(`#${sectionId}-reset-btn`).on('click', function (event) {
        resetCanvasWithImage(originalImageSrc);
    });

    $(`#${sectionId}-file-input`).attr('accept', '.jpg, .jpeg, .png, .gif, .bmp, .svg').on('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const extension = file.name.split('.').pop().toLowerCase();
            if (!['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(extension)) {
                mensaje('error', 'El archivo seleccionado no es una imagen válida', 1500);
                $(this).val('');
                return;
            }
            const reader = new FileReader();
            reader.onload = function (e) {
                resetCanvasWithImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
}
function getPacienteCombos() {
    $.ajax({
        url: '/listarCombosPac',
        success: function (lista) {
            let docident = $('#docide'); // Selecionar el select de tipo documento
            let sexo = $('#sexo_id'); // Selecionar el select de sexo
            let gradoins = $('#grainst_id'); // Selecionar el select grado de inst
            let estciv = $('#estciv_id'); // Selecionar el select de estado civil
            let tipocontrato = $('#codtipcon'); // Selecionar el select tipo contrato
            docident.html('');
            sexo.html('');
            gradoins.html('');
            estciv.html('');
            tipocontrato.html('');
            lista.forEach(item => {
                let option = `<option value="${item.id}">${item.descripcion}</option>`;
                if (item.tabla === 'documento_identidad') {
                    docident.append(option);
                } else if (item.tabla === 'Sexo') {
                    sexo.append(option);
                } else if (item.tabla === 'grado_instruccion') {
                    gradoins.append(option);
                } else if (item.tabla === 'estado_civil') {
                    estciv.append(option);
                } else if (item.tabla === 'tipo_contrato_laboral') {
                    tipocontrato.append(option);
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
function searchDistrito() {
    let parametro = $('#distritomodal').val();
    mostrarDiv('cargadistrito');
    ocultarDiv('tabledistritomodal');
    $.ajax({
        url: '/listardistrito',
        method: 'GET',
        data: {
            parametro: parametro,
        },
        success: function (response) {
            ocultarDiv('cargadistrito');
            mostrarDiv('tabledistritomodal');
            const tbodydistrito = $('#bodyDistrio');
            tbodydistrito.empty();
            if (response.length === 0) {
                tbodydistrito.append(`
                    <tr>
                        <td colspan="2" class="text-center">No hay resultados disponibles </td>
                    </tr>
                `);
            } else {
                response.forEach(lista => {
                    tbodydistrito.append(`
                        <tr> 
                            <td>
                                <button onclick="event.preventDefault();getDistritoinput('${lista.cod_ubigeo}','${lista.desubigeo}')" class="btn btn-circle btn-sm btn-info mr-1"><i class="fa-solid fa-plus"></i></button>
                            </td>            
                            <td>${lista.desubigeo}</td>                  
                        </tr>
                    `);
                });
                mensaje(response[0].tipo, response[0].response, 1500);
            }
        },
        error: function () {
            alert('Error en la solicitud AJAX');
        },
    });
}

document.getElementById("distritomodal").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        searchDistrito();
    }
});

var searchButton = document.getElementById('searchDistrito');
searchButton.addEventListener('click', function (event) {
    event.preventDefault();
    searchDistrito();
});
var codigoDistrito = 0;
var btnDistrito1 = document.getElementById('btnDistrito1');
btnDistrito1.addEventListener('click', function (event) {
    event.preventDefault();
    codigoDistrito = 1;
});
var btnDistrito2 = document.getElementById('btnDistrito2');
btnDistrito2.addEventListener('click', function (event) {
    event.preventDefault();
    codigoDistrito = 2;
});
function getDistritoinput(codigo, descripcion) {
    let cod_ubigeo = document.getElementById('cod_ubigeo');
    let cod_ubigeo2 = document.getElementById('cod_ubigeo2');
    if (codigoDistrito === 1) {
        cod_ubigeo.value = codigo;
    } else {
        cod_ubigeo2.value = codigo
    }
    let des_ubigeo1 = document.getElementById('des_ubigeo1');
    let des_ubigeo2 = document.getElementById('des_ubigeo2');
    if (codigoDistrito === 1) {
        des_ubigeo1.value = descripcion;
    } else {
        des_ubigeo2.value = descripcion;
    }
    codigoDistrito = 0;
    $('#modalFormDistrito [data-dismiss="modal"]').trigger('click');
}

/*Busqueda de Pais */
document.getElementById("paismodal").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        searchPais();
    }
});

var searchButton = document.getElementById('searchPais');
searchButton.addEventListener('click', function (event) {
    event.preventDefault();
    searchPais();
});

function searchPais() {
    var parametro = $('#paismodal').val();
    mostrarDiv('cargapais');
    ocultarDiv('tablepaismodal');
    $.ajax({
        url: '/listarpais',
        method: 'GET',
        data: {
            parametro: parametro,
        },
        success: function (response) {
            ocultarDiv('cargapais');
            mostrarDiv('tablepaismodal');
            const tbodydistrito = $('#bodypais');
            tbodydistrito.empty();
            if (response.length === 0) {
                tbodydistrito.append(`
                    <tr>
                        <td colspan="2" class="text-center">No hay resultados disponibles</td>
                    </tr>
                `);
            } else {
                response.forEach(lista => {
                    tbodydistrito.append(`
                        <tr>
                            <td>
                                <button onclick="event.preventDefault();getPaisinput('${lista.idPais}','${lista.nacionalidad}')" class="btn btn-circle btn-sm btn-info mr-1"><i class="fa-solid fa-plus"></i></button>
                            </td>
                            <td>${lista.nacionalidad}</td>                    
                        </tr>
                    `);
                });
                mensaje(response[0].tipo, response[0].response, 1500);
            }
        },
        error: function () {
            alert('Error en la solicitud AJAX');
        },
    });
}
function getPais(parametro) {

}
function getPaisinput(codigo, descripcion) {
    let idPais = document.getElementById('ippais');
    let nacionalidad = document.getElementById('nacionalidad');
    idPais.value = codigo;
    nacionalidad.value = descripcion;
    $('#modalFormPais [data-dismiss="modal"]').trigger('click');
}

function limpiarModal() {
    $('#distritomodal').val('');
    const tbodydistrito = $('#bodyDistrio');
    tbodydistrito.empty();
    const tbodypais = $('#bodyPais');
    tbodypais.empty();
}

function Grabar() {
    var btnGrabar = document.getElementById("btnGrabar");
    btnGrabar.disabled = true;
    let appaterno = $('#appaterno');
    let apmaterno = $('#apmaterno');
    let nombres = $('#nombres');
    let fecnac = $('#fecnac');
    let cod_ubigeo = $('#cod_ubigeo');
    let docide = $('#docide');
    let numdoc = $('#numdoc');
    let dirpac = $('#dirpac');
    let cod_ubigeo2 = $('#cod_ubigeo2');
    let correo = $('#correo');
    let telefono = $('#telefono');
    let celular = $('#celular');
    let numhijos = $('#numhijos');
    let numdep = $('#numdep');
    let pcd = $('#pcd');
    const canvasfoto = document.getElementById('foto');
    const canvashuella = document.getElementById('huella');
    const canvasfirma = document.getElementById('firma');
    var foto = canvasfoto.toDataURL();
    var huella = canvashuella.toDataURL();
    var firma = canvasfirma.toDataURL();
    let sexo_id = $('#sexo_id');
    let grainst_id = $('#grainst_id');
    let estciv_id = $('#estciv_id');
    let codtipcon = $('#codtipcon');
    let ippais = $('#ippais');
    let inputid = $('#inputid');
    var validar = validarFormulario2('appaterno,apmaterno,nombres,fecnac,cod_ubigeo,docide,numdoc,dirpac,cod_ubigeo2,correo,telefono,celular,numhijos,numdep,pcd,sexo_id,grainst_id,estciv_id,codtipcon,ippais');
    if (!validar) {
        btnGrabar.disabled = false;
        return;
    }
    $.ajax({
        url: '/paciente',
        method: "POST",
        data: {
            appaterno: appaterno.val(),
            apmaterno: apmaterno.val(),
            nombres: nombres.val(),
            fecnac: fecnac.val(),
            cod_ubigeo: cod_ubigeo.val(),
            docide: docide.val(),
            fecnac: fecnac.val(),
            numdoc: numdoc.val(),
            dirpac: dirpac.val(),
            cod_ubigeo2: cod_ubigeo2.val(),
            correo: correo.val(),
            telefono: telefono.val(),
            celular: celular.val(),
            numhijos: numhijos.val(),
            numdep: numdep.val(),
            pcd: pcd.val(),
            foto: foto,
            huella: huella,
            firma: firma,
            sexo_id: sexo_id.val(),
            grainst_id: grainst_id.val(),
            estciv_id: estciv_id.val(),
            codtipcon: codtipcon.val(),
            ippais: ippais.val(),
            inputid: inputid.val(),
        },
        success: function (response) {
            btnGrabar.disabled = false;
            //$('input[type="text"]').val("");
            if (response[0].tipo === 'success') {
                MensajeSIyNO(response[0].tipo, response[0].mensaje, '¿Desea volver?', function (respuesta) {
                    if (respuesta) {
                        $('input[type="text"]').val("");
                        rendersub('/paciente');
                    } else {
                        if (response[0].tipo === "success") {
                            
                        }
                        return;
                    }
                });
            } else {
                btnCita.disabled = false;
                mensaje(response[0].tipo, response[0].mensaje, 1500);
            }
        },
        error: function () {
            btnGrabar.disabled = false;
            mensaje('error', response[0].mensaje, 1500);
        }
    });
}
function cargarImagenEnCanvas(canvasId, ruta, nombre) {
    if (nombre !== '') {
        const canvas = $(`#${canvasId}`)[0];
        const context = canvas.getContext('2d');
        const image = new Image();

        image.onload = function () {
            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(image, 0, 0);
        };

        image.src = `${ruta}/${nombre}`;
    } else {
        initializeCanvas(`${canvasId}`, '../img/logo.png');

    }
}