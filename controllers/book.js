const books=require("../models/books")
const Joi=require("joi")
const validations=Joi.object().keys({
    title:Joi.string().min(2).max(1000).required(),
    description:Joi.string().min(500).max(10000).required(),    
})

exports.addBook=async (req,res)=>{
        validations.validate(req.body)
        if(books.findOne(bookId=req.body.bookId)){
            res.json({
                err:err,
                message:`the book with the same asbn already exists`,
            })
        }
        else{
            const newBook=new books({
                bookId:req.body.bookId,
                bookName: req.body.bookName,
                bookAuthor:req.body.bookAuthor,
                bookSummary:req.body.summary
            })
            await newBook.save()
        }
    }

exports.fetchBooks=async(req,res)=>{           
            let findbooks=await books.find().sort({createdAt:-1})
            
            res.send(findbooks)
            return(findbooks)
}
exports.fetchBook=async(req,res)=>{
    let getbook=await books.findOne({bookId:req.params.bookId})
            res.send(getbook)
            return(getbook)
}

exports.deleteBook=async(req,res)=>{
    let deleteBook=await books.delete({bookId:req.params.bookId})
    res.send("successfully delete book")
}

        
        
    
    

    