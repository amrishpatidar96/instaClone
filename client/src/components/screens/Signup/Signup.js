import React,{useState} from 'react';
import classes from './Signin.module.css';
import {Link,useHistory} from 'react-router-dom';


const Signup = ()=>{

  const [name,setName] = useState("");
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

  const PostData = ()=>{
    //eslint-disable-next-line
    if(!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))){
      setErrStyle({...errStyle,display:'block'});
      setError("invalid email format");
      return ;
  }


    fetch("/signup",{
      method:"post",
      headers:{
        "Content-Type": "application/json"
      },
      body:JSON.stringify({
        name:name,
        email:email,
        password:password
      }),
      
    })
    .then(res=>res.json())
    .then(data=>{
      console.log(data);
        if(data.error){
          setError(data.error);
          console.log("rendring start");
          setErrStyle({
            ...errStyle,
            display:'block',
          });
        }
        else{
          setError(data.message);
          setErrStyle({
            ...errStyle,
            display:'block',
            backgroundColor:'green',
          });
          history.push("/signin");
          //setError(data.error);
        }
    })
    .catch(err=>{console.log(err)})
  }

  console.log("rendring new");

  const errorHandler = ()=>{
    setErrStyle({ 
      ...errStyle,
      display: 'none',
      });
  }

    return ( 
    <div className={classes.mycard}>
        <div className={["card",classes.authcard,classes.inputfield].join(" ")}>

          {error?<span style={errStyle} >{error} <strong style={{float:'right'}} onClick={errorHandler}>x</strong>  </span>:null}
          
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
          onChange={(event)=>setPassword(event.target.value)} />
          
          <input 
          type="text" 
          placeholder="username" 
          value={name}
          onChange={(e)=>setName(e.target.value)}/>

          <button 
          className={[classes.mybtn,"btn waves-effect waves-light"].join(" ")} 
          onClick={()=>PostData()}
          >
            Signup
          </button>

          <h6 >
              <Link to="./signin" >Already have an account ?</Link>
          </h6>
        </div>
    </div>);
}  

export default Signup;



