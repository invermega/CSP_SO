const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/.env' });
const express = require('express');
const morgan = require('morgan');
const { create } = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const { dbSettings } = require('./database/keys');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const Sequelize = require('sequelize');
const MSSQLStore = require('express-session-sequelize')(session.Store);
const basicAuth = require('basic-auth');
const app = express();

//a
require('./lib/passport');

// Manejo de uncaughtException
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Realiza tareas de limpieza si es necesario
  
  // Detén el servidor para evitar que siga manejando solicitudes con problemas
  //process.exit(1); // Código 1 indica que ocurrió un error
});

app.set('port', process.env.PORT || 3300);
app.set('views', path.join(__dirname, 'views'));
const exphbs = create({
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  defaultLayout: 'main',
});
app.engine('.hbs', exphbs.engine);
app.set('view engine', '.hbs');

app.use(cookieParser('secret'));

app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 43200000 // 12 horas en milisegundos
    },
    store: new MSSQLStore({
      db: new Sequelize(dbSettings.database, dbSettings.user, dbSettings.password, {
        host: dbSettings.server,
        dialect: 'mssql',
        port: 10200,
        dialectOptions: {
          options: {
            encrypt: dbSettings.options.encrypt,
            trustServerCertificate: dbSettings.options.trustServerCertificate
          }
        },
        logging: false // Desactivar el registro de consultas SQL
      }),
      checkExpirationInterval: 15 * 60 * 1000, // Intervalo para comprobar las sesiones expiradas (en milisegundos)
      expiration: 24 * 60 * 60 * 1000 // Tiempo de expiración de la sesión (en milisegundos)
    })
  })
);

app.use(flash());

app.use(
  morgan('dev', {
    skip: (req, res) => req.originalUrl === '/ruta-de-verificacion-de-sesion'
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.message = req.flash('message');
  res.locals.user = req.user;
  next();
});

app.use(require('./routes/'));
app.use(require('./routes/configuracion'));
app.use(require('./routes/historiaclinica'));
app.use(require('./routes/entidades'));
/*
const auth = (req, res, next) => {
  const credentials = basicAuth(req);

  if (!credentials || credentials.name !== 'usuario' || credentials.pass !== 'contraseña') {
    res.set('WWW-Authenticate', 'Basic realm="example"');
    return res.status(401).send('Authentication required.');
  }

  next();
};
app.use('/img/paciente', auth, express.static(path.join(__dirname, 'public', 'img', 'paciente')));*/
app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), () => {
  console.log('Server on port', app.get('port'));
});