

(function poblarcampos() {
    let cita_id = document.getElementById('id').value;
    let soexa = document.getElementById('soexa').value;
    console.log(soexa);
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
        url: '/resultlaboratorio',
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
        },
        error: function (Examenes) {
            alert('error');
        }
    });
})();

(function CrearCards() {
    let soexa = document.getElementById('soexa').value;
    let cita_id = document.getElementById('id').value;
    $.ajax({
        url: '/pruebascards',
        method: "GET",
        data: {
            soexa: soexa,
            cita_id: cita_id
        },
        success: function (pruebas) {
            let cards = $('#cards');
            cards.html('');
            pruebas.forEach(prueba => {
                cards.append(`
                <div class="col-xl-12 col-md-6 mt-2">
                    <div class "card text-white mb-4" style="background-color: #793B8E; color: white">
                        
                        <div class="card-footer d-flex align-items-center justify-content-between">
                            <a class="small text-white stretched-link" onclick="ObtenerParametros('${prueba.codpru_id}')" href="#" >${prueba.desexadet}</a>
                            <div class="small text-white"><i class="fas fa-angle-right"></i></div>
                        </div>
                    </div>
               </div>
            `)
            });
        },
        error: function () {
            $('#error-message').text('Se produjo un error al cargar los protocolos.');
        }
    });
})();

function ObtenerParametros(codpru_id) {
    let inputcodpru_id = document.getElementById('codpru_id');
    inputcodpru_id.value = codpru_id;
    let nuncom = document.getElementById('nuncom').value;
    ocultarTabla("tablaparametros");
    mostrarDiv("cargaparametros");
    $.ajax({
        url: '/parametros',
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
                        <td style="padding-bottom: 0px; padding-top: 0px; vertical-align: middle;"> <input style="display:none" type="text" id="input${parametro.parexa_id}" value="${parametro.parexa_id}" > <input style="height: 25px;" type="text" id="valor${parametro.parexa_id}" class="form-control " value="${parametro.resultvalor}"></td>
                        <td >${parametro.unidad}</td>
                        <td >${parametro.valorref}</td>
                    </tr>
                                    `)
                } else {
                    tbody.append(`
                    <tr>
                        <td colspan="4" class="text-left align-middle px-2" style="font-weight: bold; background-color:#DADADA" >${parametro.despar}</td>
                    </tr>
                                    `)
                }
            });
        },
        error: function () {
            $('#error-message').text('Se produjo un error al cargar los protocolos.');
        }
    });
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

    var tbody = document.getElementById('tbodyparametros');
    if (tbody.rows.length > 0) {
        var datains = obtenerDataIns();
    } else {
        btnGrabar.disabled = false;
        mensaje('error', 'Por favor, seleccione alguna prueba', 1500);
        btnGrabar.innerHTML = `<i class="fa-regular fa-floppy-disk" style="margin: 8px 12px;">`
        return;
    }
    var datains = obtenerDataIns();
    console.log(datains);
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

    fetch('/pblaboratorio', {
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


function obtenerDataParametros() {
    var table = document.getElementById('tableparametros');
    var rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    var data = [];

    for (var i = 0; i < rows.length; i++) {
        var input = rows[i].getElementsByTagName('input');

        if (input.length >= 2) {
            var inputparaexa_id = input[0].value;
            var inputdespar = input[1].value;

            var rowData = {
                parexa_id: inputparaexa_id,
                valorpar: inputdespar,
            };
            data.push(rowData);
        } else {
            console.log('Fila ' + (i + 1) + ' no tiene suficientes elementos input. Se ignorará.');
        }
    }
    return data;
}