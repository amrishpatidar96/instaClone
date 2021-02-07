import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import classes from "./Navbar.module.css";
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
        <NavLink  className={classes.tab}    activeClassName={classes.active}  to="/profile">Profile</NavLink>
      </li>,
      <li key="/createpost">
        <NavLink  className={classes.tab}    activeClassName={classes.active} to="/createpost">CreatePost</NavLink>
      </li>,
      <li key="/followingposts">
        <NavLink  className={classes.tab}    activeClassName={classes.active} to="/followingposts">FollowingPosts</NavLink>
      </li>,
      <li key="/logout">
        <NavLink  className={classes.tab}    activeClassName={classes.active} to="/signin"   onClick={logout} >Logout</NavLink>
      </li>

       ];
     }
    else{
      return [
        <li key="/signin">
        <NavLink  className={classes.tab}    activeClassName={classes.active}  to="/signin">Signin</NavLink>
      </li>,
      <li key="/signup">
        <NavLink  className={classes.tab}    activeClassName={classes.active}   to="/signup">Signup</NavLink>
      </li>
      ]
    }

  }
  return (
    <nav>
      <div className="nav-wrapper white">
        <NavLink  className={classes.tab}     to="/" className="brand-logo left" style={{ fontFamily: 'Grand Hotel,cursive',color: 'black'}}>
          Instagram
        </NavLink>
        <ul id="nav-mobile" className="right">

        {renderList()}

        </ul>
      </div>
    </nav>
  );
};
export default NavBar;
