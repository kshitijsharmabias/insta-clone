//this is to verify whether user is logged in or not
const jwt= require('jsonwebtoken')
const {JWT_SECRET}=require('../key')
const mongoose= require('mongoose')
require('../models/user')
const User = mongoose.model("User")
module.exports=(req,res,next)=>{
    const {authorization}=req.headers //destructuring header as token is passed as authorization parameter in header
    //authorization === Bearer fsfsfsffff
    if (!authorization){// if no token is passed
        return res.status(401).json({error:"You must be logged in"})
    }
    const token = authorization.replace("Bearer ","")
    jwt.verify(token,JWT_SECRET,(err,payload)=>{ // if token is wrong or invalid
        if (err){
            return res.status(401).json({error:"You must be logged in"})
        }
        const {_id}=payload
        User.findById(_id).then(userdata=>{
            req.user= userdata
            next()//this is passed after all the data is sent otherwise data will be undefined because it takes time to execute
        })
        
    })
}