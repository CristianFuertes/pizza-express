require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const fileUpload = require('express-fileUpload')
const cookieParser = require('cookie-parser')
const path = require('path')

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(fileUpload({
    useTempFiles: true
}))


//Rutas
app.use('/user', require('./routes/userRouter'))
app.use('/api', require('./routes/categoryRouter'))
app.use('/api', require('./routes/upload'))
app.use('/api', require('./routes/productRouter'))
app.use('/api', require('./routes/paymentRouter'))


//Conexion a Mongodb
const URL = 'mongodb+srv://devat:devat123@cluster0.jtvkx.mongodb.net/ecommerce?retryWrites=true&w=majority';

mongoose.connect(URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(db => console.log("Conectado a la base de datos"))
.catch(err => console.log(err));

module.exports = mongoose;

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}


const PORT= process.env.PORT || 5000
app.listen(PORT, () =>{
    console.log('Servidor esta corriendo', PORT)

})

