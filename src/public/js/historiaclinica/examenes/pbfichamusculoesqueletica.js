
(function poblarcampos() {

    let cita_id = document.getElementById('id').value;
    let soexa = document.getElementById('soexa').value;
    let nuncom = document.getElementById('nuncom');

    let aptitud_espaldainput = document.getElementById('aptitud_espalda');

    let abdomen = document.getElementById('abdomen');
    let obsAbdomen = document.getElementById('obsAbdomen');
    let cadera = document.getElementById('cadera');
    let obsCadera = document.getElementById('obsCadera');
    let muslo = document.getElementById('muslo');
    let obsMuslo = document.getElementById('obsMuslo');
    let adlateral = document.getElementById('adlateral');
    let obsAdlateral = document.getElementById('obsAdlateral');

    let abduccionh = document.getElementById('abduccionh');
    let abduccion80h = document.getElementById('abduccion80h');
    let rotacionext = document.getElementById('rotacionext');
    let rotacionint = document.getElementById('rotacionint');

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
    //var flex_fuerza = obtenerDataTFlex();
    //var rangos_articulares = obtenerDataTRang();
    $.ajax({
        url: '/resultfichamusculoesqueletica',
        method: "GET",
        data: {
            cita_id: cita_id,
            soexa: soexa
        },
        success: function (result) {
            if (result[0].mensaje != 'sin datos') {
                nuncom.value = result[0].nuncom;
                aptitud_espaldainput.value = result[0].aptitud_espalda;
                if (result[0].flex_fuerza) {
                    let flex_fuerzaArray = JSON.parse(result[0].flex_fuerza);
                    for (let i = 0; i < flex_fuerzaArray.length && i < 4; i++) {
                        let registro = flex_fuerzaArray[i];
                        let tipo = registro.tipo;
                        let valor = registro.valor;
                        let observacion = registro.observacion;
                        if (tipo === 'Abdomen') {
                            $('input[name="abdomen"][value="' + valor + '"]').prop('checked', true);
                            abdomen.value = valor;
                            obsAbdomen.value = observacion;
                        } else if (tipo === 'Cadera') {
                            $('input[name="cadera"][value="' + valor + '"]').prop('checked', true);
                            cadera.value = valor;
                            obsCadera.value = observacion;
                        } else if (tipo === 'Muslo') {
                            $('input[name="muslo"][value="' + valor + '"]').prop('checked', true);
                            muslo.value = valor;
                            obsMuslo.value = observacion;
                        } else if (tipo === 'Abdomen Lateral') {
                            $('input[name="adlateral"][value="' + valor + '"]').prop('checked', true);
                            adlateral.value = valor;
                            obsAdlateral.value = observacion;
                        }
                    }
                }
                if (result[0].flex_fuerza) {
                    let rangos_articularesArray = JSON.parse(result[0].rangos_articulares);
                    for (let i = 0; i < rangos_articularesArray.length && i < 4; i++) {
                        let registro = rangos_articularesArray[i];
                        let tipo = registro.tipo;
                        let valor = registro.valor;
                        let pregunta = registro.pregunta;
                        if (tipo === 'Abduccion de hombro (Normal 0° - 180°)') {
                            $('input[name="abduccionh"][value="' + valor + '"]').prop('checked', true);
                            abduccionh.value = valor;
                            $('input[name="cmbabduccionh"][value="' + pregunta + '"]').prop('checked', true);
                        } else if (tipo === 'Abduccion de hombro (0° - 80°)') {
                            $('input[name="abduccion80h"][value="' + valor + '"]').prop('checked', true);
                            abduccion80h.value = valor;
                            $('input[name="cmbabduccion80h"][value="' + pregunta + '"]').prop('checked', true);
                        } else if (tipo === 'Rotacion externa (0° - 90°)') {
                            $('input[name="rotacionext"][value="' + valor + '"]').prop('checked', true);
                            rotacionext.value = valor;
                            $('input[name="cmbrotacionext"][value="' + pregunta + '"]').prop('checked', true);
                        } else if (tipo === 'Rotacion interna de hombro') {
                            $('input[name="rotacionint"][value="' + valor + '"]').prop('checked', true);
                            rotacionint.value = valor;
                            $('input[name="cmbrotacionint"][value="' + pregunta + '"]').prop('checked', true);
                        }
                    }
                }
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

                        if (i === 0) {
                            codcie101.value = codigo;
                            codcie10desc1.value = descripcion;
                            codcie10comen1.value = comentario;
                        } else if (i === 1) {
                            codcie102.value = codigo;
                            codcie10desc2.value = descripcion;
                            codcie10comen2.value = comentario;
                        } else if (i === 2) {
                            codcie103.value = codigo;
                            codcie10desc3.value = descripcion;
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
            calctablaFlexFuerza();
            calctablaRangosArt();
        },
        error: function (Examenes) {
            alert('error');
        }
    });
})();
function calctablaFlexFuerza() {
    const textInputs = $('#tablaFlexFuerza input[type="text"][id^="abdomen"], input[type="text"][id^="cadera"], input[type="text"][id^="muslo"], input[type="text"][id^="adlateral');
    const radioButtons2 = $('input[type="radio"][name^="abdomen"], input[type="radio"][name^="cadera"], input[type="radio"][name^="muslo"], input[type="radio"][name^="adlateral"]');
    const radioButtonTab1 = $('#tablaFlexFuerza input[type="radio"][value="1"]');
    function calcularTotal() {
        let total = 0;
        textInputs.each(function () {
            total += parseInt($(this).val()) || 0;
        });
        $('#totalFlexFuerza').val(total);
    }
    radioButtons2.on('change', function () {
        const tr = $(this).closest('tr');
        const input = tr.find('input[type="text"]');

        if (input.length) {
            input.val($(this).val());
        }
        calcularTotal();
    });
    if (document.getElementById('nuncom').value === '0') {
        radioButtonTab1.prop('checked', true);
        radioButtonTab1.closest('tr').find('input[type="text"]').val('1');
    }
    calcularTotal();
}
function calctablaRangosArt() {
    const textInputs = $('#tablaRangosArt input[type="text"][id^="abduccionh"], input[type="text"][id^="abduccion80h"], input[type="text"][id^="rotacionext"], input[type="text"][id^="rotacionint"]');
    const radioButtons2 = $('input[type="radio"][name^="abduccionh"], input[type="radio"][name^="abduccion80h"], input[type="radio"][name^="rotacionext"], input[type="radio"][name^="rotacionint"]');
    const radioButtonTab1 = $('#tablaRangosArt input[type="radio"][value="1"]');
    const radioTab1 = $('#tablaRangosArt input[type="radio"][value="NO"]');
    function calcularTotal() {
        let total = 0;
        textInputs.each(function () {
            total += parseInt($(this).val()) || 0;
        });
        $('#totalRangosArt').val(total);
    }

    radioButtons2.on('change', function () {
        const tr = $(this).closest('tr');
        const input = tr.find('input[type="text"]');

        if (input.length) {
            input.val($(this).val());
        }

        calcularTotal();
    });

    if (document.getElementById('nuncom').value === '0') {
        radioButtonTab1.prop('checked', true);
        radioTab1.prop('checked', true);
        radioButtonTab1.closest('tr').find('input[type="text"]').val('1');
    }

    calcularTotal();
}
function obtenerDataTFlex() {
    var table = document.getElementById('tablaFlexFuerza');
    var rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    var datains = [];
    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName('td');
        if (cells.length >= 4) {
            var tipo = cells[0].querySelector('label').innerText;
            var valor = cells[5].querySelector('input[type="text"]').value;
            var observacion = cells[6].querySelector('textarea').value;
            var rowData = {
                tipo: tipo,
                valor: valor,
                observacion: observacion
            };
            datains.push(rowData);
        }
    }
    return datains;
}
function obtenerDataTRang() {
    var table = document.getElementById('tablaRangosArt');
    var rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    var datains = [];
    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName('td');
        if (cells.length >= 4) {
            var tipo = cells[0].querySelector('label').innerText;
            var valor = cells[4].querySelector('input[type="text"]').value;
            var radioSI = cells[5].querySelector('input[type="radio"][value="SI"]:checked');
            var radioNO = cells[6].querySelector('input[type="radio"][value="NO"]:checked');
            var pregunta = radioSI ? radioSI.value : (radioNO ? radioNO.value : '');
            var rowData = {
                tipo: tipo,
                valor: valor,
                pregunta: pregunta
            };
            datains.push(rowData);
        }
    }
    return datains;
}
function Grabar() {
    let btnGrabar = document.getElementById('btnGrabar');
    btnGrabar.disabled = true;
    btnGrabar.innerHTML = `<lottie-player src="/img/jsonimg/btnloading.json" background="transparent"
                                    speed="1" style="width: 38px; height: 35px;" loop
                                    autoplay></lottie-player>`;

    let cita_id = document.getElementById('id').value;
    let nuncom = document.getElementById('nuncom').value;
    let soexa = document.getElementById('soexa').value;
    let codpru_id = document.getElementById('codpru_id').value;
    let doc_adic_id = document.getElementById('doc_adic_id').value;
    var datains = obtenerDataIns();
    var datainsrec = obtenerDataInsRec();

    let aptitud_espalda = document.getElementById('aptitud_espalda').value;
    var flex_fuerza = obtenerDataTFlex();
    var rangos_articulares = obtenerDataTRang();

    let incluirIds = 'aptitud_espalda';
    validarFormulario2(incluirIds);
    if (!aptitud_espalda) {
        btnGrabar.disabled = false;
        mensaje('error', 'Por favor, complete todos los campos antes de continuar.', 1500);
        btnGrabar.innerHTML = `<i class="fa-regular fa-floppy-disk" style="margin: 8px 12px;">`
        return;
    } else {
        const datosCompletos = {
            cita_id: cita_id,
            nuncom: nuncom,
            soexa: soexa,
            codpru_id: codpru_id,
            doc_adic_id: doc_adic_id,
            datains: datains,
            datainsrec: datainsrec,
            aptitud_espalda: aptitud_espalda,
            flex_fuerza: flex_fuerza,
            rangos_articulares: rangos_articulares,
        };

        fetch('/pbfichamusculoesqueletica', {
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
}

