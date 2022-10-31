var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
require('../models/user')
const User = mongoose.model("User")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const {JWT_SECRET}=require('../key')
const requiredlogin = require('../middleware/requirelogin')

router.get('/', (req, res) => {
    res.send("hello")
})

router.route("/signup")
    .post(function (req, res, next) {
        const { name, email, password,pic } = req.body
        if (!name || !email || !password) {
            return res.status(422).json({ error: "please add all the required field" })
        }
        //checking if user  already exist 
        User.findOne({ email: email })
            .then((saveduser) => {// if exist then error
                if (saveduser) {
                    return res.status(422).json({ error: "User Already exists" })
                }
                bcrypt.hash(password, 12) //here hashing of password is done and 12 is the length of the password
                    .then(hashedpassword => {
                        //else save the use r according to schema
                        const user = new User(
                            {
                                name,
                                email,
                                password: hashedpassword,
                                pic

                            }
                        )
                        user.save()
                            .then(User => {
                                res.json({ message: "User saved Succesfully" })
                            }).catch(err => {
                                console.log(err)
                            }
                            )

                    })

            }).catch(err => {
                console.log(err)
            }
            )

    })
//signin function of 
router.post('/signin', (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(422).json({ error: "please add email or password" })
    }
    User.findOne({ email: email })
        .then(saveduser => {//if email not found
            if (!saveduser) {
                return res.status(422).json({ error: "Invalid email or password" })
            }
            bcrypt.compare(password, saveduser.password)//if email is found then comparing password
                .then(domatch => {
                    if (domatch) {
                        //res.json({ message: "signed in succesfully" })
                        const token=jwt.sign({_id:saveduser._id},JWT_SECRET)//token to verify that user has logged
                        const {_id,name,email, followers, following,pic}=saveduser
                        res.json({token,user:{_id,name,email, followers,following,pic}}) 
                    }
                    else {
                        return res.status(422).json({ error: "Invalid email or password" })
                    }
                }).catch(err => {
                    console.log(err)
                })
            })
})

module.exports = router