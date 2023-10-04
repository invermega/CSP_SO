const { getConnection } = require('../database/conexionsql');
const passport = require('passport');
const helpers = require('../lib/helpers');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');


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
        const { codrol } = req.query;
        
        const pool = await getConnection();
        const accesos = await pool.query(`sp_selAccesos '${codrol}'`);
        res.json(accesos.recordset);
    },

    /************Usuario*******/
    async postusuario(req, res) {//agregar usuario
        const { usuario, contrasena, celular, app, apm, Nombres, fecnac, DNI, correo, direccion, sexo, codrol, iduser, opc, picuser } = req.body;
        //console.log(req.body);
        const passencrypt = await helpers.EncriptarPass(contrasena);
        const usenam = '';
        const hostname = '';
        const codrolUser = 1;
        const imagenBase64 = picuser;
        const rutaSalida = path.join(__dirname, '..', 'public', 'img', 'usuario', DNI + '.webp');
        if (fs.existsSync(rutaSalida)) {
            fs.unlinkSync(rutaSalida);
        }
        const imagenBase64SinPrefijo = imagenBase64.replace(/^data:image\/png;base64,/, '');
        const imagenBinaria = Buffer.from(imagenBase64SinPrefijo, 'base64');
        await sharp(imagenBinaria)
            .toFormat('webp')
            .toFile(rutaSalida);
        const pool = await getConnection();
        const response = await pool.query(`sp_insUsuario '${usuario.toUpperCase()}','${passencrypt}',${celular},'${app.toUpperCase()}','${apm.toUpperCase()}','${Nombres.toUpperCase()}','${DNI}','${fecnac}','${correo.toUpperCase()}','${direccion.toUpperCase()}','${codrol}', '${sexo.toUpperCase()}','${usenam}','${hostname}','${codrolUser}','${iduser}','${opc}'`);
        console.log(response.recordset);
        res.json(response.recordset);
    },
    async getusuarios(req, res) {//listar usuario para edicion
        const { parametro } = req.query;
        const codrolUser = 1;
        const pool = await getConnection();
        const response = await pool.query(`sp_selusuarios '${codrolUser}','${parametro}'`);

        res.json(response.recordset);
    },
    async deleteusuarios(req, res) {//eliminar usuario
        const { iduser } = req.body;
        const codrolUser = 1;
        const pool = await getConnection();
        const response = await pool.query(`sp_delUsuario '${codrolUser}','${iduser}'`);

        res.json(response.recordset);
    },
    async resetpass(req, res) {//resetear contraseña
        const { iduser } = req.body;        
        const codrolUser = 1;
        const pool = await getConnection();
        const user = req.user.usuario;
        const passencrypt = await helpers.EncriptarPass(user);
        const response = await pool.query(`sp_editPassUser '${codrolUser}','${iduser}','${passencrypt}'`);

        res.json(response.recordset);
    },

    /*************************/


};