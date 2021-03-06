import React from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./screens/home";
import MainDashboard from './screens/MainDashboard';
import ClassWithNavbar from './screens/ClassWithNavbar';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/dashboard' element={<MainDashboard/>}/>
          <Route  path="/class/:id" element={<ClassWithNavbar/>}/>
        </Routes>
      </Router>
    </div>
  );
}


export default App;
