import React, { useEffect, useState,useContext } from "react";
import classes from "./Profile.module.css";
import {useParams} from "react-router-dom";
import {BsPeopleCircle} from "react-icons/bs";
import {Button} from 'reactstrap';
import {UserContext} from '../../../App';

const UserProfile = () => {

    const [userProfile, setUserProfile] = useState([]);
    const {userId} = useParams();

    const {state,dispatch} = useContext(UserContext);

    const fetchUserProfile = () => {
        fetch(`/user/${userId}`,{
            headers:{
                Authorization:"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>{
            return res.json();
        })
        .then((res)=>{
            console.log(res);
            setUserProfile(res)
        })
        .catch(err =>console.error(err));
    }

    
    useEffect(()=>{
        console.log("running");
        fetchUserProfile();
    },[]);

    let follow = (followId) =>{

        fetch('/follow',{
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                Authorization:"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId: followId
            })
        })
        .then(res=>res.json())
        .then((res)=>{
            console.log(res);
            dispatch({type:"UPDATE",payload:{
                following:res.following,
                followers:res.followers
            }});
            const user = {
                ...res,
                userId:res._id
            }
            localStorage.setItem("user",JSON.stringify(user))

            fetchUserProfile();


        })
        .catch(err =>console.error(err));


    }

    let unfollow = (unfollowId) =>{

        fetch('/unfollow',{
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                Authorization:"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowId: unfollowId
            })
        })
        .then(res=>res.json())
        .then((res)=>{
            dispatch({type:"UPDATE",payload:{
                following:res.following,
                followers:res.followers
            }});
            const user = {
                ...res,
                userId:res._id
            }
            localStorage.setItem("user",JSON.stringify(user))
            fetchUserProfile();
        })
        .catch(err =>console.error(err));


    }


 



  return (
    <>
        {
            userProfile ?
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
                <div>
                    {userProfile.user && <h5>{ userProfile.user.name}</h5>}
                    {userProfile.user && <h5>{ userProfile.user.email}</h5>}
                    
                    <div className="mt-2" style={{display: "flex",justifyContent: "space-between",width: "109%"}}>
                        <h6>{userProfile.posts && userProfile.posts.length} posts</h6>
                        <h6>{userProfile.user && userProfile.user.followers.length}followers</h6>
                        <h6>{userProfile.user && userProfile.user.following.length}following</h6>
                    </div>
                    <Button 
                    className="mt-1"
                    style={{backgroundColor:"green",color:'white'}}
                    onClick={() =>{
                        userProfile.user && userProfile.user.followers.includes(userId) ? unfollow(userId) :  follow(userId)
                    }} 
                    >{ userProfile.user && userProfile.user.followers.includes(userId)?"unfollow":"follow"}</Button>
                </div>
         
            </div>
            
            <div className={classes.gallery} >
         
                {
                   userProfile.posts && userProfile.posts.map((post)=>{
                   return  (<img 
                   className={classes.item}
                   src={post.photo}
                   alt=""
                   key={post._id}
                   />)
                })
                }
               
            </div>
         
         </div>
         :"loading..."

        }
    
    </>
  );
};

export default UserProfile;
