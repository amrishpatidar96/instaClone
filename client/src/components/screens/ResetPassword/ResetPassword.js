import React,{useContext, useState}from 'react';
import classes from './Signin.module.css';
import {Link,useHistory} from 'react-router-dom';
import Toast from '../../Toast/Toast'


const ResetPassword = ()=>{

  const [email,setEmail] = useState("");
  const [error,setError] = useState("");
  const [message,setMessage] = useState("")

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


    fetch("/reset-password",{
      method:"post",
      headers:{
        "Content-Type": "application/json"
      },
      body:JSON.stringify({
        email:email
      }),
      
    })
    .then(res=>{ return res.json()})
    .then(data=>{     
          setMessage(data.message);
          //history.push("/");      
    })
    .catch(err=>{console.log(err)})
  }


const errSignin = error?(<span style={errStyle} >{error} <strong style={{float:'right'}} onClick={errorHandler}>x</strong>  </span>):null;



    return (
      <div className={classes.mycard}>
          
        <div className={["card",classes.authcard,classes.inputfield].join(" ")}>
          {errSignin}
          <Toast message={message} show={true} />
          <h3>Reset Password</h3>

          <input 
          type="text" 
          placeholder="email" 
          value={email}
          onChange={(event)=>{setEmail.bind(this,event.target.value)()}}
          />
          
          
          <button 
          className={[classes.mybtn,"btn waves-effect waves-light"].join(" ")} 
          type="submit"
          onClick={PostData}
          >
          Send Email
          </button>
        </div>
      </div>
    );
}  

export default ResetPassword;