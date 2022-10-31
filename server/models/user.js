const mongoose=require('mongoose')
const {ObjectId}=mongoose.Schema.Types
const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        default:"https://res.cloudinary.com/kshitijcloud/image/upload/v1629188343/no-user-image_i7tuuf.gif"
    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}]

})
mongoose.model("User",UserSchema)