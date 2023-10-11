

function guardarMedico(){
    validarFormulario('medcel,medTelfij,med_correo,meddir,med_firma');
}

/*function bloquearlabel(){
    const docideSelect = document.getElementById('docide');
    const nundocInput = document.getElementById('nundoc');

    docideSelect.addEventListener('change', function () {
        // Habilita o deshabilita el campo de número según la selección
        if (this.value === '1','2','3','4') {
            nundocInput.disabled = false;
        } else {
            nundocInput.disabled = true;
            nundocInput.value = ''; // Limpia el campo si está deshabilitado
        }
    });
}*/