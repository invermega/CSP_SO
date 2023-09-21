module.exports={

    dbSettings : {
        user: 'sa',
        password: 'sql2016$',
        server: '192.168.10.8',
        database: 'SALUD',
        options: {
            encrypt: true, // for azure
            trustServerCertificate: true // change to true for local dev / self-signed certs
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