const mongoose=require("mongoose")
const users=new mongoose.Schema({
    userId:{
        type: Number,
        required: false
    },
    userEmail:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
})

module.exports=new mongoose.model("users",users)