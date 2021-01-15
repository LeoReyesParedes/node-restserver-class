const express = require('express')
const app = express()

const {verificaToken} = require('../middlewares/autenticacion')

let Producto = require('../models/producto')

app.get('/producto', verificaToken, (req, res) => {
    Producto.find({}, 'nombre precioUni disponible categoria usuario')
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .sort('categoria')
        .exec((err, productos) => {
            if(err)
                return res.status(400).json({
                    ok: false,
                    err
                })

            Producto.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    cuantos: conteo
                })
            })
        })
})

app.get('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id
    
    Producto.findById(id, 'nombre precioUni disponible categoria usuario')
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productoDB) => {
            if(err)
                return res.status(400).json({
                    ok:false,
                    err
                })

            if(!productoDB)
                return res.status(400).json({
                    ok:false,
                    err: {
                        message: 'El producto no existe'
                    }
                })

            res.json({
                    ok: true,
                    producto: productoDB
                })
        })
})

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino

    let regexp = new RegExp(termino, 'i')

    Producto.find({nombre: regexp})
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if(err)
                return res.status(500).json({
                    ok: false,
                    err: 'ERRRRRR'
                })
            
            if(!productos)
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no existe'
                    }
                })

            res.json({
                ok: true,
                productos
            })
        })
})

app.post('/producto', verificaToken, (req, res) => {
    let body = req.body

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    })

    producto.save((err, productoDB) => {
        if(err)
            return res.status(500).json({
                ok: false,
                err
            })

        res.status(201).json({
            ok: true,
            usuario: productoDB
        })
    })
})

app.put('/producto/:id', verificaToken, (req, res) => {
    let body = req.body
    let id = req.params.id

    Producto.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, productoDB) => {
        if(err)
            return res.status(400).json({
                ok: false,
                err
            })
        if(!productoDB)
            return res.status(400).json({
                ok: false,
                err
            })
        res.json({
            ok: true,
            producto: productoDB
        })
    })
})

app.delete('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id
    let productoDisponible = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, productoDisponible, {new: true, runValidators: true}, (err, productoBorrado) => {
        if(err)
            return res.status(400).json({
                ok: false,
                err
            })

        if(!productoBorrado)
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado.'
                }
            })
        
        res.json({
            ok: true,
            message: 'Producto borrado',
            producto: productoBorrado
        })
    })
})

module.exports = app