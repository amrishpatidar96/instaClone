import React,{useContext, useState}from 'react';
import classes from './Signin.module.css';
import {Link,useHistory} from 'react-router-dom';
import {UserContext} from '../../../App';
const Signin = ()=>{
  const {state,dispatch} = useContext(UserContext);
  const [password,setPassword] = useState("");
  const [email,setEmail] = useState("");
  const [error,setError] = useState("");
  const [errStyle,setErrStyle] = useState({
    display: 'none',
    padding: '10px',
    backgroundColor: '#f44336',
    color: 'white',
    opacity:'0.5',
    cursor: 'pointer'
  });
  
  const history = useHistory(); 

  const errorHandler = ()=>{
    setError("");
    setErrStyle({ 
      ...errStyle,
      display: 'none',
      });
  }

  const PostData = ()=>{
    //eslint-disable-next-line
    if(!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))){
      
      setErrStyle({
        ...errStyle,
        display:'block'});

      setError("invalid email format");
      return ;
    }

    console.log(email+" "+password);

    fetch("/signin",{
      method:"post",
      headers:{
        "Content-Type": "application/json"
      },
      body:JSON.stringify({
        email:email,
        password:password
      }),
      
    })
    .then(res=>{console.log(res); return res.json()})
    .then(data=>{
       console.log(data);
        if(data.error){
          setError(data.error);
          //console.log("rendring start");
          setErrStyle({
            ...errStyle,
            display:'block',
          });
        }
        else{
          
          localStorage.setItem("jwt",data.token);
          localStorage.setItem("user",JSON.stringify(data.currentUser));
          dispatch({type:"USER",payload:data.currentUser});
          setError(data.message);
          setErrStyle({
            ...errStyle,
            display:'block',
            backgroundColor:'green',
          });
          history.push("/");
        }
    })
    .catch(err=>{console.log(err)})
  }


const errSignin = error?(<span style={errStyle} >{error} <strong style={{float:'right'}} onClick={errorHandler}>x</strong>  </span>):null;



    return (
      <div className={classes.mycard}>
        <div className={["card",classes.authcard,classes.inputfield].join(" ")}>
          {errSignin}

          <h3>Instagram</h3>

          <input 
          type="text" 
          placeholder="email" 
          value={email}
          onChange={(event)=>{setEmail.bind(this,event.target.value)()}}
          />
          
          <input 
          type="password" 
          placeholder="password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)} />
          
          <button 
          className={[classes.mybtn,"btn waves-effect waves-light"].join(" ")} 
          type="submit"
          onClick={PostData}
          >
            Signin
          </button>,

          <h6 >
            <Link to="./signup" >create new account</Link> 
          </h6>
        </div>
      </div>
    );
}  

export default Signin;