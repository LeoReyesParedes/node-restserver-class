const express = require('express')
const app = express()

const {verificaToken, verificaAdminRole} = require('../middlewares/autenticacion')

let Categoria = require('../models/categoria')

app.get('/categoria', verificaToken, (req, res) => {
    let desde = req.query.desde || 0
    desde = Number(desde)

    let limite = req.query.limite || 10
    limite = Number(limite)

    Categoria.find({}, 'descripcion usuario')
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .sort('descripcion')
        .exec((err, categorias) =>{
            if(err)
                return res.status(400).json({
                    ok: false,
                    err
                })

            Categoria.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    cuantos: conteo
                })
            })
        })
})

app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id

    Categoria.findById(id, 'descripcion usuario')
        .populate('usuario', 'nombre')
        .exec((err, categoria) =>{
            if(err)
                return res.status(400).json({
                    ok:false,
                    err
                })

            if(!categoria)
                return res.status(400).json({
                    ok:false,
                    err: {
                        message: 'La categoría no existe'
                    }
                })

            res.json({
                    ok: true,
                    categoria
                })
        })
})

app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })

    categoria.save((err, categoriaDB) => {
        if(err)
            return res.status(400).json({
                ok: false,
                err
            })
        
        if(!categoriaDB)
            return res.status(400).json({
                ok: false,
                err
            })

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
})

app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id
    let body = req.body
    let descripcionCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, descripcionCategoria, {new: true, runValidators: true}, (err, categoriaDB) => {
        if(err)
            return res.status(400).json({
                ok: false,
                err
            })
        if(!categoriaDB)
            return res.status(400).json({
                ok: false,
                err
            })
        res.json({
            ok: true,
            usuario: categoriaDB
        })
    })
})

app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if(err)
            return res.status(400).json({
                ok: false,
                err
            })

        if(!categoriaBorrada)
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada.'
                }
            })
        
        res.json({
            ok: true,
            message: 'Categoria borrada.'
        })
    })
})

module.exports = app