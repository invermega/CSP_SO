function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => {
            resolve();
        };
        script.onerror = () => {
            reject();
        };
        document.head.appendChild(script);
    });
}
(async function poblarcampos() {
    try {
        await loadScript('https://cdn.jsdelivr.net/npm/chart.js');
        await loadScript('https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jquery.inputmask/5.0.8/jquery.inputmask.min.js');

        await (async () => {
            while (typeof ChartDataLabels === 'undefined' || typeof Chart.helpers === 'undefined') {
                await new Promise(resolve => setTimeout(resolve, 50));
            }

        })();
        await (async () => {
            cargarEquipo();
            let cita_id = document.getElementById('id').value;
            let soexa = document.getElementById('soexa').value;
            let nuncom = document.getElementById('nuncom');

            let equi_id = document.getElementById('equi_id').value;
            let tiem_exp_hrs = document.getElementById('tiem_exp_hrs').value;
            let apre_ruido = document.getElementById('apre_ruido').value;

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
                url: '/resultaudiometria',
                method: "GET",
                data: {
                    cita_id: cita_id,
                    soexa: soexa
                },
                success: function (result) {

                    if (result[0].mensaje != 'sin datos') {
                        nuncom.value = result[0].nuncom;
                        $("#equi_id").val(result[0].equi_id);
                        $("#feccali").val(result[0].feccali);
                        $("#tiem_exp_hrs").val(result[0].tiem_exp_hrs);
                        $("#apre_ruido").val(result[0].apre_ruido);
                        $('input[type=radio][name=uso_pro_uditivo][value="' + result[0].uso_pro_uditivo + '"]').prop('checked', true);

                        let ante_relacionadosArray = JSON.parse(result[0].ante_relacionados);
                        ante_relacionadosArray.forEach(item => {
                            let radioName = item.radio;
                            let radioValue = item.valor;
                            $('#ante_relacionados input[name="' + radioName + '"][value="' + radioValue + '"]').prop('checked', true);
                        });
                        let sintomas_actualesArray = JSON.parse(result[0].sintomas_actuales);
                        sintomas_actualesArray.forEach(item => {
                            let radioName = item.radio;
                            let radioValue = item.valor;
                            $('#sintomas_actuales input[name="' + radioName + '"][value="' + radioValue + '"]').prop('checked', true);
                        });

                        let otos_oido_derechoArray = JSON.parse(result[0].otos_oido_derecho);
                        otos_oido_derechoArray.forEach(item => {
                            let radioName = item.radio;
                            let radioValue = item.valor;
                            let obsValue = item.obs;

                            $('#otos_oido_derecho input[name="' + radioName + '"][value="' + radioValue + '"]').prop('checked', true);
                            $('#otos_oido_derecho tr:contains("' + item.texto + '") td:eq(2) input[type="text"]').val(obsValue);

                        });
                        let otos_oido_izquierdoArray = JSON.parse(result[0].otos_oido_izquierdo);
                        otos_oido_izquierdoArray.forEach(item => {
                            let radioName = item.radio;
                            let radioValue = item.valor;
                            let obsValue = item.obs;

                            $('#otos_oido_izquierdo input[name="' + radioName + '"][value="' + radioValue + '"]').prop('checked', true);
                            $('#otos_oido_izquierdo tr:contains("' + item.texto + '") td:eq(2) input[type="text"]').val(obsValue);

                        });

                        $('input[type=radio][name=logoaudiometria_oido_der][value="' + result[0].logoaudiometria_oido_der + '"]').prop('checked', true);
                        $('input[type=radio][name=logoaudiometria_oido_izq][value="' + result[0].logoaudiometria_oido_izq + '"]').prop('checked', true);
                        var val_oido_derechoArray = JSON.parse(result[0].val_oido_derecho);
                        val_oido_derechoArray.forEach(item => {
                            Object.keys(item).forEach(clave => {
                                if (clave !== "fila") {
                                    let [prefijo] = clave.split('_');
                                    let identificador;

                                    if (item.fila === "V.A.") {
                                        identificador = 'va_d_' + prefijo;
                                    } else if (item.fila === "V.O.") {
                                        identificador = 'vo_d_' + prefijo;
                                    }

                                    let inputSelector = '#' + identificador;
                                    if ($(inputSelector).closest('table').attr('id') === 'val_oido_derecho') {
                                        let inputValue = item[clave];
                                        $(inputSelector).val(inputValue);
                                    }
                                }
                            });
                        });

                        var val_oido_izquierdoArray = JSON.parse(result[0].val_oido_izquierdo);
                        val_oido_izquierdoArray.forEach(item => {
                            Object.keys(item).forEach(clave => {
                                if (clave !== "fila") {
                                    let [prefijo] = clave.split('_');
                                    let identificador;

                                    if (item.fila === "V.A.") {
                                        identificador = 'va_i_' + prefijo;
                                    } else if (item.fila === "V.O.") {
                                        identificador = 'vo_i_' + prefijo;
                                    }

                                    let inputSelector = '#' + identificador;
                                    if ($(inputSelector).closest('table').attr('id') === 'val_oido_izquierdo') {
                                        let inputValue = item[clave];
                                        $(inputSelector).val(inputValue);
                                    }
                                }
                            });
                        });
                        if (nuncom.value !== 0) {
                            od();
                            oi();
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
                },
                error: function (Examenes) {
                    alert('error');
                }
            });
        })();
    } catch (error) {
        console.error('Error al cargar el script. Revisa la consola para obtener más detalles.');
    }
})();
function cargarEquipo() {
    var codpru_id = $('#codpru_id').val();
    var equi_id = $('#equi_id');
    var opc = 0;
    var equipos = 0;
    $.ajax({
        url: '/equipos',
        method: 'GET',
        data: {
            codpru_id: codpru_id,
            opc: opc,
            equipos: equipos,
        },
        success: function (data) {
            equi_id.empty();
            if (data.length >= 1) {
                $.each(data, function (index, parametro) {
                    equi_id.append($('<option>', {
                        value: parametro.equi_id,
                        text: parametro.equipo,
                    }));
                });
                $('#feccali').val(data[0].feccali);
                equi_id.off('change').on('change', function () {
                    actualizarFeccali(data);
                });
                setupOnChange();
            }else{
                equi_id.append($('<option>', {
                    value: '',
                    text: 'SIN REGISTRO',
                    disabled: true,
                    selected: true
                }));
                equi_id.prop('disabled', true);

            }

        },
        error: function () {
            $('#error-message').text('Se produjo un error al cargar los equipos.');
        }
    });
}
function actualizarFeccali(data) {
    var equi_id = $('#equi_id');
    var feccali = $('#feccali');
    var selectedValue = equi_id.val();
    var selectedParametro = data.find(function (parametro) {
        return parametro.equi_id == selectedValue;
    });
    if (selectedParametro) {
        feccali.val(selectedParametro.feccali);
    }
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
    let equi_id = document.getElementById('equi_id').value;
    let tiem_exp_hrs = document.getElementById('tiem_exp_hrs').value;
    var uso_pro_uditivo = $('input[name="uso_pro_uditivo"]:checked').val();
    let apre_ruido = document.getElementById('apre_ruido').value;
    var ante_relacionados = obtenerDataAntRelacionados();
    var sintomas_actuales = obtenerDataSintAct();
    var otos_oido_derecho = obtenerDataOtosDerecho();
    var otos_oido_izquierdo = obtenerDataOtosIzquierdo();
    var logoaudiometria_oido_der = $('input[name="logoaudiometria_oido_der"]:checked').val();
    var logoaudiometria_oido_izq = $('input[name="logoaudiometria_oido_izq"]:checked').val();

    var val_oido_derecho = obtenerDataValDerecho();
    var val_oido_izquierdo = obtenerDataValIzquierdo();
    const datosCompletos = {
        cita_id: cita_id,
        nuncom: nuncom,
        soexa: soexa,
        codpru_id: codpru_id,
        doc_adic_id: doc_adic_id,
        datains: datains,
        datainsrec: datainsrec,
        equi_id: equi_id,
        tiem_exp_hrs: tiem_exp_hrs,
        uso_pro_uditivo: uso_pro_uditivo,
        apre_ruido: apre_ruido,
        ante_relacionados: ante_relacionados,
        sintomas_actuales: sintomas_actuales,
        otos_oido_derecho: otos_oido_derecho,
        otos_oido_izquierdo: otos_oido_izquierdo,
        logoaudiometria_oido_der: logoaudiometria_oido_der,
        logoaudiometria_oido_izq: logoaudiometria_oido_izq,
        val_oido_derecho: val_oido_derecho,
        val_oido_izquierdo: val_oido_izquierdo,
    };

    fetch('/pbaudiometria', {
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
function setupOnChange() {
    const elementIdD = ["va_d_125", "va_d_250", "va_d_500", "va_d_1000", "va_d_2000", "va_d_3000", "va_d_4000", "va_d_6000", "vo_d_8000", "vo_d_125", "vo_d_250", "vo_d_500", "vo_d_1000", "vo_d_2000", "vo_d_3000", "vo_d_4000", "vo_d_6000", "vo_d_8000"];
    function handleDerecho() {
        od();
    }
    elementIdD.forEach((id) => {
        const element = $("#" + id);
        if (element.length) {
            $(element).inputmask("numeric", {
                radixPoint: '.',
                inputtype: "text",
                allowMinus: true,
                autoUnmask: true,
                placeholder: "0",
                showMaskOnHover: true,
                scale: 3,
            });
            element.on("input", handleDerecho);
            //element.addEventListener("input", handleDerecho);
        }
    });

    const elementIdI = ["va_i_125", "va_i_250", "va_i_500", "va_i_1000", "va_i_2000", "va_i_3000", "va_i_4000", "va_i_6000", "vo_i_8000", "vo_i_125", "vo_i_250", "vo_i_500", "vo_i_1000", "vo_i_2000", "vo_i_3000", "vo_i_4000", "vo_i_6000", "vo_i_8000"];
    function handleIzquierdo() {
        oi();
    }
    elementIdI.forEach((id) => {
        const elementi = $("#" + id);
        if (elementi.length) {
            $(elementi).inputmask("numeric", {
                radixPoint: '.',
                inputtype: "text",
                allowMinus: true,
                autoUnmask: true,
                placeholder: "0",
                showMaskOnHover: true,
                scale: 3,
            });
            elementi.on("input", handleIzquierdo);
        }
    });
}
async function od() {


    const ctx = document.getElementById('graf_OD').getContext('2d');
    var valuesVA = [];
    var valuesVO = [];
    for (let freq of [125, 250, 500, 1000, 2000, 3000, 4000, 6000, 8000]) {
        valuesVA.push(document.getElementById(`va_d_${freq}`).value !== '' ? document.getElementById(`va_d_${freq}`).value : null);
        valuesVO.push(document.getElementById(`vo_d_${freq}`).value !== '' ? document.getElementById(`vo_d_${freq}`).value : null);
    }
    valuesVO = [null, ...valuesVO, null];
    valuesVA = [null, ...valuesVA, null];
    const existingChart = ctx.chart;
    if (existingChart) {
        existingChart.destroy();
    }
    Chart.register(ChartDataLabels);

    const maxDataValue = Math.max(...valuesVA, ...valuesVO);
    const maxYValue = maxDataValue < 25 ? 30 : (Math.ceil(maxDataValue / 10) * 10) + 10;
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [null, '125', '250', '500', '1000', '2000', '3000', '4000', '6000', '8000', null],
            datasets: [{
                label: 'Oído derecho',
                data: valuesVO,
                borderWidth: 1,
                borderColor: 'red',
                borderDash: [5, 5],
                pointRadius: 0,
            }, {
                label: 'Nuevo conjunto de datos',
                data: valuesVA,
                borderWidth: 1,
                borderColor: 'red',
                pointRadius: 8,
                pointStyle: 'circle',
                pointBackgroundColor: 'white',
                pointBorderColor: 'red',
                fill: false,
            }]
        },
        options: {
            scales: {
                x: {
                    grid: {
                        drawBorder: false,
                    },
                },
                y: {
                    min: -10,
                    max: 120,
                    beginAtZero: false,
                    reverse: true,
                    grid: {
                        drawBorder: false,
                    },
                    ticks: {
                        stepSize: 10,

                    }
                },
            },
            plugins: {
                legend: {
                    display: false
                },
                datalabels: {
                    display: false
                },
            },
            elements: {
                line: {
                    tension: 0.2
                }
            },
        },
        plugins: [{
            afterDraw: function (chart) {
                var ctx = chart.ctx;
                ctx.strokeStyle = 'gray';
                ctx.lineWidth = 3;
                ctx.setLineDash([]);
                const yValue = chart.scales.y.getPixelForValue(25);
                ctx.fillStyle = 'gray';
                ctx.fillRect(chart.scales.x.left, yValue - 2.5, chart.scales.x.width, 5);
                ctx.beginPath();
                ctx.moveTo(chart.scales.x.left, yValue);
                ctx.lineTo(chart.scales.x.right, yValue);
                ctx.stroke();
                ctx.closePath();

                chart.data.datasets.forEach(function (dataset, datasetIndex) {
                    var meta = chart.getDatasetMeta(datasetIndex);
                    if (!meta.hidden) {
                        meta.data.forEach(function (element, index) {
                            if (datasetIndex === 0 && valuesVO[index] !== null) {
                                ctx.fillStyle = 'red';
                                ctx.font = '20px Arial';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText('<', element.x, element.y);
                            }
                        });
                    }
                });
            }
        }]
    });
    ctx.chart = myChart;
}
async function oi() {
    const ctx = document.getElementById('graf_OI').getContext('2d');
    var valuesVA = [];
    var valuesVO = [];
    for (let freq of [125, 250, 500, 1000, 2000, 3000, 4000, 6000, 8000]) {
        valuesVA.push(document.getElementById(`va_i_${freq}`).value !== '' ? document.getElementById(`va_i_${freq}`).value : null);
        valuesVO.push(document.getElementById(`vo_i_${freq}`).value !== '' ? document.getElementById(`vo_i_${freq}`).value : null);
    }
    valuesVO = [null, ...valuesVO, null];
    valuesVA = [null, ...valuesVA, null];
    const existingChart = ctx.chart;
    if (existingChart) {
        existingChart.destroy();
    }
    Chart.register(ChartDataLabels);
    const maxDataValue = Math.max(...valuesVA, ...valuesVO);
    const maxYValue = maxDataValue < 25 ? 30 : (Math.ceil(maxDataValue / 10) * 10) + 10;
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [null, '125', '250', '500', '1000', '2000', '3000', '4000', '6000', '8000', null],
            datasets: [{
                label: 'Oído derecho',
                data: valuesVO,
                borderWidth: 1,
                borderColor: 'blue',
                borderDash: [5, 5],
                pointRadius: 0,
            }, {
                label: 'Nuevo conjunto de datos',
                data: valuesVA,
                borderWidth: 1,
                borderColor: 'blue',
                pointRadius: 0,
            }]
        },
        options: {
            scales: {
                x: {
                    grid: {
                        drawBorder: false,
                    },
                },
                y: {
                    min: -10,
                    max: 120,
                    beginAtZero: false,
                    reverse: true,
                    grid: {
                        drawBorder: false,
                    },
                    ticks: {
                        stepSize: 10,

                    }
                },
            },
            plugins: {
                legend: {
                    display: false
                },
                datalabels: {
                    display: false
                }
            },
            elements: {
                line: {
                    tension: 0.2
                }
            },
        },
        plugins: [{
            afterDraw: function (chart) {
                var ctx = chart.ctx;
                ctx.strokeStyle = 'gray';
                ctx.lineWidth = 3;
                ctx.setLineDash([]);
                const yValue = chart.scales.y.getPixelForValue(25);
                ctx.fillStyle = 'gray';
                ctx.fillRect(chart.scales.x.left, yValue - 2.5, chart.scales.x.width, 5);
                ctx.beginPath();
                ctx.moveTo(chart.scales.x.left, yValue);
                ctx.lineTo(chart.scales.x.right, yValue);
                ctx.stroke();
                ctx.closePath();

                chart.data.datasets.forEach(function (dataset, datasetIndex) {
                    var meta = chart.getDatasetMeta(datasetIndex);
                    if (!meta.hidden) {
                        meta.data.forEach(function (element, index) {
                            if (datasetIndex === 0 && valuesVO[index] !== null) {
                                ctx.fillStyle = 'blue';
                                ctx.font = '20px Arial';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText('>', element.x, element.y);
                            }
                            if (datasetIndex === 1 && valuesVA[index] !== null) {
                                ctx.fillStyle = 'blue';
                                ctx.font = '20px Arial';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText('X', element.x, element.y);
                            }
                        });
                    }
                });
            }
        }]
    });
    ctx.chart = myChart;
}
function obtenerDataAntRelacionados() {//Tabla antecedente relacionados
    var data = [];
    $('#ante_relacionados tbody tr').each(function () {
        var fila = $(this);
        var texto = fila.find('td:first span').text();
        var valor = fila.find('td:nth-child(2) input[type=radio]:checked').val();
        var radio = fila.find('td:nth-child(2) input[type=radio]').attr('name');
        var rowData = {
            texto: texto,
            valor: valor,
            radio: radio
        };
        data.push(rowData);
    });
    return data;
}
function obtenerDataSintAct() {//Tabla sintomas actuales
    var data = [];
    $('#sintomas_actuales tbody tr').each(function () {
        var fila = $(this);
        var texto = fila.find('td:first span').text();
        var valor = fila.find('td:nth-child(2) input[type=radio]:checked').val();
        var radio = fila.find('td:nth-child(2) input[type=radio]').attr('name');
        var rowData = {
            texto: texto,
            valor: valor,
            radio: radio
        };
        data.push(rowData);
    });
    return data;
}
function obtenerDataOtosDerecho() {//Tabla otoscopia oido derecho
    var data = [];
    $('#otos_oido_derecho tbody tr').each(function () {
        var fila = $(this);
        var texto = fila.find('td:first span').text();
        var valor = fila.find('td:nth-child(2) input[type=radio]:checked').val();
        var radio = fila.find('td:nth-child(2) input[type=radio]').attr('name');
        var obs = fila.find('td:nth-child(3) input[type=text]').val();
        var rowData = {
            texto: texto,
            valor: valor,
            radio: radio,
            obs: obs
        };
        data.push(rowData);
    });
    return data;
}
function obtenerDataOtosIzquierdo() {//Tabla otoscopia oido izquierdo
    var data = [];
    $('#otos_oido_izquierdo tbody tr').each(function () {
        var fila = $(this);
        var texto = fila.find('td:first span').text();
        var valor = fila.find('td:nth-child(2) input[type=radio]:checked').val();
        var radio = fila.find('td:nth-child(2) input[type=radio]').attr('name');
        var obs = fila.find('td:nth-child(3) input[type=text]').val();
        var rowData = {
            texto: texto,
            valor: valor,
            radio: radio,
            obs: obs
        };
        data.push(rowData);
    });
    return data;
}
function obtenerDataValDerecho() {
    var data = [];
    $('#val_oido_derecho tbody tr').each(function () {
        var fila = $(this);
        var texto = fila.find('td:first span').text();
        var rowData = { fila: texto };
        fila.find('td input[type=text]').each(function () {
            var inputId = $(this).attr('id');
            var valor = $(this).val();
            var soloNumeros = inputId.replace(/\D/g, '');
            rowData[soloNumeros] = valor;
        });
        data.push(rowData);
    });
    return data;
}
function obtenerDataValIzquierdo() {
    var data = [];
    $('#val_oido_izquierdo tbody tr').each(function () {
        var fila = $(this);
        var texto = fila.find('td:first span').text();
        var rowData = { fila: texto };
        fila.find('td input[type=text]').each(function () {
            var inputId = $(this).attr('id');
            var valor = $(this).val();
            var soloNumeros = inputId.replace(/\D/g, '');
            rowData[soloNumeros] = valor;
        });
        data.push(rowData);
    });
    return data;
}
