function ObtenerParametros() {
    let codpru_id = document.getElementById('codpru_id').value;
    let nuncom = document.getElementById('nuncom').value;
    ocultarTabla("tablaparametros");
    mostrarDiv("cargaparametros");
    $.ajax({
        url: '/parametrosespiro',
        method: "GET",
        data: {
            codpru_id: codpru_id,
            nuncom: nuncom
        },
        success: function (parametros) {
            ocultarDiv("cargaparametros");
            mostrarTabla("tablaparametros");
            let tbody = $('#tbodyparametros');
            tbody.html('');
            parametros.forEach(parametro => {
                if (parametro.statitulo === 'V') {
                    tbody.append(`
                    <tr >
                        <td class="text-left align-middle px-3" >${parametro.despar}</td>
                        <td class="text-left align-middle px-3" >${parametro.unidad} <input style="display:none"  type="text" value="${parametro.parexa_id}" data-column="parexa_id"></td>
                        <td style="padding-bottom: 0px; padding-top: 0px; vertical-align: middle;">  <input style="height: 25px;" type="text" class="form-control " value="${parametro.valor_ref}" data-column="valor_ref"></td>
                        <td style="padding-bottom: 0px; padding-top: 0px; vertical-align: middle;"><input style="height: 25px;" type="text" class="form-control" value="${parametro.mejor_valor}" data-column="mejor_valor"></td>
                        <td style="padding-bottom: 0px; padding-top: 0px; vertical-align: middle;"><input style="height: 25px;" type="text" class="form-control " value="${parametro.Mejor_val_porc}" data-column="Mejor_val_porc"></td>
                        <td style="padding-bottom: 0px; padding-top: 0px; vertical-align: middle;"><input style="height: 25px;" type="text" class="form-control " value="${parametro.valor_pre1}" data-column="valor_pre1"></td>
                        <td style="padding-bottom: 0px; padding-top: 0px; vertical-align: middle;"><input style="height: 25px;" type="text" class="form-control " value="${parametro.valor_pre2}" data-column="valor_pre2"</td>
                        <td style="padding-bottom: 0px; padding-top: 0px; vertical-align: middle;"><input style="height: 25px;" type="text" class="form-control " value="${parametro.valor_pre3}" data-column="valor_pre3"</td>
                    </tr>`)
                } else {
                    tbody.append(`
                    <tr>
                        <td colspan="4" class="text-left align-middle px-2" style="font-weight: bold; background-color:#DADADA" >${parametro.despar}</td>
                    </tr>
                    `)
                }
            });
            $('#tableparametros tbody tr').each(function () {
                $(this).find('td').each(function (index) {
                    // Aplica el inputmask a las columnas 3, 4, 6, 7 y 8
                    if (index === 2 || index === 3 || index === 5 || index === 6 || index === 7) {
                        $(this).find('input').inputmask("currency", {
                            radixPoint: '.',
                            inputtype: "text",
                            allowMinus: false,
                            autoUnmask: true,
                            placeholder: "00.00",
                            showMaskOnHover: true,
                            scale: 3,
                        });
                    }
                });
            });
            $('#tableparametros tbody tr').each(function () {
                $(this).find('td').each(function (index) {
                    if (index === 4) {
                        $(this).find('input').inputmask("integer", {
                            radixPoint: '.',
                            inputtype: "text",
                            allowMinus: false,
                            autoUnmask: true,
                            placeholder: "0",
                            showMaskOnHover: true,
                            scale: 0,
                        });
                    }
                });
            });
            if (nuncom !== '0') {
                var std_fuma = $('#std_fuma');
                std_fuma.val(parametros[0].std_fuma);
                var Calidad = $('#Calidad');
                Calidad.val(parametros[0].Calidad);
                
                let conclusionResult = parametros[0].conclusion;
                conclusionResult = conclusionResult.replace(/\s*-\s*/, '-');
                let [tipo, conclusionInput] = conclusionResult.split('-');
                document.getElementById('tipo').value = tipo;
                var conclusionDiv = $('#conclusionDiv');
                conclusionDiv.hide();
                if (tipo !== 'NORMAL') {
                    conclusionDiv.show();
                    document.getElementById('conclusion').value = conclusionInput ? conclusionInput : '';
                }
            }
        },
        error: function () {
            $('#error-message').text('Se produjo un error al cargar los protocolos.');
        }
    });
};
//
function obtenerDataParametros() {
    var table = document.getElementById('tableparametros');
    var rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    var data = [];
    var codpru_id = document.getElementById('codpru_id').value;
    var std_fuma = document.getElementById('std_fuma').value;
    var Calidad = document.getElementById('Calidad').value;
    let tipo = document.getElementById('tipo').value;
    let conclusionInput = document.getElementById('conclusion').value;
    let conclusion = '';
    if (tipo === 'NORMAL') {
        conclusion = tipo;
    } else {
        conclusion = tipo + ' - ' + conclusionInput;
    }
    for (var i = 0; i < rows.length; i++) {
        var input = rows[i].getElementsByTagName('input');
        if (input.length >= 6) {
            var parexa_id = input[0].value;
            var valor_ref = input[1].value;
            var mejor_valor = input[2].value;
            var Mejor_val_porc = input[3].value;
            var valor_pre1 = input[4].value;
            var valor_pre2 = input[5].value;
            var valor_pre3 = input[6].value;

            var rowData = {
                parexa_id: parexa_id,
                codpru_id: codpru_id,
                valor_ref: valor_ref,
                mejor_valor: mejor_valor,
                Mejor_val_porc: Mejor_val_porc,
                valor_pre1: valor_pre1,
                valor_pre2: valor_pre2,
                valor_pre3: valor_pre3,
                Calidad: Calidad,
                conclusion: conclusion,
                std_fuma: std_fuma
            };
            data.push(rowData);
        } else {
            console.log('Fila ' + (i + 1) + ' no tiene suficientes elementos input. Se ignorará.');
        }
    }
    return data;
}

function Grabar() {
    let btnGrabar = document.getElementById('btnGrabar');
    btnGrabar.disabled = true;
    btnGrabar.innerHTML = `<lottie-player src="/img/jsonimg/btnloading.json" background="transparent"
                                    speed="1" style="width: 38px; height: 35px;" loop
                                    autoplay></lottie-player>`

    let cita_id = document.getElementById('id').value;
    let nuncom = document.getElementById('nuncom').value;
    let soexa = document.getElementById('soexa').value;
    let codpru_id = document.getElementById('codpru_id').value;
    let doc_adic_id = document.getElementById('doc_adic_id').value;
    var datains = obtenerDataIns();
    var datainsrec = obtenerDataInsRec();
    var dataparametros = obtenerDataParametros();
    const datosCompletos = {
        cita_id: cita_id,
        nuncom: nuncom,
        soexa: soexa,
        codpru_id: codpru_id,
        doc_adic_id: doc_adic_id,
        datains: datains,
        datainsrec: datainsrec,
        dataparametros: dataparametros
    };

    fetch('/pbespirometria', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosCompletos)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            return response.json();
        })
        .then(data => {
            mensaje(data[0].icono, data[0].mensaje, 1500);
            let nuncom = document.getElementById('nuncom');
            nuncom.value = data[0].nuncom;
            btnGrabar.disabled = false;
            btnGrabar.innerHTML = `<i class="fa-regular fa-floppy-disk" style="margin: 8px 12px;"></i>`
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
(function poblarcampos() {
    ocultarConclusionEspiro();
    let cita_id = document.getElementById('id').value;
    let soexa = document.getElementById('soexa').value;
    let nuncom = document.getElementById('nuncom');
    let doc_adic_id = document.getElementById('doc_adic_id');

    let codcie101 = document.getElementById('1codcie10');
    let codcie10desc1 = document.getElementById('1codcie10desc');
    let codcie10comen1 = document.getElementById('1codcie10comen');
    let codcie102 = document.getElementById('2codcie10');
    let codcie10desc2 = document.getElementById('2codcie10desc');
    let codcie10comen2 = document.getElementById('2codcie10comen');
    let codcie103 = document.getElementById('3codcie10');
    let codcie10desc3 = document.getElementById('3codcie10desc');
    let codcie10comen3 = document.getElementById('3codcie10comen');

    let recomendacion1 = document.getElementById('recomendacion1');
    let control1 = document.getElementById('control1');
    let recomendacion2 = document.getElementById('recomendacion2');
    let control2 = document.getElementById('control2');
    let recomendacion3 = document.getElementById('recomendacion3');
    let control3 = document.getElementById('control3');
    $.ajax({
        url: '/resultespirometria',
        method: "GET",
        data: {
            cita_id: cita_id,
            soexa: soexa
        },
        success: function (result) {

            if (result[0].mensaje != 'sin datos') {
                nuncom.value = result[0].nuncom;
                doc_adic_id.value = result[0].doc_adic_id;
                if (result[0].doc_adic_id != '0') {
                    resultcrearMiniatura(result[0].rutarch, result[0].nomarch);
                }
                if (result[0].diagnosticos) {
                    let diagnosticosArray = JSON.parse(result[0].diagnosticos);
                    for (let i = 0; i < diagnosticosArray.length && i < 3; i++) {
                        let registro = diagnosticosArray[i];
                        let codigo = registro.diacod;
                        let descripcion = registro.diades;
                        let comentario = registro.obs;
                        let combo = registro.tipdia;

                        if (i === 0) {
                            codcie101.value = codigo;
                            codcie10desc1.value = descripcion;
                            combocie101.value = combo;
                            codcie10comen1.value = comentario;
                        } else if (i === 1) {
                            codcie102.value = codigo;
                            codcie10desc2.value = descripcion;
                            combocie102.value = combo;
                            codcie10comen2.value = comentario;
                        } else if (i === 2) {
                            codcie103.value = codigo;
                            codcie10desc3.value = descripcion;
                            combocie103.value = combo;
                            codcie10comen3.value = comentario;
                        }
                    }
                }
                if (result[0].recomendaciones) {
                    let recomendacionArray = JSON.parse(result[0].recomendaciones);
                    for (let i = 0; i < recomendacionArray.length && i < 3; i++) {
                        let registro = recomendacionArray[i];
                        let desrec = registro.desrec;
                        let des_control = registro.des_control;

                        if (i === 0) {
                            recomendacion1.value = desrec;
                            control1.value = des_control;
                        } else if (i === 1) {
                            recomendacion2.value = desrec;
                            control2.value = des_control;
                        } else if (i === 2) {
                            recomendacion3.value = desrec;
                            control3.value = des_control;
                        }
                    }
                }


            }
            ObtenerParametros();
        },
        error: function (Examenes) {
            alert('error');
        }
    });
})();

function ocultarConclusionEspiro() {
    var conclusionDiv = $('#conclusionDiv');
    conclusionDiv.hide();
    var tipo = $('#tipo');
    $('#tipo').on('change', function () {
        conclusionDiv.toggle($('#tipo').val() !== 'NORMAL');        
    });
}