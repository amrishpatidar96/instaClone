const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const Post = mongoose.model("Post");

//this route is for creating new post 
router.post('/createpost',requireLogin,(req,res)=>{
    const {title,body,pic} = req.body;
    if(!title || !body || !pic){
        return res.status(422).json({error:'please add all the fields'});
    }

    req.user.password = undefined;

    const post = new Post({
        title,
        body,
        postedBy: req.user,
        photo:pic
    });

    post.save()
    .then(result => {
        console.log(result);
        res.json({post: result})
    })
    .catch(error => {
        console.log(error)
    });


})


//this route is for getting all posts 
router.get('/allpost',requireLogin,(req,res)=>{
    Post.find()
    .populate("postedBy","_id name")
    .then(posts=>{

        res.json({posts})
    })
    .catch(error => {
        console.log(error);
    });
});


router.get('/myposts',requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .then(mypost=>{
        res.json({mypost:mypost})
    })
    .catch(error=>{
        console.log(error);
    })
})


router.put('/like',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{
            likes:req.user._id
        }
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result);
        }
    })

})


router.put('/unlike',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{
            likes:req.user._id
        }
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result);
        }
    })

})

router.put('/comment',requireLogin,(req,res)=>{
    const comment = {
        text: req.body.text,
        postedBy : req.user._id
         
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{
            comments:comment
        }
    },{
        new:true
    }).populate("comments.postedBy","_id name")
    
    exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result);
        }
    })

})





module.exports = router;