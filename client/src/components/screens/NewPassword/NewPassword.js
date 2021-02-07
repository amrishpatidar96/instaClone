import React,{useContext, useState}from 'react';
import classes from './Signin.module.css';
import {useHistory,useParams} from 'react-router-dom';
import Toast from '../../Toast/Toast'


const NewPassword = ()=>{

  const [password,setPassword] = useState("");
  const [message,setMessage] = useState("");
  const {token} = useParams("") ; 

  const history = useHistory(); 

  const PostData = ()=>{
    //eslint-disable-next-line
    if(!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/.test(password))){
      setMessage("invalid password format");
      return ;
    }


    fetch("/new-password",{
      method:"post",
      headers:{
        "Content-Type": "application/json"
      },
      body:JSON.stringify({
        password,
        token
      }),
      
    })
    .then(res=>{ return res.json()})
    .then(data=>{     
          setMessage(data.message);
          history.push("/signin");      
    })
    .catch(err=>{console.log(err)})
  }





    return (
      <div className={classes.mycard}>
          <div style={{position: 'absolute',right: '10px',top: '50px'}}>
            {message && <Toast message={message} show={true} />}
          </div>
        <div className={["card",classes.authcard,classes.inputfield].join(" ")}>
       
          
          <h3>New Password</h3>

          <input 
          type="password" 
          placeholder="New Password" 
          value={password}
          onChange={(event)=>{setPassword.bind(this,event.target.value)()}}
          />
                
          <button 
          className={[classes.mybtn,"btn waves-effect waves-light"].join(" ")} 
          type="submit"
          onClick={PostData}
          >
          change Password
          </button>
        </div>
      </div>
    );
}  

export default NewPassword;