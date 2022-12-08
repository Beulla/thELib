import { render } from "@testing-library/react";
import { useState } from "react";
import { Route, Routes } from "react-router";
import axios from "axios";
import { Form, Link } from "react-router-dom";
import "./addBook.css"
export default function AddBook(){
    const[bookId,setbookId]=useState('')
    const[bookName,setbookName]=useState('')
    const[bookAuthor,setbookAuthor]=useState('')
    const[summary,setsummary]=useState('')

    const handlebookIdChange=event=>{
        setbookId(event.target.value)
    }
    const handlebookNameChange=event=>{
        setbookName(event.target.value)
    }
    const handlebookAuthorChange=event=>{
        setbookAuthor(event.target.value)
    }
    const handlesummaryChange=event=>{
        setsummary(event.target.value)
    }
    const formData=new FormData()
    formData.append("",bookId)
    formData.append("",bookName)
    formData.append("",bookAuthor)
    formData.append("",summary)
    const handleSubmit=async(event)=>{
        event.preventDefault()
        try{
            const headers=  {
                'content-type':'application/json',
                'Access-Control-Allow-Origin':'*',
                'Access-Control-Allow-Headers': ["Access-Control-Allow-Headers,Access-Control-Allow-Origin, X-Requested-With, Content-Type, Accept"]
                }
            const res = await axios.post("/addtrend", formData, { headers: headers })
            console.log(res.data);
        }
        catch (error) {
            console.log("error: ", error)
     }
    }
    return(
        <div id="body">
            <div id="heading">Add a book</div>
                <form method="post" onSubmit={handleSubmit} id="bookform">
                    <label>Book ISBN</label>
                    <input type="text" id="bookId" value={bookId} onChange={handlebookIdChange}/>
                    <label>Book Name</label>
                    <input type="text" id="name" value={bookName} onChange={handlebookNameChange}/>
                    <label>Book Author</label>
                    <input type="text" id="author" value={bookAuthor} onChange={handlebookAuthorChange}/>
                    <label>Book Summary</label>
                    <input type="text" id="summary" value={summary} onChange={handlesummaryChange}/>
                    <button type="submit" className="btn btn-success">Add</button>
                </form>
            
        </div>
    )
}