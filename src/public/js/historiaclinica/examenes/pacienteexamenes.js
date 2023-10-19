(function getPacienteExamen() {
    const id = document.getElementById('id').value;
    var formElements = {
        fecaten: document.getElementById('fecaten'),
        dni: document.getElementById('dni'),
        nombres: document.getElementById('nombres'),
        fecnac: document.getElementById('fecnac'),
        edad: document.getElementById('edad'),
        sexo: document.getElementById('sexo'),
        empresa: document.getElementById('empresa'),
        tipoexamen: document.getElementById('tipoexamen'),
        protocolo: document.getElementById('protocolo'),
        area: document.getElementById('area'),
        fc: document.getElementById('fc'),
        pa: document.getElementById('pa'),
        fr: document.getElementById('fr'),
        sato2: document.getElementById('sato2'),
        talla: document.getElementById('talla'),
        peso: document.getElementById('peso'),
        imc: document.getElementById('imc')
    }
    $.ajax({
        url: '/pacienteexamen/' + id,
        method: "GET",
        success: function (paciente) {
            console.log(paciente);
            var data = paciente[0];
            console.log(data);
            formElements.fecaten.value = new Date(data.fecprocita).toISOString().split('T')[0];
            formElements.dni.value = data.numdoc;
            formElements.nombres.value = data.appm_nom;
            formElements.fecnac.value = new Date(data.fecnac).toISOString().split('T')[0];
            formElements.edad.value = data.Edad;
            formElements.sexo.value = data.des_sexo;
            formElements.empresa.value = data.razsoc;
            formElements.tipoexamen.value = data.desexa;
            formElements.protocolo.value = data.nompro;
            formElements.area.value = data.area_actual;
            formElements.fc.value = data.fc;
            formElements.pa.value = data.pa;
            formElements.fr.value = data.fr;
            formElements.sato2.value = data.sato2;
            formElements.talla.value = data.talla;
            formElements.peso.value = data.peso;
            formElements.imc.value = data.imc;
        },
        error: function () {
            $('#error-message').text('Se produjo un error al cargar los protocolos.');
        }
    });
})();