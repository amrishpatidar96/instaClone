import React, { useEffect, useState,useContext } from 'react';
import classes from './Home.module.css';
import {Button} from 'reactstrap';
import {MdThumbUp,MdThumbDown,MdFavorite} from 'react-icons/md';
import {UserContext} from '../../../App';
import {BsTrashFill} from 'react-icons/bs';
import {useHistory} from 'react-router-dom';
import { v4 as uid } from 'uuid';


const Home = () => {
    const [postsdata, setPosts] = useState([]);
    const {state,dispatch} = useContext(UserContext);
    const history = useHistory();





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

        return ()=>{
            setPosts([])
        }

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
    
    let deletePost = (postId)=>{
        fetch(`/deletepost/${postId}`,{
            method:"delete",
            headers:{
                Authorization:"Bearer "+ localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(res=>{
            console.log(res.result);
            const newData = postsdata.filter(item=>{
                return item._id !== res.result._id
            })
            setPosts(newData)
        })
        .catch(err=>{console.log(err)})
    }




    const makeComment = (text,postId) =>{

    fetch('/comment',{
        
                    method:'put',
                    headers:{
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("jwt")
                    },
                    body:JSON.stringify({
                        postId,
                        text
                    })
                }).then(res=>{
                    return res.json();
                })
                .then(updatedPost => {
                    console.log(updatedPost);

                    const updatedPosts = postsdata.map((post)=>{
                        if(post._id === updatedPost._id){
                            return updatedPost;
                        }
                        else
                            return post;
                    })

                    setPosts(updatedPosts);

                })
                .catch(err=>console.log(err))
            }
        
    const fetchPosts = postsdata.map((post) => {
        return (
            <div  key={post._id} className={[classes.mycard, "card"].join(" ")}>
                <h5 onClick={
                    ()=>{
                        if(post.postedBy._id === state && state.userId){
                            history.push('profile')
                        }
                        else{
                            history.push('/profile/'+post.postedBy._id);
                        }
                    }
                }>
                    {post.postedBy.name}
                    {
                  (post.postedBy._id === state.userId)  && <BsTrashFill size={25} style={{float: "right",color:"black",cursor:'pointer'}} onClick={deletePost.bind(this,post._id)}/>
                }
                </h5>
              
                <div  className="card-image mt-3">
                    <img src={post.photo} alt="" style={{maxHeight:"300px",maxwidth:"300px"}}/>
                </div>
                <div  className={classes.inputfield}>
                    <div className="py-3">
                    <Button className="m-0 p-0" style={btnStyle}><MdFavorite size={25}/></Button>
                    
                    <Button className="m-0 p-0 ml-2" style={btnStyle} disabled={state?post.likes.includes(state.userId):""}><MdThumbUp  onClick={()=>{likeHandler(post._id)}}  className="ml-3" size={25}/></Button>
                    <Button className="m-0 p-0 ml-2" style={btnStyle} ><MdThumbDown onClick={()=>{unlikeHandler(post._id)}} className="ml-3" size={25} /></Button>
                    </div>
                    <span><strong>{post.likes.length+" Likes"}</strong></span>
                    <h6 className="mt-2">{post.title}</h6>
                   
                    <hr/>
                    <p className="mt-2">{post.body}</p>
                    <hr/>
                    <h5>{"Comments("+post.comments.length+")"}</h5>
                    {
                        post.comments.map(comment =>{
                            return (
                                <div className="p-3" style={{borderTop:"1px solid #ccc"}} key={uid()}>
                                    <h6>
                                        {comment.postedBy.name} 
                                    </h6>
                                    <span>
                                        {comment.text}
                                    </span>
                                   
                                </div>
                            )
                            })
                    }



                    <form onSubmit={(e)=>{
                        e.preventDefault();
                        //console.log(e.target[0].value);
                        makeComment(e.target[0].value,post._id)
                    }}>
                        <div className="d-flex align-items-center p-3" style={{postion:'relative'}}>
                            <input type="text" placeholder="add a comment" className="mt-2"/>
                            <Button type="submit" style={{postion:'absolute',right:0,backgroundColor:"black"}}>Submit</Button>
                        </div>
                    </form>
                </div>
            </div>
        )
    })
    
    console.log(state);
    return (
        <div className="home">
           
            {   
                postsdata.length ? state ? fetchPosts : " " :" "
            }
        </div>
    );
}

export default Home;