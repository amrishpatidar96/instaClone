const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');//form json web token
// that we have installed using npm install jsonwebtoken
const {JWT_SECRET_KEY} = require('../keys');


// router.get('/',(req, res)=>{
//     res.send("<h1>helloworld</h1>");
//     console.log("response sent");
// });


router.post('/signup',(req,res)=>{

    console.log(req.body);
    const {name,email,password} = req.body;
    if(!email || !password || !name){
        return res.status(422).json({
             error:"please add all the fields"
        });
    }
    
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({
                error:"email already exists"
           });
        }
        else{
            //bcrypt has been used for hashing(encrypt) passwords
            bcrypt.hash(password,12)
            .then((hashpassword)=>{
                const user = new User({
                    email:email,
                    password:hashpassword,
                    name:name
                });
    
                user.save()
                .then(()=>{
                    res.json({
                        message:"registered Successfully"
                    });
                })
                .catch((err)=>{
                    console.log(err);
                });
            })
            .catch((err)=>{
                console.log(err);
            });
            
        }
    })
    .catch((err)=>{
        console.log(err);
    });

});


router.post('/signin',(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password ){
        return res.status(422).json({
            error:"email or password missing",
        });
    }

    User.findOne({email:email})
    .then((savedUser)=>{
        if(!savedUser){
            return res.status(422).json({
                error:"incorrect password or email" 
           });
        }
        else{

            bcrypt.compare(password, savedUser.password)
            .then(doMatch=>{
                if(doMatch){
                    //console.log(savedUser._id+JWT_SECRET_KEY);
                    //res.json({message:"successfully signed in"});
                    const token = jwt.sign({_id: savedUser._id},JWT_SECRET_KEY);
                    const user = {userId: savedUser._id,
                        email: savedUser.email,
                        name: savedUser.name,
                        following:savedUser.following,
                        followers:savedUser.followers
                    
                    }
                    console.log(user);
                    res.json({
                        token: token,
                        message:"successfully signed in",
                        currentUser: user
                    });//send response to client in json
                
                
                }
                else{
                    return res.status(422).json({
                        error:"incorrect password or email"
                   });
                }
            })
            .catch((err)=>{
                console.log(err);
            });
    }
    }).catch((err)=>{
        console.log(err);
    })

});

module.exports = router;