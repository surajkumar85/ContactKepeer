const express = require("express");
const auth = require("../middleware/auth")
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require("../models/User")
const Contact = require("../models/Contact")
//@route   GET api/contact
//@descip   Get all user contact
//access   private

router.get("/",auth,async (req,res)=>{
    try {
        const contacts = await Contact.find({user : req.user.id}).sort({date : -1})
        res.json(contacts)
    } catch (error) {
        res.status(500).send("server error")
    }
})
//@route   Post api/contacts/:id
//@descip   create a contact
//access   private

router.post("/",[auth,[
    body('name','Name is required').not().isEmpty()
]],async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {email,phone,name,type} = req.body;
    try {
        const newContact = new Contact({
            email,phone,name,type,
            user: req.user.id
        })
        const contact = await newContact.save()
        res.json(contact)
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error")
    }
})

//@route   PUT api/contacts/:id
//@descip   Update a contact
//access   private

router.put("/:id",auth,async (req,res)=>{
    const { name,email,phone,type} = req.body;
    const contactFields = {}
    if(name) contactFields.name = name;
    if(email) contactFields.email = email;
    if(phone) contactFields.phone = phone;
    if(type) contactFields.type = type;

    try {
        let contact = await Contact.findById(req.params.id)
        if(!contact) return res.status(404).json({msg : "Contact not found"})
        //make sure this user is verfied
        if(contact.user.toString() !== req.user.id){
         return res.status(401).send("you are not authorised")
        }   
        contact = await Contact.findByIdAndUpdate(req.params.id,
            {$set: contactFields},
            {new: true})
        res.json(contact);

    } catch (error) {
        console.log(error.message);
        res.status(500).send("server error")
    }
})


//@route   Delete api/contacts/:id
//@descip   Delete a contact
//access   private

router.delete("/:id",auth,async(req,res)=>{
    try {
        let contact = await Contact.findById(req.params.id)
        if(!contact) return res.status(404).json({msg : "Contact not found"})
        //make sure this user is verfied
        if(contact.user.toString() !== req.user.id){
         return res.status(401).send("you are not authorised")
        }   
        await Contact.findByIdAndRemove(req.params.id)
        res.send("contact remove")

    } catch (error) {
        console.log(error.message);
        res.status(500).send("server error")
    }
})
module.exports = router;