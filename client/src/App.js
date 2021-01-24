import React,{useEffect,createContext,useReducer, useContext} from "react";
import NavBar from "./components/Navbar/Navbar";
import { Route, Switch,useHistory} from "react-router-dom";
import Home from "./components/screens/Home/Home";
import Signin from "./components/screens/Signin/Signin";
import Signup from "./components/screens/Signup/Signup";
import Profile from "./components/screens/Profile/Profile";
import CreatePost from "./components/screens/CreatePost/CreatePost";
import {reducer,initialState} from './reducers/userReducer';


export const UserContext = createContext();

const Routing = ()=>{
    console.log("rendering");
    const history = useHistory();
    const {state,dispatch} = useContext(UserContext);
    useEffect(()=>{
      const user = JSON.parse(localStorage.getItem("user"));
      if(user){
        dispatch({type:"USER",payload:user})
        history.push('/')
      }
      else{
        history.push('/signin')
      }
    
    
    },[])

    return(
      <Switch>
          <Route path="/profile" component={Profile} />
          <Route path="/signin" component={Signin} />
          <Route path="/signup" component={Signup} />
          <Route path="/createpost" component={CreatePost} />
          <Route path="/" exact component={Home} />
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
