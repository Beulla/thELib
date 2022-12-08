const mongoose=require("mongoose")
const books=new mongoose.Schema({
    bookId:{
        type: Number,
        required: true
    },
    bookName:{
        type: String,
        required: true
    },
    bookAuthor:{
        type: String,
        required: true
    },
    bookSummary:{
        type:String,
        required: true
    }
})

module.exports=new mongoose.model("Books",books);