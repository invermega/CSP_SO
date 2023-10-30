(function modal() {
    $('[data-toggle="modal"]').click(function () {
        ocultarTabla('tablecie10modal');
        var accion = $(this).data('accion');
        var cie10id = document.getElementById("cie10id");
        if (accion === '1cie10') {
            cie10id.textContent = '1cie10';
        } else if (accion === '2cie10') {
            cie10id.textContent = '2cie10';
        } else if (accion === '3cie10') {
            cie10id.textContent = '3cie10';
        }
    });
})();

document.getElementById("modalFormCIE10").addEventListener("keydown", function (event) {
    if (event.key === 'Enter') {
        mostrarDiv('cargacie10modal');
        ocultarTabla('tablecie10modal');
        let cie10modal = $('#cie10modal').val();
        let cie10id = $('#cie10id').text();
        event.preventDefault();
        $.ajax({
            url: '/cie10list',
            method: "GET",
            data: {
                cie10: cie10modal,
            },
            success: function (lista) {
                console.log(lista);
                ocultarDiv('cargacie10modal');
                mostrarTabla('tablecie10modal');
                let bodycie10modal = $('#bodycie10modal');
                bodycie10modal.html('');
                if (lista.length === 0) {
                    bodycie10modal.append(`
                        <tr>
                            <td colspan="3">No existe CIE 10 con el dato proporcionado</td>
                        </tr>
                        `);
                } else {
                    if (lista[0].icono === 'error') {
                    } else {
                        lista.forEach(list => {
                            bodycie10modal.append(`
                            <tr>
                            <td class="align-middle"><button class="btn btn-info btn-circle btn-sm" onclick="AgregarCie10(this,'${cie10id}')"><i class="fa-solid fa-plus"></i></button></td>
                            <td style="vertical-align: middle;" class="text-left">${list.diacod}</td>
                            <td style="vertical-align: middle;" class="text-left asignado">${list.diades}</td>
                            </tr>
                        `);
                        });
                    }
                    mensaje(lista[0].icono, lista[0].mensaje, 1500);
                }

            },
            error: function () { // Corregido: eliminé el parámetro "lista" innecesario
                alert('error');
            }
        });
    }
});

function AgregarCie10(btn, idbtn) {
    event.preventDefault();
    var filaOrigen = $(btn).closest("tr");
    var codemp = filaOrigen.find("td:eq(1)").text();
    var razsoc = filaOrigen.find("td:eq(2)").text();
    if (idbtn === '1cie10') {
        var codcie101 = document.getElementById("1codcie10");
        var codcie10desc1 = document.getElementById("1codcie10desc");
        codcie101.value = codemp;
        codcie10desc1.value = razsoc;
    } else if (idbtn === '2cie10') {
        var codcie102 = document.getElementById("2codcie10");
        var codcie10desc2 = document.getElementById("2codcie10desc");
        codcie102.value = codemp;
        codcie10desc2.value = razsoc;
    } else if (idbtn === '3cie10') {
        var codcie103 = document.getElementById("3codcie10");
        var codcie10desc3 = document.getElementById("3codcie10desc");
        codcie103.value = codemp;
        codcie10desc3.value = razsoc;
    }
    var btncerrar = document.getElementById(`cerrarcie10`);
    btncerrar.click();
}

function agregarEventListenerCie10(id, codDesc, codComen) {
    document.getElementById(id).addEventListener("keydown", function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            ObtenerCie10(id, codDesc, codComen);
        }
    });
}

agregarEventListenerCie10("1cie10", "1codcie10", "1codcie10desc");
agregarEventListenerCie10("2cie10", "2codcie10", "2codcie10desc");
agregarEventListenerCie10("3cie10", "3codcie10", "3codcie10desc");


function ObtenerCie10(id, cie10cod, cie10desc) {
    let cie10codigo = document.getElementById(`${cie10cod}`);
    let cie10descript = document.getElementById(`${cie10desc}`);
    let ids = document.getElementById(`${id}`).value;
    $.ajax({
        url: '/cie10',
        method: "GET",
        data: {
            cie10: ids,
        },
        success: function (lista) {
            if (lista.length === 0) {
                mensaje('error', 'CIE 10 no encontrado', 1500);
            } else {
                if (lista[0].icono === 'error') {
                } else {
                    cie10codigo.value = lista[0].diacod;
                    cie10descript.value = lista[0].diades;
                }
                mensaje(lista[0].icono, lista[0].mensaje, 1500);
            }


        },
        error: function () { // Corregido: eliminé el parámetro "lista" innecesario
            alert('error');
        }
    });
}

function limpiarCIE10(identificador) {
    var cie10codigo = document.getElementById(identificador + "codcie10");
    var cie10descript = document.getElementById(identificador + "codcie10desc");
    cie10codigo.value = "";
    cie10descript.value = "";
}

document.getElementById("limpiar1cie10").addEventListener("click", function () {
    limpiarCIE10("1");
});

document.getElementById("limpiar2cie10").addEventListener("click", function () {
    limpiarCIE10("2");
});

document.getElementById("limpiar3cie10").addEventListener("click", function () {
    limpiarCIE10("3");
});
