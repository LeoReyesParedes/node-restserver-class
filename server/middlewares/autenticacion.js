const jwt = require('jsonwebtoken')
// verificar token
let verificaToken = (req, res, next) => {
    let token = req.get('Authorization')

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if(err)
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido.'
                }
            })
        
        req.usuario = decoded.usuario
        next()
    })
}
// verifica admin role
let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario

    if(usuario.role !== 'ADMIN_ROLE')
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador.'
            }
        })
    
    next()
}

// verifica token para imagen
let verificaTokenImagen = (req, res, next) => {
    let token = req.query.token

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if(err)
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido.'
                }
            })
        
        req.usuario = decoded.usuario
        next()
    })
}

module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenImagen
}