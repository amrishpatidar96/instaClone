import React, { useEffect, useState } from "react";
import classes from "./Profile.module.css";
import {Button} from 'reactstrap';





const Profile = () => {

    const [myPosts, setMyPosts] = useState([]);
    const [counter,setCounter] = useState(0);
    useEffect(()=>{
        fetch('/myposts',{
            headers:{
                Authorization:"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>{
            return res.json();
        })
        .then((myPosts)=>{
            console.log(myPosts.mypost);
            setMyPosts(myPosts.mypost);
        })
    },[]);




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
            <div>
                <img
                    src="data:image/png;base64,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"
                    style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                    alt=""
                />
            </div>
            <div>
                <h5>amrish patidar</h5>
                <div style={{display: "flex",justifyContent: "space-between",width: "109%"}}>
                    <h6>40 posts</h6>
                    <h6>40 followers</h6>
                    <h6>40 following</h6>
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
            }):"Loding..."
            }
           
        </div>

    </div>
  );
};

export default Profile;
