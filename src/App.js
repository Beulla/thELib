import logo from './logo.svg';
import './App.css';
import { Route, Router, Routes } from 'react-router';

import { Fragment } from 'react';
import RegisterBook from './pages/addBook';
import { BrowserRouter } from 'react-router-dom';
import FetchBooks from './pages/fetchBooks';

function App() {
  return (
        <BrowserRouter>
        <Routes>
        <Route exact path="/book/new" element={<RegisterBook />} />  
        <Route exact path="/books" element={<FetchBooks/>}/>
        </Routes>
        
        </BrowserRouter>
          
        
  );
}

export default App;
