import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./Navbar.module.css";
import {UserContext} from '../../App';
import {Button} from 'reactstrap';

const NavBar = () => {

  const {state,dispatch} = useContext(UserContext);


  const logout = ()=>{
    localStorage.clear("");
    dispatch({type:"CLEAR",payload:null});
  }




  const renderList = ()=>{
    console.log(state);
    if(state)
     {
      return [
        <li key="/profile">
        <Link to="/profile">Profile</Link>
      </li>,
      <li key="/createpost">
        <Link to="/createpost">CreatePost</Link>
      </li>,
      <li key="/logout">
      <Button onClick={logout} style={{backgroundColor:"black"}}>Logout</Button>
    </li>

       ];
     }
    else{
      return [
        <li key="/signin">
        <Link   to="/signin">Signin</Link>
      </li>,
      <li key="/signup">
        <Link   to="/signup">Signup</Link>
      </li>
      ]
    }

  }
  return (
    <nav>
      <div className="nav-wrapper white">
        <Link to="#" className="brand-logo left" style={{ fontFamily: 'Grand Hotel,cursive' }}>
          Instagram
        </Link>
        <ul id="nav-mobile" className="right">

        {renderList()}

        </ul>
      </div>
    </nav>
  );
};
export default NavBar;
