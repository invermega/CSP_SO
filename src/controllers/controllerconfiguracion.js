const { getConnection } = require('../database/conexionsql');
const passport = require('passport');

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
    async postaccesos(req, res) {
        const data = req.body.data;
        const usenam = '';
        const hostname = '';
        const pool = await getConnection();
        for (let i = 0; i < data.length; i++) {
            const codrol = data[i].codrol;
            const opcsis = data[i].opcsis;
            const estado = data[i].estado;
            const lectura = data[i].lectura;
            const escritura = data[i].escritura;
            await pool.query(`sp_insAccesos '${opcsis}','${codrol}','${estado}','${lectura}','${escritura}','${usenam}','${hostname}'`);
        }
        res.json('Completado');
    },



};