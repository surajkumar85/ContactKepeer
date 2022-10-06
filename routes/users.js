const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs")
const jwt =  require("jsonwebtoken");
const { body, validationResult } = require('express-validator');
const config = require("config");
const User = require("../models/User")
//@route   POST api/users
//@descip   Register a user
//access   public

router.post("/",[
    body('name',"Please enter your name").not().isEmpty(),
    body('email','Your email must be unique').isEmail(),
    body('password','Password must be of 6 digits').isLength({ min: 6 })
],
   const {name,email,password} = req.body;
   try {
       let user = await User.findOne({email});
       if(user){
           return res.status(400).json({msg : 'User is already exist'})
       }
        user = new User({
           name,
           email,
           password
       })
       const salt = await bcrypt.genSalt(10);
       user.password = await bcrypt.hash(password,salt);
       await user.save()
       const payload ={
           user : {
               id :user._id
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
