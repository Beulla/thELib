const {fetchBooks}=require("../controllers/fetchBooks")
const {addBook}=require("../controllers/addBook")
const {fetchBook}=require("../controllers/fetchBook")
const router=require("express").Router()

router.post("/addBook",addBook)
router.get("/allBooks",fetchBooks)
router.get("/book/:bookId",fetchBook)
module.exports=router