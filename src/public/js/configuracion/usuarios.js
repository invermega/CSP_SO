

$(document).ready(function () {
    getpermisos();
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
    let opc=0;
    let iduser = $('#iduser').val();
    
    let camposValidos = validarCampos();
    if (!camposValidos) {
        mensaje('error', 'Por favor, complete todos los campos.', 5500);
        return;
    }

    if(iduser==='0'){
        opc=0;//guardar
    }else{
        opc=1;//editar
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
            opc:opc,
            iduser:iduser,
        },
        success: function () {            
            getpermisos();
            limpiarinputs();
            activarCampo();
            $('input[type="text"]').val("");
            mensaje('success', 'Guardado correctamente', 5000);
        },
        error: function () {
            mensaje('error', 'Error al guardar, intente nuevamente', 5500);
        }
    });
}

document.getElementById("clientemodal").addEventListener("keyup", function (event) {
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
              <a  type="button" class="btn btn-circle btn-sm btn-info mr-1" onclick=resetearPass("${usuario.iduser}")><i class="fa-solid fa-street-view"></i></a>
              <button onclick=getusuariosm("${usuario.iduser}","${usuario.usuario}","${usuario.Nombres}","${usuario.app}","${usuario.apm}","${usuario.DNI}","${usuario.celular}","${usuario.fecnac}","${usuario.correo}","${usuario.direccion}","${usuario.codrol}","${usuario.sexo}") class="btn btn-circle btn-sm btn-warning mr-1"><i class="fa-regular fa-pen-to-square"></i></button>
              <a style="color:white" type="button" class="btn btn-circle btn-sm btn-danger mr-1" onclick=eliminarUser("${usuario.iduser}")><i class="fa-solid fa-trash-can"></i></a>
              </td>
            </tr>
          `);
            });

            mensaje('success', 'Accesos extraídos correctamente', 1000);
        },
        error: function () {
            alert('Error en la solicitud AJAX');
        },
    });
}
function resetearPass(iduser){
    iduser = parseInt(iduser);
    $.ajax({
        url: '/editarPass',
        method: "POST",
        data: {
            iduser: iduser,
        },
        success: function (user) {
            $('#modalFormusuario [data-dismiss="modal"]').trigger('click');
            const tbodyusu = $('#bodyususuariomodal');
            tbodyusu.empty();
            mensaje('success', 'Contraseña acualizada correctamente', 5000);
        },
        error: function () {
            alert('error');
        }
    });
}
function eliminarUser(iduser){
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
            mensaje('success', 'Usuario elimnado correctamente', 5000);
        },
        error: function () {
            alert('error');
        }
    });
}
function getusuariosm(iduserM,usuarioM,NombresM,appM,apmM,DNIM,celularM,fecnacM,correoM,direccionM,codrolM,sexoM) {
    let iduser = document.getElementById('iduser');
    iduser.value = iduserM;
    let usuario = document.getElementById('usuario');
    usuario.value = usuarioM;
    let Nombres = document.getElementById('Nombres');
    Nombres.value = NombresM;
    let app = document.getElementById('app');
    app.value = appM;
    let apm = document.getElementById('apm');
    apm.value = apmM;
    let DNI = document.getElementById('DNI');
    DNI.value = DNIM;
    let celular = document.getElementById('celular');
    celular.value = celularM;
    let fecnac = document.getElementById('fecnac');
    fecnac.value = fecnacM;
    let correo = document.getElementById('correo');
    correo.value = correoM;
    let direccion = document.getElementById('direccion');
    direccion.value = direccionM;
    let codrol = document.getElementById('codrol');
    codrol.value = codrolM;
    let sexo = document.getElementById('sexo');
    sexo.value = sexoM;
    let contrasena = document.getElementById('contrasena');
    contrasena.value = '123456789';
    contrasena.disabled = true;
    //$('#modalFormusuario').modal('hide');
    $('#modalFormusuario [data-dismiss="modal"]').trigger('click');
    mensaje('success', 'Usuario extraído correctamente', 1800);
}

function validarCampos() {
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
}

function activarCampo(){
    let contrasena = document.getElementById('contrasena');    
    contrasena.disabled = false;
}

