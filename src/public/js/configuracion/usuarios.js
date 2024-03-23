$(document).ready(function () {
    getpermisos();
    // JavaScript
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const originalImage = new Image();
    let originalImageSrc = '../img/fondo.png'; // Almacena la URL de la imagen original

    originalImage.onload = function () {
        drawImageOnCanvas(originalImage);
    };
    originalImage.src = originalImageSrc; // Utiliza la URL almacenada

    // Función para cargar la imagen en el canvas y mostrarla como círculo
    function drawImageOnCanvas(image) {
        const size = 300; // Tamaño fijo para el canvas
        context.clearRect(0, 0, size, size);
        context.save();
        context.beginPath();
        context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        context.closePath();
        context.clip();
        context.drawImage(image, 0, 0, size, size);
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
function getpermisos() {
    $.ajax({
        url: '/listaroles',
        success: function (roles) {
            let select = $('#codrol'); // Selecionar el select por su id "codrol"

            select.html('');
            roles.forEach(rol => {
                select.append(`
            <option value="${rol.codrol}" id="${rol.codrol}">${rol.desrol}</option>
          `);
            });
        },
        error: function () {
            alert('error');
        }
    });
}


function guardarusuario() {
    var btnUsuario = document.getElementById("btnUsuario");
    btnUsuario.disabled = true;

    const canvas = document.getElementById('canvas');
    let opc = 0;
    let iduser = $('#iduser').val();
    let camposValidos = validarInputs('usuario,contrasena,Nombres,app,apm,DNI,celular,fecnac,correo,direccion,codrol,sexo');
    if (!camposValidos) {
        btnUsuario.disabled = false;
        return;
    }

    if (iduser === '0') {
        opc = 0;//guardar
    } else {
        opc = 1;//editar
    }
    let usuario = $('#usuario');
    let contrasena = $('#contrasena');
    let Nombres = $('#Nombres');
    let app = $('#app');
    let apm = $('#apm');
    let DNI = $('#DNI');
    let celular = $('#celular');
    let fecnac = $('#fecnac');
    let correo = $('#correo');
    let direccion = $('#direccion');
    let codrol = $('#codrol');
    let sexo = $('#sexo');
    let med_id = $('#med_id');
    var picuser = canvas.toDataURL();
    $.ajax({
        url: '/usuario',
        method: "POST",
        data: {
            usuario: usuario.val(),
            contrasena: contrasena.val(),
            Nombres: Nombres.val(),
            app: app.val(),
            apm: apm.val(),
            DNI: DNI.val(),
            celular: celular.val(),
            fecnac: fecnac.val(),
            correo: correo.val(),
            direccion: direccion.val(),
            codrol: codrol.val(),
            sexo: sexo.val(),
            opc: opc,
            iduser: iduser,
            picuser: picuser,
            med_id: med_id.val(),
        },
        success: function (response) {
            btnUsuario.disabled = false;
            if (response[0].response === 'success') {
                getpermisos();
                limpiarinputs();
                activarCampo();
                $('input[type="text"]').val("");
            }

            mensaje(response[0].tipo, response[0].response, 1500);
        },
        error: function () {
            btnUsuario.disabled = false;
            mensaje('error', 'Error al guardar, intente nuevamente', 1500);
        }
    });
}
document.getElementById("usuariomodal").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        var parametro = this.value;
        getusuarios(parametro);
    }
});
function getusuarios(parametro) {
    mostrarDiv('carga');
    ocultarDiv('tablaususuariomodal');
    $.ajax({
        url: '/listarusuarios',
        method: 'GET',
        data: {
            parametro: parametro,
        },
        success: function (usuarios) {

            ocultarDiv('carga');
            mostrarDiv('tablaususuariomodal');
            const tbodyusu = $('#bodyususuariomodal');
            tbodyusu.empty();
            usuarios.forEach(usuario => {
                tbodyusu.append(`
            <tr>             
              <td>${usuario.appm}</td>
              <td>${usuario.DNI}</td>
              <td>${usuario.usuario}</td>
              <td>
              <a  type="button" class="btn btn-circle btn-sm btn-info mr-1" onclick=resetearPass(${usuario.iduser},'${usuario.usuario}')><i class="fa-solid fa-street-view"></i></a>
              <button onclick="getusuariosm('${usuario.iduser}','${usuario.usuario}','${usuario.Nombres}','${usuario.app}','${usuario.apm}','${usuario.DNI}','${usuario.celular}','${usuario.fecnac}','${usuario.correo}','${usuario.direccion}','${usuario.codrol}','${usuario.sexo}',${usuario.med_id},'${usuario.medapmn}')" class="btn btn-circle btn-sm btn-info mr-1"><i class="fa-solid fa-plus"></i></button>
              <a style="color:white" type="button" class="btn btn-circle btn-sm btn-danger mr-1" onclick=eliminarUser("${usuario.iduser}")><i class="fa-solid fa-trash-can"></i></a>
              </td>
            </tr>
          `);
            });
            mensaje(usuarios[0].tipo, usuarios[0].response, 1500);

            //mensaje('success', 'Accesos extraídos correctamente', 1000);
        },
        error: function () {
            alert('Error en la solicitud AJAX');
        },
    });
}
function resetearPass(iduser, usuario) {
    iduser = parseInt(iduser);
    $.ajax({
        url: '/editarPass',
        method: "POST",
        data: {
            iduser: iduser,
            usuario: usuario,
        },
        success: function (user) {
            $('#modalFormusuario [data-dismiss="modal"]').trigger('click');
            const tbodyusu = $('#bodyususuariomodal');
            tbodyusu.empty();
            mensaje(user[0].tipo, user[0].response, 1800);
        },
        error: function () {
            alert('error');
        }
    });
}
function eliminarUser(iduser) {
    iduser = parseInt(iduser);
    $.ajax({
        url: '/deleteUser',
        method: "DELETE",
        data: {
            iduser: iduser,
        },
        success: function (user) {
            $('#modalFormusuario [data-dismiss="modal"]').trigger('click');
            const tbodyusu = $('#bodyususuariomodal');
            tbodyusu.empty();
            mensaje(user[0].tipo, user[0].response, 1800);
        },
        error: function () {
            alert('error');
        }
    });
}
function getusuariosm(iduserM, usuarioM, NombresM, appM, apmM, DNIM, celularM, fecnacM, correoM, direccionM, codrolM, sexoM, med_idM, medapmnM) {
    $('#iduser').val(iduserM);
    $('#usuario').val(usuarioM);
    $('#Nombres').val(NombresM);
    $('#app').val(appM);
    $('#apm').val(apmM);
    $('#DNI').val(DNIM);
    $('#celular').val(celularM);
    $('#fecnac').val(fecnacM);
    $('#correo').val(correoM);
    $('#direccion').val(direccionM);
    $('#codrol').val(codrolM);
    $('#sexo').val(sexoM);
    $('#contrasena').val('123456789').prop('disabled', true);
    $('#med_id').val(med_idM);
    $('#medapmn').val(medapmnM);
    const canvas = $('#canvas')[0];
    const image = new Image();
    const context = canvas.getContext('2d');
    image.onload = function () {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);
    };
    image.src = `./img/usuario/${DNIM}.webp`;

    var btncerrar = document.getElementById(`cerrarusuariomodal`);
    btncerrar.click();
}
/*function validarCampos() {
    let campos = ['#usuario', '#contrasena', '#Nombres', '#app', '#apm', '#DNI', '#celular', '#fecnac', '#correo', '#direccion', '#codrol', '#sexo'];
    let camposValidos = true;

    campos.forEach(function (campo) {
        let valor = $(campo).val();
        if (valor.trim() === '') {
            camposValidos = false;
            return false;
        }
    });

    return camposValidos;
}*/
function activarCampo() {
    let contrasena = document.getElementById('contrasena');
    contrasena.disabled = false;
    let iduser = document.getElementById('iduser');
    iduser.value = 0;
    $("#btnCita").prop("disabled", false);
}
function limpiarImputUser() {
    $('input').val('');
    $('textarea').val('');
    $("#btnCita").prop("disabled", false);
}
//BUSQUEDA MEDICO
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
