const { getConnection } = require('../database/conexionsql');
const sql = require('mssql');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const helpers = require('../lib/helpers');

passport.use('local.iniciarsesion', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('username', sql.VarChar, username)
            .query(`SELECT * FROM USUARIO WHERE usuario = @username and estado='S'`);

        const rows = result.recordsets[0];
        
        if (rows.length > 0) {
            const user = rows[0];
            const validPassword = await helpers.matchPassword(password, user.contraseña);
            if (validPassword) {

                done(null, user);
                //done(null, user, {message: 'Acceso correcto'});
            } else {
                done(null, false);
                //done(null, false, {message: 'Contraseña incorrecta'});
            }
        } else {
            done(null, false);
            //done(null, false, {message: 'El usuario ingresado no existe o está desactivado'});
        }
    } catch (error) {
        done(error);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.iduser);
});

passport.deserializeUser(async (id, done) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`SELECT * FROM USUARIO WHERE iduser = @id and estado='S'`);

        const rows = result.recordsets[0];
        done(null, rows[0]);
    } catch (error) {
        done(error);
    }
});
