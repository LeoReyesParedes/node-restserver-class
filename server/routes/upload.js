const express = require('express')
const app = express()

const fileUpload = require('express-fileupload')

const fs = require('fs')

const path = require('path')

const Usuario = require('../models/usuario')

const Producto = require('../models/producto')

app.use(fileUpload({useTempFiles: true}))

app.put('/upload/:tipo/:id', (req, res) => {
    let tipo = req.params.tipo
    let id = req.params.id

    if(!req.files)
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo.'
            }
        })

    let tiposValidos = ['producto', 'usuario']

    if(tiposValidos.indexOf(tipo) < 0)
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Tipo no válido, solo se permiten: ' + tiposValidos.join(' y '),
                tipo
            }
        })

    let archivo = req.files.archivo

    let nombreCortado = archivo.name.split('.')
    let extension = nombreCortado[nombreCortado.length -1]
    // extensiones permitidas
    let extencionesValida = ['png', 'jpg', 'gif', 'jpeg']

    if(extencionesValida.indexOf(extension) < 0)
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Formato no válido, solo se permiten: ' + extencionesValida.join(', '),
                extension
            }
        })
    // cambiamos nombre de archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if(err)
            return res.status(500).json({
                ok: false,
                err
            })
        switch(tipo){
            case 'usuario':
                imagenUsuario(id, res, nombreArchivo)
                break
            case 'producto':
                imagenProducto(id, res, nombreArchivo)
                break
        }
        
    })
})

function imagenUsuario(id, res, nombreArchivo){
    Usuario.findById(id, (err, usuarioDB) => {
        if(err){
            borrarArchivo(nombreArchivo, 'usuario')
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if(!usuarioDB){
            borrarArchivo(nombreArchivo, 'usuario')
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Usuario no existe.'
                }
            })
        }
        borrarArchivo(usuarioDB.img, 'usuario')

        usuarioDB.img = nombreArchivo

        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        })
    })
}

function imagenProducto(id, res, nombreArchivo){
    Producto.findById(id, (err, productoDB) => {
        if(err){
            borrarArchivo(nombreArchivo, 'producto')
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if(!productoDB){
            borrarArchivo(nombreArchivo, 'producto')
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Producto no existe.'
                }
            })
        }
        borrarArchivo(productoDB.img, 'producto')

        productoDB.img = nombreArchivo

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })
        })
    })
}

function borrarArchivo(nombreImagen, tipo){
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`)
    
    if(fs.existsSync(pathImagen))
        fs.unlinkSync(pathImagen)
}

module.exports = app