import React from "react";
import Navbar from "../components/Navbar";
import Dashboard from "./Dashboard";
function MainDashboard(){
    return(
      <div>
        <Navbar add={true}/> 
        <Dashboard/>
      </div>
    )
  }

export default MainDashboard