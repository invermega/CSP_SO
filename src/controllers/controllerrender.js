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
        permisos(parametro, 'configuracion/usuario', req, res)
    },
    async renderroles(req, res) {
        const parametro = "PE"
        permisos(parametro, 'configuracion/permisos', req, res);
    },
    //historiaclinica
    async renderpacientescitados(req, res) {
        const parametro = "PH";
        permisos(parametro, 'historiaclinica/pacientescitados', req, res)
    },
    async rendersignosvitales(req, res) {
        const { soexa, id } = req.params;
        console.log(soexa, id);
        const parametro = "PH";
        //permisosexamenes(parametro, 'entidades/protocoloCreate', req, res, id, soexa);
        res.render('historiaclinica/examenes/signosvitales', { id, soexa, layout: false });
    },
    async rendersignosvitalesprueba(req, res) {
        const parametro = "PH";
        permisos(parametro, 'historiaclinica/pruebas/pbsignosvitales', req, res);
    },

    //entidades
    async renderprotocolo(req, res) {
        const parametro = "PT";
        permisos(parametro, 'entidades/protocolo', req, res)
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
    async renderepaciente(req, res) {
        res.render('entidades/paciente', { layout: false });
    },
    async rendercita(req, res) {
        res.render('entidades/cita', { layout: false });
    },

    async renderemedico(req, res) {
        res.render('entidades/medicos', { layout: false });
    },
    async rendercliente(req, res) {
        res.render('entidades/cliente', { layout: false });
    },

};
