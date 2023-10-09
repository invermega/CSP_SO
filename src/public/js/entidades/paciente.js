$(document).ready(function () {
    getPacienteCombos();
    let idPais = document.getElementById('ippais');
    let nacionalidad = document.getElementById('nacionalidad');
    idPais.value = '9589';
    nacionalidad.value = 'PERÚ';
});

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
document.getElementById("distritomodal").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        var parametro = this.value;
        getDistrito(parametro);
    }
});
function getDistrito(parametro) {
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
                        <td colspan="2" class="text-center">No hay resultados disponibles a su búsqueda</td>
                    </tr>
                `);
            } else {
                response.forEach(lista => {
                    tbodydistrito.append(`
                    <tr>             
                    <td>${lista.desubigeo}</td>                        
                    <td>
                    <button onclick="event.preventDefault();getDistritoinput('${lista.cod_ubigeo}','${lista.desubigeo}')" class="btn btn-circle btn-sm btn-warning mr-1"><i class="fa-regular fa-pen-to-square"></i></button>
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
document.getElementById("paismodal").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        var parametro = this.value;
        getPais(parametro);
    }
});
function getPais(parametro) {
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
            response.forEach(lista => {
                tbodydistrito.append(`
                    <tr>             
                    <td>${lista.nacionalidad}</td>                        
                    <td>
                    <button onclick="event.preventDefault();getPaisinput('${lista.idPais}','${lista.nacionalidad}')" class="btn btn-circle btn-sm btn-warning mr-1"><i class="fa-regular fa-pen-to-square"></i></button>
                    </td>
                    </tr>
                `);
            });
            mensaje(response[0].tipo, response[0].response, 1000);
        },
        error: function () {
            alert('Error en la solicitud AJAX');
        },
    });
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

function guardarpaciente() {
    let pachis = $('#pachis');
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
    let foto = $('#foto');
    let huella = $('#huella');
    let firma = $('#firma');
    let sexo_id = $('#sexo_id');
    let grainst_id = $('#grainst_id');
    let estciv_id = $('#estciv_id');
    let codtipcon = $('#codtipcon');
    let ippais = $('#ippais');

    $.ajax({
        url: '/paciente',
        method: "POST",
        data: {
            pachis: pachis.val(),
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
            foto: foto.val(),
            huella: huella.val(),
            firma: firma.val(),
            sexo_id: sexo_id.val(),
            grainst_id: grainst_id.val(),
            estciv_id: estciv_id.val(),
            codtipcon: codtipcon.val(),
            ippais: ippais.val(),
        },
        success: function (response) {

            $('input[type="text"]').val("");
            mensaje(response[0].tipo, response[0].response, 5000);
        },
        error: function () {
            mensaje('error', 'Error al guardar, intente nuevamente', 5500);
        }
    });
}
function formatPhoneNumber(input) {
    var cleaned = input.value.replace(/\D/g, '').replace(/\s/g, '');
    var formatted = cleaned.replace(/(\d{3})(?=\d)/g, '$1 ');
    input.value = formatted;
}

function limpiarModal(){

}


