import React from "react";
import axios from "axios";
import "./books.css"
import { Link } from "react-router-dom";
class AllBooks extends React.Component{
    constructor(){
        super()
        this.state = { data: [],offset: 0, perPage:6,currentPage:0,postData:[]};
        this.handlePageClick=this.handlePageClick.bind(this)
    }
    books=[]

    resp(){
        const headers=  {
            'content-type':'application/json',
            'Access-Control-Allow-Origin':'*',
            'Access-Control-Allow-Headers': ["Access-Control-Allow-Headers,Access-Control-Allow-Origin, X-Requested-With, Content-Type, Accept"]
            }

            axios.get("/fetchBooks",{headers:headers})
            .then(response => {
                this.books=response.data
                let slice=this.books.slice(this.state.offset,this.state.offset+this.state.perPage,1)
                slice=slice.slice(1)
                const postData=slice.map(book=>
                  <React.Fragment>
                    <div className="data mt-5" >
                    <span className="w-100 titles">{book.bookName}</span>
                    <button className="readMorebtn"><Link to={`books/${book.bookId}`} id="link1"className="mylink">Read more</Link></button>
                    </div>
                  </React.Fragment>
                  )
                
                  
                  this.setState({ data: this.resp });
  
                this.setState({
                  pageCount:Math.ceil(this.books.length/this.state.perPage),
                  postData
                })
                
      }).catch((e) => {
                console.log(e);
      })
    }
    handlePageClick=(e)=>{
        const selectedPage=e.selected;
        const offset=selectedPage*this.state.perPage;
      
        this.setState({
          currentPage:selectedPage,
          offset:offset
        },()=>{
          this.componentDidMount()
        })
      }
       
      async componentDidMount(){
        this.resp()
      
      } 
        render(){
           return(
               <div id="table" className="w-75">
                 <h3>Books</h3>
                 <button id="button" className="btn btn-success p-2">
                   <Link to="/book/new" className="text-white">Add Book</Link></button>
                 <table className="table table-responsive table-striped table-bordered">
                   <thead className="thead-dark">
                   <tr>
                       <th>Book ISBN</th>
                       <th>Book Name</th>
                       <th>Book Author</th>
                   </tr>
                   </thead>

                   <tbody>
                   <tr>
                       <td>978-3-16-148410-0</td>
                       <td>Fooled by randomness</td>
                       <td>Nassim Nicholas</td>
                       <td><i class='fa fa-pencil'></i></td>
                       <td><i class='fa fa-trash'></i></td>
                   </tr>
                   <tr>
                       <td>978-3-16-148410-0</td>
                       <td>Fooled by randomness</td>
                       <td>Nassim Nicholas</td>
                       <td><i class='fa fa-pencil'></i></td>
                       <td><i class='fa fa-trash'></i></td>
                   </tr>
                   <tr>
                       <td>978-3-16-148410-0</td>
                       <td>Fooled by randomness</td>
                       <td>Nassim Nicholas</td>
                       <td><i class='fa fa-pencil'></i></td>
                       <td><i class='fa fa-trash'></i></td>
                   </tr>
                   <tr>
                       <td>978-3-16-148410-0</td>
                       <td>Fooled by randomness</td>
                       <td>Nassim Nicholas</td>
                       <td><i class='fa fa-pencil'></i></td>
                       <td><i class='fa fa-trash'></i></td>
                   </tr>
                   <tr>
                       <td>978-3-16-148410-0</td>
                       <td>Fooled by randomness</td>
                       <td>Nassim Nicholas</td>
                       <td><i class='fa fa-pencil'></i></td>
                       <td><i class='fa fa-trash'></i></td>
                   </tr>
                   <tr>
                       <td>978-3-16-148410-0</td>
                       <td>Fooled by randomness</td>
                       <td>Nassim Nicholas</td>
                       <td><i class='fa fa-pencil'></i></td>
                       <td><i class='fa fa-trash'></i></td>
                   </tr>
                   </tbody>
                   
                 </table>
              </div>
           )
            
            
          }
        }
        export default AllBooks;
