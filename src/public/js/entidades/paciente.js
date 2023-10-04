$(document).ready(function () {
    getPacienteCombos();
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
            mensaje(response[0].tipo, response[0].response, 1000);
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
    limpiarModal();
    codigoDistrito = 1;    
});
var btnDistrito2 = document.getElementById('btnDistrito2');
btnDistrito2.addEventListener('click', function (event) {
    event.preventDefault();
    limpiarModal();
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

function limpiarModal() {    
    $('#distritomodal').val('');
    const tbodydistrito = $('#bodyDistrio');
    tbodydistrito.empty();
    const tbodypais = $('#bodyPais');
    tbodypais.empty();
}
