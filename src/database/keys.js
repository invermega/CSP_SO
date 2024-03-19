const dotenv = require('dotenv');
module.exports={

    dbSettings : {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        server: process.env.DB_SERVER, // Cambiado de host a server
        database: process.env.DB_NAME,
        options: {
            encrypt: true, // for azure
            trustServerCertificate: true, // change to true for local dev / self-signed certs
            port:10200
        }
    }

    /*dbSettings : {
        user: 'sa',
        password: 'K4m3l0t590',
        server: '192.168.10.4',
        database: 'SALUD',
        options: {
            encrypt: false, // for azure
            trustServerCertificate: true // change to true for local dev / self-signed certs
        }
    }*/
}
