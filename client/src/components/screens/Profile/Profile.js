import React, { useEffect, useState,useContext } from "react";
import classes from "./Profile.module.css";
import {Button} from 'reactstrap';
import {BsPeopleCircle} from "react-icons/bs";
import {UserContext} from '../../../App';



const Profile = () => {

    const [myPosts, setMyPosts] = useState([]);
    const [url,setUrl] = useState("");
    const {state, dispatch} = useContext(UserContext);
    const [image,setImage] = useState("");
   
    useEffect(()=>{
        fetch('/myposts',{
            headers:{
                Authorization:"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>{
            return res.json();
        })
        .then((myPosts)=>{
            //console.log(myPosts.mypost);
            setMyPosts(myPosts.mypost);
        })

        fetch('/myprofile',{
            headers:{
                Authorization:"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>{
            return res.json();
        })
        .then((myProfile)=>{

          
            dispatch({type:"UPDATE",payload:{
                following:myProfile.myprofile.following,
                followers:myProfile.myprofile.followers,
                pic:myProfile.myprofile.pic
            }});
            const user = {
                ...myProfile.myprofile,
                userId:myProfile.myprofile._id
            }
            //dispatch({type:"USER",payload:user})
            localStorage.setItem("user",JSON.stringify(user))
         
        })


    },[]);


    useEffect(()=>{
  
        if(url){
        
        fetch('/updateMyprofilePic',{
            method:"post",
            headers:{
                'Content-Type':"application/json",
                Authorization:"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                pic:url
            }),
           
        }).then(res=>{
            return res.json();
        })
        .then((myProfile)=>{
          
            dispatch({type:"UPDATE",payload:{
                following:myProfile.myprofile.following,
                followers:myProfile.myprofile.followers,
                pic:myProfile.myprofile.pic
            }});
            const user = {
                ...myProfile.myprofile,
                userId:myProfile.myprofile._id
            }
            
            localStorage.setItem("user",JSON.stringify(user))
         
        })
        }
    },[url])


    const uploadImage = (imageArg)=>{

        const data  = new FormData();
        data.append("file",imageArg);
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
   

  return (
    <div style={{maxWidth:"650px",margin:"0px auto"}}>
        
        <div
        style={{
            display: "flex",
            justifyContent: "space-around",
            margin: "18px 0px",
            borderBottom: "1px solid grey",        
           
   
            
        }}
        >
            <div   style={{ width: "212px", height: "212px", display:'flex' ,flexDirection: "column",alignItems:"center"}}>
                    {state && (!state.pic) ? (<BsPeopleCircle  size={70}/>) 
                    :<img src={ state && state.pic} style={{ 
                        width: "120px", 
                        height: "120px",
                        borderRadius: "50%",
                        overflow: "hidden" , 
                        boxShadow: "0 0 5px 2px #ccc"}}/>  }

                    <div className="file-field" style={{marginTop:'16px'}}>
                        <div className="btn" style={{
                            display: "flex",justifyContent:'center',alignItems: 'center',
                            color:"white",
                            backgroundColor:"black"
                        }}>
                            <span >Upload</span>
                            <input type="file"  onChange={(e)=>{
                                setImage(e.target.files[0])
                                uploadImage(e.target.files[0]);
                            }
                               
                                }/>
                        </div>
                        

                    </div>
            </div>
           
            <div className="mt-2">
                    <h5>{state &&  state.name}</h5>
                    <h5>{state && state.email}</h5>
                <div className="mt-3" style={{display: "flex",justifyContent: "space-between",width: "109%"}}>
                    <h6>{myPosts.length} posts</h6>
                    <h6>{state && state.followers && state.followers.length } followers</h6>
                    <h6>{state && state.following && state.following.length} following</h6>
                </div>


            </div>

        </div>
        
        <div className={classes.gallery} >

            {
               myPosts.length>0?  myPosts.map((mypost)=>{
               return  (<img 
               className={classes.item}
               src={mypost.photo}
               alt=""
               key={mypost._id}
               />)
            }):"Loading..."
            }
           
        </div>

    </div>
  );
};

export default Profile;
