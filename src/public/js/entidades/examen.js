$(document).ready(function () {
    getexamenes();

    const refresh = document.getElementById('refresh');
    refresh.addEventListener('click', getexamenes);
    const search = document.getElementById('search');
    search.addEventListener('click', getexamenes);
    
    render();
});
function getexamenes() {
    ocultarDiv('mydatatable');
    mostrarDiv('carga');
    $.ajax({
        url: '/examenes',
        method: 'GET',
        data: {            
        },
        success: function (citas) {
            ocultarDiv('carga');
            mostrarDiv('mydatatable');
            const tbody = $('#bodyExamen');
            tbody.empty();

            if (citas[0].tipo==="error") {
                tbody.append(`
                    <tr>
                        <td colspan="7" class="text-center">No hay resultados disponibles </td>
                    </tr>
                `);
                mensaje(citas[0].tipo, citas[0].response, 1500);
            } else {
                citas.forEach(cita => {
                    const checkboxStarep = cita.starep === 'S' ? '<i class="fa-solid fa-circle-check text-success"></i>' : '<i class="fa-solid fa-circle-xmark text-danger"></i>';
                    const checkboxStaaddfile = cita.staaddfile === 'S' ? '<i class="fa-solid fa-circle-check text-success"></i>' : (cita.staaddfile === 'N' ? '<i class="fa-solid fa-circle-xmark text-danger"></i>' : cita.staaddfile);
                    const checkboxreg_cie10 = cita.reg_cie10 === 'S' ? '<i class="fa-solid fa-circle-check text-success"></i>' : (cita.reg_cie10 === 'N' ? '<i class="fa-solid fa-circle-xmark text-danger"></i>' : cita.reg_cie10);
                    tbody.append(`
                        <tr data-id="${cita.soexa}">
                            <td class="align-middle"><input id="check_${cita.soexa}" value="id_${cita.soexa}" type="checkbox" class="mt-1" ></td>
                            <td>${cita.desexa}</td>
                            <td>${cita.ordimp}</td> 
                            <td>${cita.ordprot}</td>
                            <td>${checkboxStarep}</td>
                            <td>${checkboxStaaddfile}</td>
                            <td>${checkboxreg_cie10}</td>
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