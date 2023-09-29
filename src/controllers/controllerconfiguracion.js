const { getConnection } = require('../database/conexionsql');
const passport = require('passport');
const helpers = require('../lib/helpers');

module.exports = {
    async postiniciarSesion(req, res, next) {
        passport.authenticate('local.iniciarsesion', (err, user, info) => {
            if (err) {
                // Ocurrió un error durante la autenticación
                return next(err);
            }
            if (!user) {
                // La autenticación falló, envía un JSON al frontend
                return res.json('error');
            }
            // Autenticación exitosa, inicia sesión en el objeto de solicitud
            req.login(user, function (err) {
                if (err) {
                    return next(err);
                }
                return res.redirect('/');
            });
        })(req, res, next);
    },

    async CerrarSesion(req, res) {
        req.logOut();
        res.redirect('/iniciarsesion');
    },

    async postgrupousuario(req, res) {
        const { nomrol } = req.body;
        const usenam = '';
        const hostname = '';
        const pool = await getConnection();
        await pool.query(`sp_insRolsistema '${nomrol.toUpperCase()}','${usenam}','${hostname}'`);
        res.json('completado');
    },
    async getroles(req, res) {
        const pool = await getConnection();
        const roles = await pool.query(`sp_selrol`);
        res.json(roles.recordset);
    },
    async getaccesos(req, res) {
        const {codrol} = req.query;
        const pool = await getConnection();
        const accesos = await pool.query(`sp_selAccesos '${codrol}'`);
        res.json(accesos.recordset);
    },
    
    /************Usuario*******/
    async postusuario(req, res) {//agregar usuario
        const { usuario,contrasena,celular,app,apm,Nombres,fecnac,DNI,correo,direccion,sexo,codrol,iduser,opc} = req.body;
        //console.log(req.body);
        const passencrypt = await helpers.EncriptarPass(contrasena);
        const usenam = '';
        const hostname = '';
        const codrolUser = 1;
        
        const pool = await getConnection();
        await pool.query(`sp_insUsuario '${usuario.toUpperCase()}','${passencrypt}',${celular},'${app.toUpperCase()}','${apm.toUpperCase()}','${Nombres.toUpperCase()}','${DNI}','${fecnac}','${correo.toUpperCase()}','${direccion.toUpperCase()}','${codrol}', '${sexo.toUpperCase()}','${usenam}','${hostname}','${codrolUser}','${iduser}','${opc}'`);
        res.json('completado');
    },
    async getusuarios(req, res) {//listar usuario para edicion
        const {parametro} = req.query;
        const codrolUser = 1;  
        const pool = await getConnection();
        const usuarios = await pool.query(`sp_selusuarios '${codrolUser}','${parametro}'`);
        
        res.json(usuarios.recordset);
    },
    async deleteusuarios(req, res) {//eliminar usuario
        const {iduser} = req.body;
        const codrolUser = 1;  
        const pool = await getConnection();
        const usuarios = await pool.query(`sp_delUsuario '${codrolUser}','${iduser}'`);
        
        res.json('completado');
    },
    async resetpass(req, res) {//resetear contraseña
        const {iduser} = req.body;
        console.log(iduser);
        const codrolUser = 1;  
        const pool = await getConnection();
        const usuarios = await pool.query(`sp_editPassUser '${codrolUser}','${iduser}'`);
        
        res.json('completado'); 
    },
   
    /*************************/


};