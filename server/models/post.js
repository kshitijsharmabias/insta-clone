const mongoose= require("mongoose")
const {ObjectId}=mongoose.Schema.Types

const PostSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    body:{
        type:String,
        required: true
    },
    photo:{
        type:String,
        required:true
    },
    likes:[{type:ObjectId, ref:"User"}],
    comments:[{
        text:String,
        postedby: {type:ObjectId, ref:"User"}
    }],
    posted_by:{
        type:ObjectId,
        ref: "User"
    }
})
mongoose.model("Post",PostSchema)