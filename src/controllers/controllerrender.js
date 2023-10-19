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
    async renderprotocolo(req, res) {
        const parametro = "PT";
        permisos(parametro,'entidades/protocolo', req, res)
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
        permisos(parametro,'entidades/paciente', req, res);       
    },
    async renderpacientecreate(req, res) {
        const parametro = "PC";
        permisos(parametro,'entidades/paciente', req, res,0);
    },async renderpacienteedit(req, res) {
        const { id } = req.params;
        const parametro = "PC";
        permisos(parametro,'entidades/paciente', req, res,id);
    },
    /*Cita */
    async rendercita(req, res) {
        const parametro = "CT";
        permisos(parametro,'entidades/cita', req, res)
    },
    async rendercitacreate(req, res) {
        const parametro = "CT";
        //res.render('entidades/citaCreate', { layout: false, id: 0 });
        permisos(parametro,'entidades/citaCreate', req, res,0)
    },
    async rendercitaedit(req, res) {
        const { id } = req.params;
        const parametro = "CT";
        permisos(parametro,'entidades/citaCreate', req, res,id)
    },
    async renderemedico(req, res) {
        res.render('entidades/medicos', { layout: false });
    },
    async rendercliente(req, res) {
        res.render('entidades/cliente', { layout: false });
    },

};
