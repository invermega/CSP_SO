const { getConnection } = require('../database/conexionsql');

async function permisos(opcsis, ruta, req, res) {
    const pool = await getConnection();
    const permiso = await pool.query(`sp_selVerificarPermisos '${req.user.codrol}','${opcsis}'`);
   
    if (permiso.recordset[0].acceso === 1) {
        
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
        const parametro="US";
        permisos(parametro, 'configuracion/usuario',req,res)

    },
    async renderroles(req, res) {
        const parametro="PE"
        permisos(parametro,'configuracion/permisos',req,res);
    },
    //historiaclinica
    async renderpacientes(req, res) {
        const parametro ="PC" ;
        permisos(parametro,'historiaclinica/paciente', req,res)

    },
    //entidades
    renderprotocolo(req, res) {
        const parametro = "PT";
        permisos(parametro, 'entidades/protocolo', req, res)
    },
};

