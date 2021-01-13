require('./config/config')

const path = require('path')

const express = require('express')
const app = express()

const mongoose = require('mongoose')

const bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
// habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')))
// configuracion global de rutas
app.use(require('./routes/index'))

mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
},(err, res) => {
    if(err) throw `ERROR!!: ${err}`

    console.log('Bd online')
})
 
app.listen(process.env.PORT, () => console.log('Escuchando puerto 3000'))