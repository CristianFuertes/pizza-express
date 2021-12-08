const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    paymentID:{
        type: String,
        required: true
    },
    address:{
        type: Object,
        default: []
    },
    cart:{
        type: Array,
        required: true
    },
    status:{
        type: Boolean,
        required: false
    }
},{
    timestamps:true
})

module.exports = mongoose.model("Payments", paymentSchema)