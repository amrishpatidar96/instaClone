import React,{useState,useEffect} from 'react';
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
  const [image,setImage] = useState("");
  const [url,setUrl] = useState("");
  
  const history = useHistory(); 
  
  const uploadImage = ()=>{

    const data  = new FormData();
    data.append("file",image);
    data.append("upload_preset","instaclone");
    data.append("cloud_name","instagramclone1");
    fetch("https://api.cloudinary.com/v1_1/instagramclone1/image/upload",{
      method: "post",
      body: data
    })
    .then(res=>res.json())
    .then(data=>{
      setUrl(data.url);
    })
    .catch(err=>console.log(err))
  }




  useEffect(()=>{
    
   if(url){
    fetch("/signup",{
      method:"post",
      headers:{
        "Content-Type": "application/json"
      },
      body:JSON.stringify({
        name:name,
        email:email,
        password:password,
        pic:url
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

  },[url]);







  const PostData = ()=>{

    if(!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))){
      setErrStyle({...errStyle,display:'block'});
      setError("invalid email format");
      return ;
    }



    if(image){
      uploadImage();
    }
    else{
      fetch("/signup",{
        method:"post",
        headers:{
          "Content-Type": "application/json"
        },
        body:JSON.stringify({
          name:name,
          email:email,
          password:password,
          pic:url
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

    //eslint-disable-next-line
   


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
          
          <div className="file-field" style={{marginTop:'16px'}}>
              <div className={[classes.mybtn,"btn"].join(" ")}>
                <span>File</span>
                <input type="file"  onChange={(e)=>{setImage(e.target.files[0])}}/>
              </div>
              <div className="file-path-wrapper">
                <input
                  className="file-path validate"
                  type="text"
                  placeholder="Upload one or more files"
                  value={image?image.name:""}
                  readOnly
                />
              </div>
          </div>

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



