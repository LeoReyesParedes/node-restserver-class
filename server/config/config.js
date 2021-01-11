// puerto
process.env.PORT = process.env.PORT || 3000;

// entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// db
let urlDB

if(process.env.NODE_ENV === 'dev')
    urlDB = 'mongodb://localhost:27017/cafe'
else
    urlDB = 'mongodb+srv://strider:8EPx2kNqhpGQOo3w@cluster0.1joqd.mongodb.net/cafe'

process.env.URLDB = urlDB