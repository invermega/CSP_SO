
const { getConnection } = require('../database/conexionsql');

async function permisos(opcsis, ruta, req, res) {
    const pool = await getConnection();
    const permiso = await pool.query(`sp_selVerificarPermisos '${req.user.codrol}','${opcsis}'`);
    if (permiso.recordset[0].acceso === 1) {
        console.log(ruta);
        res.render(ruta, { layout: false });
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
        res.render('configuracion/usuario', { layout: false });
    },
    async renderroles(req, res) {
        res.render('configuracion/permisos', { layout: false });
    },
    //historiaclinica
    async renderpacientes(req, res) {
        res.render('historiaclinica/paciente', { layout: false });
    },
    //entidades
    renderprotocolo(req, res) {
        const opcsis = "PT";
        permisos(opcsis, 'entidades/protocolo', req, res)
    },
};


