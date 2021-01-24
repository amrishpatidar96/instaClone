import React, { useEffect, useState,useContext } from 'react';
import classes from './Home.module.css';
import {Button} from 'reactstrap';
import {MdThumbUp,MdThumbDown,MdFavorite} from 'react-icons/md';
import {UserContext} from '../../../App';


const Home = () => {
    const [postsdata, setPosts] = useState([]);
    const {state,dispatch} = useContext(UserContext);

    useEffect(() => {
        fetch('/allpost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(result => {
                console.log(result);
                


                setPosts(result.posts);
                
        }).catch(err=>console.log(err));


    }, [])


    const likeHandler = (postId)=>{
        fetch('/like',{
            method:"put",
            headers: {
                Authorization:"Bearer "+localStorage.getItem("jwt"),
                "Content-Type":"application/json"
            },
            body: JSON.stringify({postId:postId})

        }).then((res)=>res.json())
        .then(res=>{
            let updatedPosts =  postsdata.map((post)=>{
                if(post._id===res._id){
                    return res ; 
                }
                else{
                    return post;
                }
            });

            setPosts(updatedPosts);   
            
        })
        .catch(err=>console.log(err));
    }

    const unlikeHandler = (postid)=>{
        fetch('/unlike',{
            method:"put",
            headers: {
                Authorization:"Bearer "+localStorage.getItem("jwt"),
                "Content-type":"application/json"
            },
            body: JSON.stringify({postId:postid})

        }).then((res)=>res.json())
        .then(res=>{
            let updatedPosts =  postsdata.map((post)=>{
                if(post._id===res._id){
                    return res ; 
                }
                else{
                    return post;
                }
            });

            setPosts(updatedPosts);   
            
        })
        .catch(err=>console.log(err));
    }

    let btnStyle = { 
            backgroundColor:'white' ,
            height:'25px',
            border:'none',
            color:'black',
            boxShadow:'none',

            }
    

    const fetchPosts = postsdata.map((post) => {
        return (
            <div  key={post._id} className={[classes.mycard, "card"].join(" ")}>
                <h5 >
                    {post.postedBy.name}
                </h5>
                <div  className="card-image">
                    <img src={post.photo} alt="" />
                </div>
                <div  className={classes.inputfield}>
                    <div className="py-3">
                    <Button className="m-0 p-0" style={btnStyle}><MdFavorite size={25}/></Button>
                    
                    <Button className="m-0 p-0 ml-2" style={btnStyle} disabled={post.likes.includes(state.userId)}><MdThumbUp  onClick={()=>{likeHandler(post._id)}}  className="ml-3" size={25}/></Button>
                    <Button className="m-0 p-0 ml-2" style={btnStyle} ><MdThumbDown onClick={()=>{unlikeHandler(post._id)}} className="ml-3" size={25} /></Button>
                    </div>
                    <span><strong>{post.likes.length+" Likes"}</strong></span>
                    <h6 className="mt-2">{post.title}</h6>
                    <p className="mt-2">{post.body}</p>
                    <input type="text" placeholder="add a comment" className="mt-2"/>
                </div>
            </div>
        )
    })
    

    return (
        <div className="home">
           
            {   
                postsdata.length ? state ? fetchPosts : " " :" "
            }





        </div>
    );
}

export default Home;