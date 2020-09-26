const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs")
const jwt =  require("jsonwebtoken");
const { body, validationResult } = require('express-validator');
const config = require("config");
const User = require("../models/User")
const auth = require("../middleware/auth")

//@route   GET api/auth
//@descip   Get logged in user
//access   private

router.get("/",auth,async (req,res)=>{
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)    
    } catch (error) {
        console.log(error.message);
        res.status(500).send("server error")
    }
})
//@route   Post api/auth
//@descip   Auth user & get token
//access   public

router.post("/",[
    body('email','Please enter a valid email').isEmail(),
    body('password','Password must be of 6 digits').exists()
],async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {email , password} = req.body;
    try {
        let user = await User.findOne({email})
        if(!user){
            return res.status(400).json({msg : "envalid credencials"})
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({msg : "envalid credencials"})
        }
        const payload ={
            user : {
                id :user.id
            }
        }
        jwt.sign(payload,config.get("jwtSecret"),{
            expiresIn : 360000
        },(err,token)=>{
            if(err) throw err
            res.json({token})
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error')
    } 
})

module.exports = router;