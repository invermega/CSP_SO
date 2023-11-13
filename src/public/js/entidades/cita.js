$(document).ready(function () {
    getCitasCombo();

    const refresh = document.getElementById('refresh');
    refresh.addEventListener('click', getcitas);
    const search = document.getElementById('search');
    search.addEventListener('click', getcitas);
    var fechaActual = new Date().toISOString().split('T')[0];
    var fechaActual = new Date().toISOString().split('T')[0];
    $("#fecini").val(fechaActual);
    $("#fecfin").val(fechaActual);
    render();
});
function getcitas() {
    ocultarDiv('mydatatable');
    mostrarDiv('carga');
    let fecini = $('#fecini');//fecha inicio
    let fecfin = $('#fecfin');//fecha fin
    let paciente = $('#paciente');//busqueda por dni o nombre
    let parametro3 = $('#stacita');//estados
    let parametro4 = $('#codpro_id');//protocolo
    let parametro5 = 'N';//checked por auditar
    let parametro6 = $('#inputid');
    if ($("#parametro5").prop("checked")) {
        parametro5 = 'S'
    } else {
        parametro5 = 'N'
    }
    parametro6 = 0;
    $.ajax({
        url: '/listarcitas',
        method: 'GET',
        data: {
            fecini: fecini.val(),
            fecfin: fecfin.val(),
            paciente: paciente.val(),
            parametro3: parametro3.val(),
            parametro4: parametro4.val(),
            parametro5: parametro5,
            parametro6: parametro6
        },
        success: function (citas) {
            ocultarDiv('carga');
            mostrarDiv('mydatatable');
            const tbody = $('#bodyCita');
            tbody.empty();

            if (citas.length === 0) {
                tbody.append(`
                    <tr>
                        <td colspan="13" class="text-center">No hay resultados disponibles </td>
                    </tr>
                `);
            } else {
                citas.forEach(cita => {
                    tbody.append(`
            <tr data-id="${cita.id}">
              <td class="align-middle"><input id="check_${cita.id}" value="id_${cita.id}" type="checkbox" class="mt-1" ></td>
              <td>${cita.Fecha}</td>
              <td>${cita.Hora}</td> 
              <td>${cita.Turno}</td>
              <td>${cita.razsoc}</td>
              <td>${cita.appm_nom}</td>
              <td>${cita.numdoc}</td>
              <td>${cita.nompro}</td>
              <td>${cita.dessta}</td> 
              <td>${cita.desvalapt}</td>
              <td>${cita.CERT}</td>
              <td>${cita.INF}</td>
            </tr>
          `);
                });
                mensaje(citas[0].tipo, citas[0].response, 1500);
            }

        },
        error: function () {
            alert('Error en la solicitud AJAX');
        },
    });
}
function getCitasCombo() {
    $.ajax({
        url: '/listarCombosCitas',
        success: function (lista) {
            let stacita = $('#stacita');
            stacita.html('');
            stacita.append('<option value="%">TODOS</option>');
            lista.forEach(item => {
                let option = `<option value="${item.id}">${item.descripcion}</option>`;
                if (item.tabla === 'so_estadocita') {
                    stacita.append(option);
                }
            });
            stacita.val('G');
        },
        error: function () {
            alert('error');
        }
    });
}
document.getElementById("empresamodal").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        var parametro = this.value;
        getclientes(parametro);
    }
});
function getclientes(parametro) {
    mostrarDiv('cargaEmpresa');
    ocultarDiv('tableEmpresamodal');
    console.log(parametro);
    $.ajax({
        url: '/empresas',
        method: 'GET',
        data: {
            empresa: parametro,
        },
        success: function (clientes) {
            ocultarDiv('cargaEmpresa');
            mostrarDiv('tableEmpresamodal');
            const tbodycli = $('#bodyEmpresa');
            tbodycli.empty();
            if (clientes.length === 0) {
                tbodycli.append(`
                    <tr>
                        <td colspan="3" class="text-center">No hay resultados disponibles </td>
                    </tr>
                `);
            } else {
                clientes.forEach(cliente => {
                    tbodycli.append(`
            <tr>             
              <td>${cliente.razsoc}</td>
              <td>${cliente.NumDoc}</td>
              <td>
              <button onclick="getempresam('${cliente.razsoc}','${cliente.cli_id}')" class="btn btn-circle btn-sm btn-warning mr-1"><i class="fa-regular fa-pen-to-square"></i></button>
              
              </td>
            </tr>
          `);
                });

            }
            //mensaje(clientes[0].icono, clientes[0].mensaje, 1500);
        },
        error: function () {
            alert('Error en la solicitud AJAX');
        },
    });
}
function getempresam(razsoc, cli_id) {
    $('#razsoc').val(razsoc);
    $('#cli_id').val(cli_id);
    //$('#modalFormEmpresa [data-dismiss="modal"]').trigger('click');
    getprotocolo(cli_id);
    event.preventDefault();
}
function getprotocolo(parametro) {
    $.ajax({
        url: '/listarprotocolo',
        method: 'GET',
        data: {
            parametro: parametro,
        },
        success: function (lista) {
            let codpro_id = $('#codpro_id');
            codpro_id.html('');
            if (lista.length === 0) {
                let defaultOption = '<option value=""></option>';
                codpro_id.append(defaultOption);
            } else {
                lista.forEach(item => {
                    let option = `<option value="${item.id}">${item.descripcion}</option>`;
                    codpro_id.append(option);
                });
                codpro_id.on('change', function () {
                    let tercerColumna = obtenerTerceraColumna(lista, $(this).val());
                    $('#tipexa_id').val(tercerColumna);
                });
                codpro_id.trigger('change');
            }

        },
        error: function () {
            alert('Error en la solicitud AJAX');
        },
    });
}
function eliminar() {
    var table = document.getElementById('mydatatable');
    if (!table) {
        console.error('La tabla no se encontró.');
        return;
    }
    var rows = table.querySelectorAll('tbody tr');
    var seleccionados = [];
    for (var i = 0; i < rows.length; i++) {
        var checkbox = rows[i].querySelector('input[type="checkbox"]');

        if (checkbox && checkbox.checked) {
            var cita_id = checkbox.value.split('_')[1];
            seleccionados.push({ cita_id: cita_id });
        }
    }
    if (seleccionados.length === 0) {
        mensajecentral('error', 'Debes seleccionar algún registro.');
    } else {
        MensajeSIyNO('warning', '', '¿Está seguro de eliminar las citas seleccionadas?', function (respuesta) {
            console.log(seleccionados);
            if (respuesta) {
                fetch('/citadel', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(seleccionados)
                })
                    .then(response => {
                        if (!response.ok) {
                            console.error('Error en la solicitud');
                            throw new Error('Error en la solicitud');
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data[0].icono === "success") {
                            for (var i = 0; i < seleccionados.length; i++) {
                                var citaId = seleccionados[i].cita_id;
                                var fila = table.querySelector('tr[data-id="' + citaId + '"]');
                                if (fila) {
                                    fila.remove();
                                }
                            }
                        }
                        mensaje(data[0].icono, data[0].mensaje, 1500);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            }
        });
    }
}
async function navegargetidhr(iddatatableble) {
    var table = document.getElementById(iddatatableble);
    var rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    var seleccionados = []; // Array para almacenar los elementos checkbox seleccionados
    for (var i = 0; i < rows.length; i++) {
        var checkbox = rows[i].querySelector('input[type="checkbox"]');

        if (checkbox && checkbox.checked) {
            var id = checkbox.value.split('_')[1];
            seleccionados.push(id); // Agregar el id al array de seleccionados
        }
    }
    if (seleccionados.length === 0) {
        mensajecentral('error', 'Debes seleccionar algún registro.');
    } else if (seleccionados.length > 1) {
        mensajecentral('error', 'Debes seleccionar solo un registro.');
    } else {
        var detalle = await obtenerDatosDetalle(`${seleccionados[0]}`);
        obtenerDatosCabecera(`${seleccionados[0]}`).then(function (cabeceraData) {
            imprimirHojaRuta(cabeceraData, detalle);
        }).catch(function (error) {
            console.log(error);
        });
    }
}

function imprimirHojaRuta(cabeceraData, detalleData) {

    // Obtener el contenido de la guía
    const contenidoGuia = obtenerContenidoHojaRuta(cabeceraData, detalleData);

    // Abrir una nueva ventana con el tamaño y opciones deseadas
    const opciones = 'width=595,height=842,menubar=no,toolbar=no,location=no,resizable=no,maximize=no';
    const ventanaImpresion = window.open('', '_blank', opciones);

    // Escribir el contenido de la guía en la ventana
    ventanaImpresion.document.write(contenidoGuia);
    ventanaImpresion.document.close();

    // Esperar a que el contenido se cargue completamente antes de imprimir
    ventanaImpresion.onload = function () {
        ventanaImpresion.print();
        ventanaImpresion.close();
    };
}
function obtenerContenidoHojaRuta(cabeceraData, detalleData) {

    console.log(cabeceraData.numhoja, detalleData);
    // Construir el contenido del contenedor de imagen y título
    var contenedorImagenTitulo = "<div style='display: flex; align-items: center; justify-content: space-between; width: 100%; margin-bottom: 20px;'>";
    contenedorImagenTitulo += "<img src='/img/logo.png' alt='Logo' style='width: 120px; height: 75px; margin-right: 10px;'>";
    contenedorImagenTitulo += "<div style='text-align: center;'>"
    contenedorImagenTitulo += "<h4 style='margin: 0;'>HOJA DE RUTA N°: " + cabeceraData.numhoja + "</h4>";
    contenedorImagenTitulo += "<h4 style='margin: 0;'>Cita : " + cabeceraData.fechaprog + "</h4>";
    contenedorImagenTitulo += "</div>"
    contenedorImagenTitulo += "<div style='text-align: right;'>";
    contenedorImagenTitulo += "<p style='margin: 0;font-size: 10px;'><strong>Fecha:</strong> " + cabeceraData.fecha + "</p>";
    contenedorImagenTitulo += "<p style='margin: 0;font-size: 10px;'><strong>Hora:</strong> " + cabeceraData.hora + "</p>";
    contenedorImagenTitulo += "</div>";
    contenedorImagenTitulo += "</div>";


    var contenidoCabecera = "<table style='width: 100%; border-collapse: collapse;border-color: black;margin-bottom:20px'>";
    contenidoCabecera += "<tr>";
    contenidoCabecera += "<td style='vertical-align: center; border: 1px solid #ccc;width: 60%;'>";
    contenidoCabecera += "<strong style='font-size: 12px;'>Apellidos y Nombres:</strong><label style='font-size: 10px;'>&nbsp;&nbsp;" + cabeceraData.nombres + "</label>";
    contenidoCabecera += "</td>";
    contenidoCabecera += "<td style='vertical-align: center; border: 1px solid #ccc;'>";
    contenidoCabecera += "<strong style='font-size: 12px;'>Empresa:</strong><label style='font-size: 10px;'>&nbsp;&nbsp;" + cabeceraData.razsoc + "</label><br>";
    contenidoCabecera += "</td>";
    contenidoCabecera += "</tr>";
    contenidoCabecera += "<tr>";
    contenidoCabecera += "<td style='vertical-align: center; border: 1px solid #ccc;'>";
    contenidoCabecera += "<strong style='font-size: 12px;'>Correo:</strong><label style='font-size: 10px;'>&nbsp;&nbsp;" + cabeceraData.correo + "</label>";
    contenidoCabecera += "</td>";
    contenidoCabecera += "<td style='vertical-align: center; border: 1px solid #ccc;'>";
    contenidoCabecera += "<strong style='font-size: 12px;'>Puesto de trabajo:</strong><label style='font-size: 10px;'>&nbsp;&nbsp;" + cabeceraData.cargo + "</label><br>";
    contenidoCabecera += "</td>";
    contenidoCabecera += "</tr>";
    contenidoCabecera += "<tr>";
    contenidoCabecera += "<td style='vertical-align: center; border: 1px solid #ccc;'>";
    contenidoCabecera += "<strong style='font-size: 12px;'>DNI:</strong><label style='font-size: 10px;margin-right: 10px'>&nbsp;&nbsp;" + cabeceraData.numdoc + "</label>";
    contenidoCabecera += "<strong style='font-size: 12px;'>Celular:</strong><label style='font-size: 10px;'>&nbsp;&nbsp;" + cabeceraData.celular + "</label>";
    contenidoCabecera += "</td>";
    contenidoCabecera += "<td style='vertical-align: center; border: 1px solid #ccc;'>";
    contenidoCabecera += "<strong style='font-size: 12px;'>Área de trabajo:</strong><label style='font-size: 10px;'>&nbsp;&nbsp;" + cabeceraData.area + "</label><br>";
    contenidoCabecera += "</td>";
    contenidoCabecera += "</tr>";
    contenidoCabecera += "<tr>";
    contenidoCabecera += "<td style='vertical-align: center; border: 1px solid #ccc;'>";
    contenidoCabecera += "<strong style='font-size: 12px;'>Fecha cita:</strong><label style='font-size: 10px;'>&nbsp;&nbsp;" + cabeceraData.edad + "</label>";
    contenidoCabecera += "</td>";
    contenidoCabecera += "<td style='vertical-align: center; border: 1px solid #ccc;'>";
    contenidoCabecera += "<strong style='font-size: 12px;'>Tipo de Exámen:</strong><label style='font-size: 10px;'>&nbsp;&nbsp;" + cabeceraData.tipexa + "</label><br>";
    contenidoCabecera += "</td>";
    contenidoCabecera += "</tr>";
    contenidoCabecera += "</table>";

    // Construir el contenido del detalle (tabla)
    var contenidoDetalle = "<table style='width: 100%; border-collapse: collapse;border-color: black;'>";
    // Agregar encabezados de columna de la tabla
    contenidoDetalle += "<thead>";
    contenidoDetalle += "<tr style='background-color: #0FA0A7; color: white;'>";
    contenidoDetalle += "<th style='border: 1px solid #ccc; padding: 5px; font-size: 14px;'>Exámen</th>";
    contenidoDetalle += "<th style='border: 1px solid #ccc; padding: 5px; font-size: 14px;'>Firma y Sello</th>";
    contenidoDetalle += "<th style='border: 1px solid #ccc; padding: 5px; font-size: 14px;'>Exámen</th>";
    contenidoDetalle += "<th style='border: 1px solid #ccc; padding: 5px; font-size: 14px;'>Firma y Sello</th>";
    // ... Agregar más encabezados de columna según corresponda
    contenidoDetalle += "</tr>";
    contenidoDetalle += "</thead>";

    // Agregar filas de datos de la tabla
    contenidoDetalle += "<tbody>";
    detalleData.forEach(function (detalle) {
        contenidoDetalle += "<tr style='height: 120px;'>";
        contenidoDetalle += "<td style='border: 1px solid #ccc; text-align: left; padding-top: 5x; padding-left: 10px; vertical-align: top;height: 120px;width: 250px;padding-right: 10px;'><span style='font-size: 12px;'><strong>" + detalle.exa + "</span></strong><br><br><span style='font-size: 10px;'>" + detalle.deta + "</span></td>";
        contenidoDetalle += "<td style='border: 1px solid #ccc; text-align: left; vertical-align: top;font-size: 10px;height: 120px;width: 400px;'>" + detalle.firma + "</td>";
        contenidoDetalle += "<td style='border: 1px solid #ccc; text-align: left; padding-top: 5x; padding-left: 10px; vertical-align: top;font-size: 12px;height: 120px;width: 250px;'><span style='font-size: 12px;'><strong>" + detalle.exa1 + "</span></strong><br><br><span style='font-size: 10px;'>" + detalle.deta1 + "</span></td>";
        contenidoDetalle += "<td style='border: 1px solid #ccc; text-align: left; vertical-align: top;font-size: 10px;height: 120px;width: 400px;'>" + detalle.firma + "</td>";
        // ... Agregar más columnas de datos según corresponda
        contenidoDetalle += "</tr>";
    });
    contenidoDetalle += "</tbody>";
    contenidoDetalle += "</table>";



    // Agregar pie de página
    // Agregar pie de página
    var fechaHoraImpresion = new Date().toLocaleString();
    var contadorPaginas = "<div style='position: fixed; bottom: 20px; left: 20px; font-size: 10px;'>" +
        "Ultima actualización : medicoocupacional@clinicasanpedro.com - " + fechaHoraImpresion +
        "</div>";
    // Construir el contenido final de la guía
    var contenidoGuia = "<div style='font-family: Arial, sans-serif;'>" +
        contenedorImagenTitulo +
        contenidoCabecera +
        contenidoDetalle +
        contadorPaginas +
        "</div>";

    // Retornar el contenido de la guía
    return contenidoGuia;
}

function obtenerDatosCabecera(idcita) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: '/listarhrc',
            method: 'POST',
            data: {
                idcita: idcita,
            },
            success: function (lista) {
                var cabeceraData = {
                    numhoja: lista[0].numhoja,
                    nombres: lista[0].nombres,
                    area: lista[0].area,
                    fechaprog: lista[0].fechaprog,
                    celular: lista[0].celular,
                    edad: lista[0].edad,
                    razsoc: lista[0].razsoc,
                    cargo: lista[0].cargo,
                    numdoc: lista[0].numdoc,
                    correo: lista[0].correo,
                    tipexa: lista[0].tipexa,
                    fecha: lista[0].fecha,
                    hora: lista[0].hora
                }

                resolve(cabeceraData);
            },
            error: function (error) {
                // Manejo de errores aquí, si es necesario
                // Rechaza la promesa en caso de error
                reject(error);
            }
        });
    });
}

function obtenerDatosDetalle(idcita) {
    return new Promise(function (resolve, reject) {
        var detalleData = [];

        $.ajax({
            url: '/listarhrd',
            method: 'POST',
            data: {
                idcita: idcita,
            },
            success: function (empresas) {
                empresas.forEach(empresa => {
                    var detalleItem = {
                        exa: empresa.Exa,
                        exa1: empresa.Exa1,
                        deta: empresa.deta,
                        deta1: empresa.deta1,
                        firma: empresa.firma,
                        firma1: empresa.firma1,
                    };

                    detalleData.push(detalleItem);
                });
                resolve(detalleData);
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}

//Imprimir Consentimiento Informado
async function navegargetidci(iddatatableble) {
    var table = document.getElementById(iddatatableble);
    var rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    var seleccionados = []; // Array para almacenar los elementos checkbox seleccionados
    for (var i = 0; i < rows.length; i++) {
        var checkbox = rows[i].querySelector('input[type="checkbox"]');

        if (checkbox && checkbox.checked) {
            var id = checkbox.value.split('_')[1];
            seleccionados.push(id); // Agregar el id al array de seleccionados
        }
    }
    if (seleccionados.length === 0) {
        mensajecentral('error', 'Debes seleccionar algún registro.');
    } else if (seleccionados.length > 1) {
        mensajecentral('error', 'Debes seleccionar solo un registro.');
    } else {
        obtenerDatosCI(`${seleccionados[0]}`).then(function (cabeceraData) {
            imprimirConsentimientoInf(cabeceraData);
        }).catch(function (error) {
            console.log(error);
        });
    }
}

function imprimirConsentimientoInf(cabeceraData) {

    // Obtener el contenido de la guía
    const contenidoGuia = obtenerConsentimientoInf(cabeceraData);

    // Abrir una nueva ventana con el tamaño y opciones deseadas
    const opciones = 'width=595,height=842,menubar=no,toolbar=no,location=no,resizable=no,maximize=no';
    const ventanaImpresion = window.open('', '_blank', opciones);

    // Escribir el contenido de la guía en la ventana
    ventanaImpresion.document.write(contenidoGuia);
    ventanaImpresion.document.close();

    // Esperar a que el contenido se cargue completamente antes de imprimir
    ventanaImpresion.onload = function () {
        ventanaImpresion.print();
        ventanaImpresion.close();
    };
}
function obtenerConsentimientoInf(cabeceraData) {
    // Construir el contenido del contenedor de imagen y título
    var contenedorImagenTitulo = "<div style='display: flex; align-items: center; margin-bottom: 10px;'>";
    contenedorImagenTitulo += "<img src='/img/logo.png' alt='Logo' style='width: 120px; height: 75px;'>";
    contenedorImagenTitulo += "</div>";
    contenedorImagenTitulo += "</div>";

    // Agregar el título centrado
    var tituloCentrado = "<h4 style='text-align: center;'><strong>CONSENTIMIENTO INFORMADO PARA EXAMEN MÉDICO, AUTORIZACIÓN DE ENTREGA DE RESULTADOS Y DECLARACIÓN JURADA DE VERACIDAD DE INFORMACIÓN</strong></h4>";
    tituloCentrado += "<p style='text-align: right;margin-left:10px;margin-bottom:20px;'>" + cabeceraData.fecha + "</p>";
    tituloCentrado += "<p style='text-align: justify;margin:10px;line-height: 1.5em;font-size:14px;'>Yo,&nbsp" + cabeceraData.appm_nom + ",  identificado con DNI N°"+cabeceraData.numdoc+", con ocupación laboral de:&nbsp"+cabeceraData.cargo_actual+"&nbspcertifico con este documento que he sido informado acerca de la naturaleza y propósito de los Exámenes Médicos-Ocupacionales y pruebas complementarias que la empresa:&nbsp"+cabeceraData.razsoc+"&nbspsolicita de acuerdo a los riesgos de mi puesto de trabajo y que todas mis dudas y preguntas han sido absueltas."  
    "</p>";
    tituloCentrado += "<p style='text-align: justify;margin:10px;padding-top:20px;line-height: 1.5em;font-size:14px;'>Por tanto de forma consciente y voluntaria otorgo mi consentimiento para que procedan a realizar los exámenes que me correspondan en&nbsp"+cabeceraData.empresa+"&nbspy así mismo autorizo que los resultados sean entregados al área de salud ocupacional de la empresa&nbsp"+cabeceraData.razsoc+", con la finalidad de realizar la vigilancia medica ocupacional ordenada por la Ley de Seguridad y Salud en el trabajo 29783 y su modificatoria Ley 30222. Además DECLARO BAJO JURAMENTO que toda información proporcionada a los profesionales médicos o funcionarios responsables es de carácter verídico, para el cargo correspondiente al que postulo."+"</p>";
    tituloCentrado += "<div style='display: flex; justify-content: center; align-items: center;padding-top: 50px;font-size:14px;'><div style='overflow: hidden;text-align: center;'><hr style='width: 100%; margin: 0;'><p style='margin: 0;padding-top: 25px;'>" + cabeceraData.appm_nom +"</p><p style='margin: 0;'>DNI:&nbsp"+cabeceraData.numdoc+ "</p></div><div style='margin-left: 20px;'><img src='/img/cuadrado.png' alt='Cuadrado' style='width: 130px; height: 110px;'></div></div><p style='margin-top: 20px;'><strong>La presente autorización se ampara en lo dispuesto en los Artículos 5º segundo párrafo y Artículos 13°, 25, 27 y 29° tercer párrafo de la Ley General de Salud N° 26842.</strong></p>";
    contenedorImagenTitulo += "</div>";
    // Construir el contenido final de la guía
    var contenidoGuia = "<div style='font-family: Arial, sans-serif;'>" +
        contenedorImagenTitulo +
        tituloCentrado
        "</div>";

    // Retornar el contenido de la guía
    return contenidoGuia;
}

function obtenerDatosCI(idcita) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: '/listarcinf',
            method: 'POST',
            data: {
                idcita: idcita,
            },
            success: function (lista) {
                var cabeceraData = {
                    fecha: lista[0].fecha,
                    appm_nom: lista[0].appm_nom,
                    numdoc: lista[0].numdoc,
                    cargo_actual: lista[0].cargo_actual,
                    razsoc: lista[0].razsoc,
                    empresa: lista[0].empresa,
                }

                resolve(cabeceraData);
            },
            error: function (error) {
                // Manejo de errores aquí, si es necesario
                // Rechaza la promesa en caso de error
                reject(error);
            }
        });
    });
}

// Ejemplo de cómo usar la función con async/await
async function obtenerYManipularDatos(idcita) {
    try {
        var datos = await obtenerDatosDetalle(idcita);
        console.log(datos); // Hacer algo con los datos obtenidos
    } catch (error) {
        console.error(error);
    }
}
