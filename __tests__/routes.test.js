const routes=require("../routes/bookRoutes")
const request=require("supertest")
const express=require("express")
const bodyParser=require("body-parser")
const req = require("express/lib/request")
const app=express()
app.use(bodyParser.json())
app.use('/books',routes)

describe("testing books' routes",()=>{
    it("GET /allBooks - success",async()=>{
        const {body}=await request(app).get("/allBooks")
        expect(body).toEqual(NotNull)

    });
    it("GET /book/:bookId -success",async()=>{
        const {body}=await request(app).get(`/book/:010101}`)
        expect(body).toEqual(null)
    })
    it("POST /addBook -success",async()=>{
        let book={
            bookId:099939393,
            bookName: "fooled by randomness",
            bookAuthor:"unknown",
            bookSummary:"kkkk"
        }
        const {body}=await (await request(app).post("/addBook")).setEncoding(book)
        expect(body).toEqual({
            status:"success"
        })
    })
})