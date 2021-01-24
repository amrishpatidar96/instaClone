import React,{useEffect, useState} from "react";
import classes from "./CreatePost.module.css";
import Toast from '../../Toast/Toast';
import {useHistory} from 'react-router-dom'

const CreatePost = () => {

  const [title,setTitle] = useState("");
  const [body,setBody] = useState("");
  const [image,setImage] = useState("");
  const [url,setUrl] = useState("");
  const history = useHistory();
  const [isOpen,setIsOpen] = useState(false);
  const [message,setMessage] = useState("");


  const postDetails = ()=>{
    const data = new FormData();
    data.append("file",image);
    data.append("upload_preset","instaclone");
    data.append("cloud_name","instagramclone1");
    fetch("https://api.cloudinary.com/v1_1/instagramclone1/image/upload",{
      method:"post",
      body:data
    })
    .then(res=>res.json())
    .then(data=>{
      setUrl(data.url);
      console.log(
      title,
      body,
      data.url);
      


    })
    .catch(err=>console.log(err))

  }


  useEffect(()=>{

    if(url){
      fetch('/createpost',{
        method:'post',
        headers:{
          "Content-Type":"application/json",
          "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            title,
            body,
            pic:url
        })
      })
      .then(res=>res.json())
      .then(data=>{
        console.log(data);
        if(data.error){
          setMessage(data.error)
          setIsOpen(true);
        }
        else{
          
          setMessage("posted successfully")
          setIsOpen(true);
          history.push("/");
        }
      }).catch(err=>console.log(err))
    }

  },[url]);



  return (
    <div>
      <div> 
      <div
      className={[classes.inputfield,classes.form,"card input-filled"].join(" ")}
    >
      <h4>Create Post</h4>
      <input 
      type="text" 
      placeholder="Title" 
      onChange={e=>{setTitle(e.target.value)}}
      value={title}
      
      />
      <input 
      type="text" 
      placeholder="Body" 
      onChange={e=>{setBody(e.target.value)}}
      value={body}
      />

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

      <div className={["btn",classes.mybtn].join(" ")} 
      style={{marginTop:'16px'}}
      onClick={()=>postDetails()}
      >
        Submit Post
      </div>

    </div>

    </div>
    <div >
      {isOpen ? <Toast message={message} show={isOpen}/>:" "}
    </div>
    </div>
  );
};

export default CreatePost;