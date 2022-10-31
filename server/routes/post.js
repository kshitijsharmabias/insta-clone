var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
const RequiredLogin=require("..//middleware/requirelogin")
require('../models/post')
const Post = mongoose.model("Post")
router.get("/allpost",RequiredLogin,(req,res)=>{
    Post.find()
    .populate("posted_by","_id name")
    .populate("comments.postedby","_id name")
    .then(posts=>{
        res.json({posts})
    }).catch(err=>{
        console.log(err)
    })
})
router.get("/getsubpost",RequiredLogin,(req,res)=>{
    //if posted by in following
    Post.find({posted_by:{$in:req.user.following}})
    .populate("posted_by","_id name")
    .populate("comments.postedby","_id name")
    .then(posts=>{
        res.json({posts})
    }).catch(err=>{
        console.log(err)
    })
})
router.post("/createpost",RequiredLogin,(req,res)=>{
    const {body,title,pic}= req.body
    if (!title||!body||!pic){
        return res.status(422).json({error:"Please add fields"})
    }
    req.user.password= undefined// for not storing password in posted by
    const post = new Post(
        {
            title,
            body,
            photo:pic,
            posted_by: req.user
        }
    )
    post.save().then(result=>{
        res.json({post: result})
    })
    .catch(err=>{
        console.log(err)
    })

})
router.get('/mypost',RequiredLogin,(req,res)=>{
    Post.find({posted_by:req.user._id})
    .populate("posted_by","_id name")
    .then(posts=>{
        res.json({posts})
    }).catch(err=>{
        console.log(err)
    })
})
//use put method for updating push can also be used
router.put('/like',RequiredLogin,(req,res)=>{
    
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    }).exec((err, result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})

router.put('/unlike',RequiredLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    }).exec((err, result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})
router.put('/comment',RequiredLogin,(req,res)=>{
    const comment={
        text:req.body.text,
        postedby:req.user._id
    }

    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    }).populate("comments.postedby","_id name")
    .populate("posted_by","_id name")
    .exec((err, result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})
router.delete('/deletepost/:postId',RequiredLogin,(req,res)=>{
    console.log(req.params)
    Post.findOne({_id:req.params.postId})
    .populate("posted_by","_id")
    .exec((err,post)=>{
        if (err||!post){
        return res.status(422).json({error:err})
    }
   
    if(post.posted_by._id.toString()===req.user._id.toString())
    {
        post.remove()
        .then(result=>{
            res.json(result)
        }).catch(err=>{
            console.log(err)
        })
    }   
}
    )
})
router.delete('/deletecomment/:postId/:commentid',RequiredLogin,(req,res)=>{
    console.log(req.params,"post")
    console.log(req.params.commentid)
    console.log(req.body.postId,"comments")
    const comm=req.params.commentid
    //console.log(Post.find(req.params.postId))
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{comments:{_id:comm}}
    },{
        new:true
    }).exec((err, result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})
    
    

    


module.exports= router