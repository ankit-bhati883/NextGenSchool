import React from "react";
import Navbar from "../components/Navbar";
import Class from "./Class";
function ClassWithNavbar(){
    return(
      <div>
        <Navbar add={false}/> 
        <Class/>
      </div>
    )
  }

export default ClassWithNavbar