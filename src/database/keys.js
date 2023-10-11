module.exports={

    dbSettings : {
        user: 'siscsp',
        password: 'C1n1c4123*',
        server: '198.251.67.234',
        database: 'salud_BD',
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
