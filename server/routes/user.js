var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
const RequiredLogin=require("..//middleware/requirelogin")
require('../models/post')
const Post = mongoose.model("Post")
require('../models/user')
const User = mongoose.model("User")

router.get('/user/:id',RequiredLogin,(req,res)=>{
    console.log(req.params,"user")
    User.findOne({_id:req.params.id})
    .select('-password')
    .then(user=>{
        Post.find({posted_by:req.params.id})
        .populate("posted_by","_id name")
        .exec((err,post)=>{
            if (err){
                return res.status(422).json({error:err})

            }
            res.json({user,post})
            
        })
    }).catch(err=>{
        return res.status(404).json({error:"user not found"})
    })
})
router.put('/follow',RequiredLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if (err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followId}
        },{
            new:true
        }).select('-password').then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    })

})
router.put('/unfollow',RequiredLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if (err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.unfollowId}
        },{
            new:true
        }).select("-password").then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    })

})
  

router.put('/updatepic',RequiredLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}},{
        new :true
    },(err,result)=>{
        if (err){
            return res.status(422).json({error:"pic cannot post"})
        }
        res.json(result)
    })
})




module.exports= router