const router = require('express').Router()
const cloudinary  = require('cloudinary')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const fs = require('fs')



// nosotros subiremos las imagenes en cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

// subir imagen solo administradores
router.post('/upload', auth, authAdmin, (req, res) =>{
    try {
        console.log(req.files)
        if(!req.files || Object.keys(req.files).length === 0)
            return res.status(400).json({msg: 'Ningun archivo fue cargado'})
        

        const file = req.files.file;
        if(file.size > 1024*1024 ) {
            removeTmp(file.tempFilePath)
            return res.status(400).json({msg: "El tamaño del archivo es muy grande"}) // 1024*1024 =1mb
        }
            
        if(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png'){
            removeTmp(file.tempFilePath)
            return res.status(400).json({msg: "El formato del archivo es incorrecto"})
        }

        cloudinary.v2.uploader.upload(file.tempFilePath, {folder: "test"}, async(err, result) =>{
            if(err) throw err;

            removeTmp(file.tempFilePath)
            res.json({public_id: result.public_id, url: result.secure_url})


        })
    } catch (err) {
        return res.status(500).json({msg: err.message})
        
    } 
})

//Borrar imagen solo admin
router.post('/destroy', auth, authAdmin,  (req, res) =>{
    try {
        const {public_id} = req.body;
        if(!public_id)  return res.status(400).json({msg: 'Imagen no seleccionada'})

        cloudinary.v2.uploader.destroy(public_id, async(err, result) =>{
            if(err) throw err;

            res.json({msg: "Imagen Eliminada"})
        })

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
    
})

const removeTmp = (path) =>{
    fs.unlink(path, err=>{
        if(err) throw err;
    })
}

module.exports = router