const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const {ObjectId} = mongoose.Schema.Types;
const userSchema = new mongoose.Schema({
    name:{
        type: 'String',
        required:true,
    },
    email:{
        type: 'String',
        required:true,
    },
    password:{
        type: 'String',
        required:true,
    },
    following:[{
        type:ObjectId,
        ref:"User"
    }],
    followers:[{
        type:ObjectId,
        ref:"User"
    }],
    pic:{
        type:"String",
        required:false
    }, 
    resetToken:String,
    expireToken:Date
})

mongoose.model("User",userSchema);