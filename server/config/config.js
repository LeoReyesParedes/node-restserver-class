// puerto
process.env.PORT = process.env.PORT || 3000;

// vencimiento token 60s60m24h30d
process.env.CADUCIDAD_TOKEN = '48h'

// seed de autentificación
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'

// entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// db
let urlDB

if(process.env.NODE_ENV === 'dev')
    urlDB = 'mongodb://localhost:27017/cafe'
else
    urlDB = process.env.MONGO_URI

process.env.URLDB = urlDB

// google client id
process.env.CLIENT_ID = process.env.CLIENT_ID || '663668799754-2idofsc0uvoqqhsphump8glj2iuvdohr.apps.googleusercontent.com'

//