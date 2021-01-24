const jwt = require('jsonwebtoken');
const {JWT_SECRET_KEY} = require('../keys');
const mongoose = require('mongoose');
const User = mongoose.model('User');




module.exports = (req,res,next) => {
    const {authorization} = req.headers;
    //authorization === 'auth "+token
    if(!authorization){
       return res.status(401).json({error:"you must be logged in"});

    }
    const token = authorization.replace("Bearer ","");
    jwt.verify(token,JWT_SECRET_KEY,(err,payload) => {
        if(err){
            return res.status(401).json({error:"you must be logged in"});
        }

        const {_id} = payload;

        User.findById(_id)
        .then(userData => {
            req.user = userData;
            next();
        })
        .catch(err=>console.log(err));
        
    })



}