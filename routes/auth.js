const express = require('express');
const router = express.Router();
const User = require("../models/User");
const bcrypt = require('bcryptjs');
const { hash } = require('bcrypt');
const ValidateRegisterInput = require("../validation/registerValidation");
const jwt = require('jsonwebtoken');

router.get("/test", (req, res) =>{
    res.send("Auth route working");
});

//@route Post/api/auth/register
// discription Create a new user

router.post("/register", async (req, res) =>{
    try{
        const{password} = req.body
        if (password.length < 6){
            return res.status(400).json({message: "Password less than 6"})
        };
        
        const {errors, isValid} = ValidateRegisterInput(req.body);
        if (!isValid) {
            return res.status(400).json(errors);
        }
        // check for existing user
        const existingEmail = await User.findOne({
            email: new RegExp("^" + req.body.email +"$", "i")
        });

        if (existingEmail) {
            return res.status(400).json({error: 'This email exist'})
        }
        //hash password
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const newUser = new User({
            email: req.body.email,
            password: hashedPassword,
            name: req.body.name
        })
        //save user to data base
        const savedUser = await newUser.save();
        return res.json(savedUser);
    } catch(err){
        console.log(err);
        res.status(500).send(err.message)
    }
});
//@route post/api/aut/loggin
//desc loggin user and return access token

router.post("/login", async (req, res) =>{
    try{
        //check for user
        const user = await User.findOne({
            email: new RegExp("^" + req.body.email +"$", "i"),
        });

        if(!user) {
            return res.status(400).json
            ({error: "There was a problem with credential"});
            
        }
        const passwordMatch = await bcrypt.compare(
            req.body.password,
            user.password
        );
            
        if (!passwordMatch){
            return res
            .status(400)
            .json({error: "There is a problem"});
        }
        const payload = {userId: user._id};
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        res.cookie("access-token", token, {
            expires: new Date(Date.now() +7+24+60+60+1000),
            httpOnly:true,
            secure:process.env.NODE_ENV === "production"
        });

        const userToReturn = {...user._doc};
        delete userToReturn.password;

        return res.json({
            token: token,
            user: userToReturn,
        });

    } catch(err) {
        console.log(err);
        return res.status(500).send(err.message);
    }
})
    
       

module.exports= router;
