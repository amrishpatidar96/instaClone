import React, { useEffect, useState,useContext } from "react";
import classes from "./Profile.module.css";
import {Button} from 'reactstrap';
import {BsPeopleCircle} from "react-icons/bs";
import {UserContext} from '../../../App';



const Profile = () => {

    const [myPosts, setMyPosts] = useState([]);
    const [myProfileInfo, setProfileInfo] = useState({});
    const {state, dispatch} = useContext(UserContext);

   
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
                followers:myProfile.myprofile.followers
            }});
            const user = {
                ...myProfile.myprofile,
                userId:myProfile._id
            }
            //dispatch({type:"USER",payload:user})
            localStorage.setItem("user",JSON.stringify(user))
         
        })


    },[]);


    console.log(state);

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
             <div   style={{ width: "80px", height: "140px",}}>
                    <BsPeopleCircle  size={70}/>
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
            }):"Loding..."
            }
           
        </div>

    </div>
  );
};

export default Profile;
