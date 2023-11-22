const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const helpers = {};

helpers.EncriptarPass = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

helpers.matchPassword = async (password, savedPassword) => {
    try {
        return await bcrypt.compare(password, savedPassword);
    } catch (error) {
        console.log(error);
    }
};

//funcion para encriptar los id en una tabla
helpers.encriptarConClavePublica =function (valor) {
    const buffer = Buffer.from(valor, 'utf8');
    const cifrado = crypto.publicEncrypt('MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA', buffer);
    return cifrado.toString('base64');
};


//funcion para desencriptar los id en una tabla
helpers.desencriptarConClavePrivada= function (valorEncriptado) {
    const buffer = Buffer.from(valorEncriptado, 'base64');
    const descifrado = crypto.privateDecrypt('MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIB', buffer);
    return descifrado.toString('utf8');
  };

module.exports = helpers;
