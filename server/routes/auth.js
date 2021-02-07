const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');//form json web token
// that we have installed using npm install jsonwebtoken
const {JWT_SECRET_KEY,SENDMAILERKEY} = require('../keys');

const crypto = require('crypto');

const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport')
//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
const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:"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"
    }
}))

// const transporter = nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     auth: {
//         user: 'johathan.leffler35@ethereal.email',
//         pass: 'MUv3axh7bM3sxh8DWV'
//     }
// });

const newLocal = "<h2>Welcome to instagram Clone</h2>";
router.post('/signup',(req,res)=>{

    //console.log(req.body);
    const {name,email,password,pic} = req.body;
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
                    name:name,
                    pic:pic
                });
    
                user.save()
                .then((user)=>{

                    transporter.sendMail({
                        //to:"johathan.leffler35@ethereal.email",
                        to:user.email,
                        from:"dehefaraba-8824@yopmail.com",
                        //from:"no-reply@instaclone.com",
                        subject:"Signup success",
                        html: newLocal
                        
                    })
                    .then(()=>{
                        console.log("email sent successful");
                    })
                    .catch((err)=>{
                        console.log("error in sending email"+err);
                    });

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
                        followers:savedUser.followers,
                        pic:savedUser.pic
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

router.post('/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err);
        }
        else{
            //buffer is in the form of hexadecimal so that we have to convert it into string
            const token = buffer.toString("hex");

            User.findOne({email:req.body.email})
            .then(user=>{
                if(!user){
                    return res.status(422).json({error:"User don't exist with this email"})
                }
                else{
                    user.resetToken = token;
                    user.expireToken = Date.now() +3600000;
                    user.save().then((result)=>{
                        transporter.sendMail({
                            to:user.email,
                            from:"dehefaraba-8824@yopmail.com",
                            subject:"password reset",
                            html:`
                            <p>you requested for password </p>
                            <h5>click on this <a href="https://localhost:3000/reset-password/${token}">link</a> to reset your password</h5>
                            `
                        })
                        .then(res=>{
                            console.log(res);
                        })
                        .catch(err=>console.log(err));

                        res.json({message:"check yout email"});
                    })





                }
            })

        }

    });
})

router.post('/new-password',(req,res)=>{
    const newPassword = req.body.password;
    const sentToken = req.body.token;
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then((user)=>{
        if(!user){
            return res.status(422).json({error:"try again session expired"})
        }

        bcrypt.hash(newPassword,12)
        .then((hashedPassword)=>{
            user.password = hashedPassword;
            user.resetToken = undefined;
            user.expireToken = undefined;
            user.save()
            .then((savedUser)=>{
                res.json({
                    message:"password updated successfully"
                });
            })
            .catch((error)=>{console.log(error)})

        })
        .catch((error)=>{console.log(error)})



    })
})


module.exports = router;