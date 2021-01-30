import React,{useEffect,createContext,useReducer, useContext} from "react";
import NavBar from "./components/Navbar/Navbar";
import { Route, Switch,useHistory,useRouteMatch} from "react-router-dom";
import Home from "./components/screens/Home/Home";
import Signin from "./components/screens/Signin/Signin";
import Signup from "./components/screens/Signup/Signup";
import Profile from "./components/screens/Profile/Profile";
import CreatePost from "./components/screens/CreatePost/CreatePost";
import UserProfile from "./components/screens/UserProfile/UserProfile";

import {reducer,initialState} from './reducers/userReducer';


export const UserContext = createContext();

const Routing = (props)=>{
    console.log("rendering");
    const history = useHistory();
    const {state,dispatch} = useContext(UserContext);
   
    if(!state){
      history.push('/signin');
    }


    useEffect(()=>{
      const user = JSON.parse(localStorage.getItem("user"));
      console.log("refresh");
      console.log(user);
      if(user){
        dispatch({type:"USER",payload:user})
        history.push("/");
      }
      else{
        history.push('/signin')
      }
    
    
    },[])

    return(
      <Switch>
          <Route exact path="/signin" component={Signin} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/createpost" component={CreatePost} />
          <Route exact path="/profile/:userId" component={UserProfile} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/" component={Home} />
      </Switch>
    );
}

function App() {

  const [state,dispatch] = useReducer(reducer,initialState);
  console.log("rendering");
  return (
    <div>
      <UserContext.Provider value={{state,dispatch}} >
        <NavBar />
        <Routing/>
      </UserContext.Provider>
    </div>
  );
}

export default App;
