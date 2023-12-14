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
            poblarcampos();
        },
        error: function () {
            $('#error-message').text('Se produjo un error al cargar los protocolos.');
        }
    });
})();
function ObtenerParametros(codpru_id) {
    let inputcodpru_id = document.getElementById('codpru_id');
    inputcodpru_id.value = codpru_id;
    let cita_id = document.getElementById('id').value;
    let soexa = document.getElementById('soexa').value;
    console.log(codpru_id,cita_id,soexa);
    mostrarDiv("cargaparametros");
    ocultarDiv("detInforme");
    $.ajax({
        url: '/rayosxparametros',
        method: "GET",
        data: {
            codpru_id: codpru_id,
            cita_id: cita_id,
            soexa: soexa
        },
        success: function (parametros) {
            console.log(parametros,codpru_id,cita_id,soexa);
            var contenedor = document.getElementById("detInforme");
            var codigoHTML = `
                <div class="col-md-12 input-group input-group-sm mt-2">
                    <label class="col-sm-2 input-group-text" for="codigo_ref">Nro referencia</label>
                    <input type="text" class="form-control form-control-sm" id="codigo_ref" value='${parametros[0].codigo_ref}' placeholder="Ingrese el valor" required>
                    <label class="input-group-text" style="width: 35px; color: #773C8D;" for="codigo_ref"><i class="fa-solid fa-heart-pulse"></i></label>
                </div>
                <div class="col-md-12 input-group input-group-sm mt-2">
                    <label class="col-sm-2 input-group-text" for="det_informe">Detalle del informe</label>
                    <textarea class="form-control form-control-sm" id="det_informe" rows="5" placeholder="Ingrese el valor" required>${parametros[0].det_informe}</textarea>
                    <label class="input-group-text" style="width: 35px; color: #773C8D;" for="det_informe"><i class="fa-regular fa-file"></i></label>
                </div>
                <div class="col-md-12 input-group input-group-sm mt-2">
                    <label class="col-sm-2 input-group-text" for="conclusion">Conclusión</label>
                    <textarea class="form-control form-control-sm" id="conclusion" rows="3" placeholder="Ingrese el valor" required>${parametros[0].conclusion}</textarea>
                    <label class="input-group-text" style="width: 35px; color: #773C8D;" for="conclusion"><i class="fa-solid fa-heart-pulse"></i></label>
                </div>
            `;
            contenedor.innerHTML = codigoHTML;       
        
            ocultarDiv("cargaparametros");
            mostrarDiv("detInforme");

        },
        error: function () {
            $('#error-message').text('Se produjo un error al cargar los protocolos.');
        }
    });
}
function poblarcampos() {
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
        url: '/resultrayosx',
        method: "GET",
        data: {
            cita_id: cita_id,
            soexa: soexa
        },
        success: function (result) {
            console.log(result);
            if (result[0].mensaje != 'sin datos') {
                console.log(result[0].numcon);
                nuncom.value = result[0].numcon;
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
    let doc_adic_id = document.getElementById('doc_adic_id').value;
    let codpru_id = document.getElementById('codpru_id').value;
    let codigo_ref = document.getElementById('codigo_ref').value;
    let det_informe = document.getElementById('det_informe').value;
    let conclusion = document.getElementById('conclusion').value;    
    const datosCompletos = {
        cita_id: cita_id,
        nuncom: nuncom,
        soexa: soexa,
        doc_adic_id: doc_adic_id,
        codpru_id: codpru_id,
        codigo_ref:codigo_ref,
        det_informe:det_informe,
        conclusion:conclusion,
    };
    fetch('/pbrayosx', {
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