(function poblarcampos() {
    cargarEquipo();
    setupOnChange();
})();
function cargarEquipo() {
    var codpru_id = $('#codpru_id').val();
    var equi_id = $('#equi_id');
    var feccali = $('#feccali');
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

            $.each(data, function (index, parametro) {
                equi_id.append($('<option>', {
                    value: parametro.equi_id,
                    text: parametro.equipo,
                }));
            });
            equi_id.off('change').on('change', function () {
                var selectedValue = equi_id.val();
                var selectedParametro = data.find(function (parametro) {
                    return parametro.equi_id == selectedValue;
                });
                if (selectedParametro) {
                    feccali.val(selectedParametro.feccali);
                }
            });
            equi_id.trigger('change');
        },
        error: function () {
            $('#error-message').text('Se produjo un error al cargar los equipos.');
        }
    });
}
function setupOnChange() {
    const elementIdD = ["va_d_125", "va_d_250", "va_d_500", "va_d_1000", "va_d_2000", "va_d_3000", "va_d_4000", "va_d_6000", "vo_d_8000", "vo_d_125", "vo_d_250", "vo_d_500", "vo_d_1000", "vo_d_2000", "vo_d_3000", "vo_d_4000", "vo_d_6000", "vo_d_8000"];
    function handleDerecho() {
        od();
    }
    elementIdD.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener("input", handleDerecho);
        }
    });

    const elementIdI = ["va_i_125", "va_i_250", "va_i_500", "va_i_1000", "va_i_2000", "va_i_3000", "va_i_4000", "va_i_6000", "vo_i_8000", "vo_i_125", "vo_i_250", "vo_i_500", "vo_i_1000", "vo_i_2000", "vo_i_3000", "vo_i_4000", "vo_i_6000", "vo_i_8000"];
    function handleIzquierdo() {
        oi();
    }
    elementIdI.forEach((id) => {
        const elementi = document.getElementById(id);
        if (elementi) {
            elementi.addEventListener("input", handleIzquierdo);
        }
    });
}
function od() {
    const ctx = document.getElementById('graf_OD').getContext('2d');
    var valuesVA = [];
    var valuesVO = [];
    for (let freq of [125, 250, 500, 1000, 2000, 3000, 4000, 6000, 8000]) {
        valuesVA.push(document.getElementById(`va_d_${freq}`).value !== '' ? document.getElementById(`va_d_${freq}`).value : null);
        valuesVO.push(document.getElementById(`vo_d_${freq}`).value !== '' ? document.getElementById(`vo_d_${freq}`).value : null);
        //valuesVO.push(document.getElementById(`vo_d_${freq}`).value);
    }    
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
            labels: ['125', '250', '500', '1000', '2000', '3000', '4000', '6000', '8000'],
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
                y: {
                    min:-10,
                    max: 120,
                    beginAtZero: false,
                    reverse: true,
                    grid: {
                        drawBorder: false,
                    },
                },
                x: {
                    grid: {
                        drawBorder: false,
                    },
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
                ctx.lineWidth = 5;
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
                            if (datasetIndex === 0 && valuesVO[index] !==null) {
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
function oi() {
    const ctx = document.getElementById('graf_OI').getContext('2d');
    var valuesVA = [];
    var valuesVO = [];
    for (let freq of [125, 250, 500, 1000, 2000, 3000, 4000, 6000, 8000]) {
        valuesVA.push(document.getElementById(`va_i_${freq}`).value !== '' ? document.getElementById(`va_i_${freq}`).value : null);
        valuesVO.push(document.getElementById(`vo_i_${freq}`).value !== '' ? document.getElementById(`vo_i_${freq}`).value : null);
    }    
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
            labels: ['125', '250', '500', '1000', '2000', '3000', '4000', '6000', '8000'],
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
                y: {
                    min:-10,
                    max: 120,
                    beginAtZero: false,
                    reverse: true,
                    grid: {
                        drawBorder: false,
                    },
                },
                x: {
                    grid: {
                        drawBorder: false,
                    },
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
                ctx.lineWidth = 5;
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
                            if (datasetIndex === 0 && valuesVO[index] !==null) {
                                ctx.fillStyle = 'red';
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

