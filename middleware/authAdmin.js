const Users = require('../models/userModel')

const authAdmin = async (req, res, next) =>{
    try {
        //Tomar informacion por id
        const user = await Users.findOne({
            _id: req.user.id
        })
        if(user.role === 0)
            return res.status(400).json({msg: "Recursos de acceso de administrador denegado"})

        next()
    } catch (err) {
        return res.status(500).json({msg: err.message})
        
    }
}

module.exports = authAdmin