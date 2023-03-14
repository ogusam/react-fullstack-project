const express = require('express');
const router = express.Router();
const User = require("../models/User");
const bcrypt = require('bcryptjs');
const { hash } = require('bcrypt');

router.get("/test", (req, res) =>{
    res.send("Auth route working");
});

//@route Post/api/auth/register
// discription Create a new user

router.post("/register", async (req, res) =>{
    try{
        //hash password
        const hasedPassword = await bcrypt.hash(req.body.password, 12);
        const newUser = new User({
            email: req.body.email,
            password: hashedPassword,
            name: req.body.name
        })
        //save user to data base
        const savedUser = await newUser.save();
    } catch(err){
        console.log(err);
        res.status(500).send(err.message)
    }
})
module.exports= router;
