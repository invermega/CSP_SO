const { getConnection } = require('../database/conexionsql');

async function permisos(opcsis, ruta, req, res, id) {
    const pool = await getConnection();
    const permiso = await pool.query(`sp_selVerificarPermisos '${req.user.codrol}','${opcsis}'`);
    if (permiso.recordset[0].acceso === 1) {
        res.render(ruta, { layout: false, id: id });
    } else {
        res.render('configuracion/401', { layout: false });
    }
}
async function permisosprueba(opcsis, ruta, req, res, id) {
    const pool = await getConnection();
    const permiso = await pool.query(`sp_selVerificarPermisos '${req.user.codrol}','${opcsis}'`);
    if (permiso.recordset[0].acceso === 1) {
        res.render(ruta, { layout: false, id: id });
    } else {
        res.render('configuracion/401pb', { layout: false });
    }
}

module.exports = {
    //render de Bienvenida   
    async renderIniciarSesion(req, res) {
        res.render('auth/iniciarsesion', { layout: false });
    },
    async renderbienvenida(req, res) {
        res.render('inicio');
    },
    //render de configuracion
    async renderusuario(req, res) {
        const parametro = "US";
        permisos(parametro, 'configuracion/usuario', req, res);
    },
    async renderroles(req, res) {
        const parametro = "PE"
        permisos(parametro, 'configuracion/permisos', req, res);
    },
    //historiaclinica
    async renderpacientescitados(req, res) {
        const parametro = "PH";
        permisos(parametro, 'historiaclinica/pacientescitados', req, res);
    },
    async rendermenuexamenes(req, res) {
        const { id } = req.params;
        console.log(id);
        res.render('historiaclinica/menuexamenes/menuexamenes', { id, layout: false });
    },
    async rendersignosvitalesprueba(req, res) {
        const parametro = "SG";
        permisosprueba(parametro, 'historiaclinica/pruebas/pbsignosvitales', req, res);
    },
    async renderlaboratorioprueba(req, res) {
        const parametro = "LB";
        permisosprueba(parametro, 'historiaclinica/pruebas/pblaboratorio', req, res);
    },
    async renderespirometriaprueba(req, res) {
        const parametro = "ES";
        permisos(parametro,'historiaclinica/pruebas/pbespirometria', req, res,0)
    },
    async rendercuestionarioespirometriaprueba(req, res) {
        const parametro = "CE";
        permisos(parametro,'historiaclinica/pruebas/pbcuestionarioespirometria', req, res,0)
    },
    async renderpsicologiaprueba(req, res) {
        const parametro = "TP";
        permisos(parametro,'historiaclinica/pruebas/pbpsicologia', req, res,0)
    },
    async renderfichamusculoesqueleticaprueba(req, res) {
        const parametro = "ME";
        permisosprueba(parametro, 'historiaclinica/pruebas/pbfichamusculoesqueletica', req, res);
    },
    async renderfichamedicoocupacional312prueba(req, res) {
        const parametro = "MO";
        permisosprueba(parametro, 'historiaclinica/pruebas/pbfichamedicoocupacional312', req, res);
    },
    async renderaudiometriaprueba(req, res) {
        const parametro = "AD";
        permisosprueba(parametro, 'historiaclinica/pruebas/pbaudiometria', req, res);
    },
    async renderrayosxprueba(req, res) {
        const parametro = "IM";
        permisosprueba(parametro, 'historiaclinica/pruebas/pbrayosx', req, res);
    },
    //entidades
    async renderprotocolo(req, res) {
        const parametro = "PT";
        permisos(parametro, 'entidades/protocolo', req, res);
    },    
    async renderprotocolocreate(req, res) {
        const parametro = "PT";
        permisos(parametro, 'entidades/protocoloCreate', req, res, 0);
    },
    async renderprotocoloedit(req, res) {
        const { id } = req.params;
        const parametro = "PT";
        permisos(parametro, 'entidades/protocoloCreate', req, res, id);
    },
    /*Paciente*/
    async renderpaciente(req, res) {
        const parametro = "PC";
        permisos(parametro, 'entidades/paciente', req, res);
    },
    async renderpacientecreate(req, res) {
        const parametro = "PC";
        permisos(parametro, 'entidades/paciente', req, res, 0);
    }, async renderpacienteedit(req, res) {
        const { id } = req.params;
        const parametro = "PC";
        permisos(parametro, 'entidades/paciente', req, res, id);
    },
    /*Cita */
    async rendercita(req, res) {
        const parametro = "CT";
        permisos(parametro, 'entidades/cita', req, res)
    },
    async rendercitacreate(req, res) {
        const parametro = "CT";
        permisos(parametro, 'entidades/citaCreate', req, res, 0)
    },
    async rendercitaedit(req, res) {
        const { id } = req.params;
        const parametro = "CT";
        permisos(parametro, 'entidades/citaCreate', req, res, id)
    },
    /**Medico */
    async renderemedico(req, res) {
        const parametro = "MD";
        permisos(parametro,'entidades/medicos', req,res)
        res.render('entidades/medicos', { layout: false });
    },
    async rendermedicocreate(req, res) {
        const parametro = "MD";
        permisos(parametro, 'entidades/medicosCreate', req, res, 0);
    },
    async rendermedicoedit(req, res) {
        const { id } = req.params;
        const parametro = "MD";
        permisos(parametro, 'entidades/medicosCreate', req, res, id);
    },
    /**Cliente */
    async rendercliente(req, res) {
        const parametro = "CL";
        permisos(parametro,'entidades/cliente', req,res)
        res.render('entidades/cliente', { layout: false });
    },
    /*Examen */
    async renderexamen(req, res) {
        const parametro = "EX";
        permisos(parametro, 'entidades/examen', req, res)
    },
    async renderexamencreate(req, res) {
        const parametro = "EX";
        permisos(parametro, 'entidades/examenCreate', req, res, 0)
    },

    /*Descargas*/
    async renderinformes(req, res) {
        const parametro = "IN";
        permisos(parametro, 'descargas/informes', req, res)
    },

};
