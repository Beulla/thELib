const mongoose=require("mongoose");

module.exports=mongoose.connect(`mongodb://localhost:27017/library`,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false
})
.then(result=>{
    console.log(`connected to database`);
}).catch(err=>console.log(err))