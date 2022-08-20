const express = require("express");
const router = express.Router();

const Whitelist = require("../database/models/whitelist.model.js");


router.route("/")
.post(async (req, res) => {
  
  const {email} = req.body;
  console.log(email);
  if(!email){
    return res.status(400).json({
      success: false,
      message: "Email cannot be empty"
    });
  }
  try{
    const foundEmail = await Whitelist.findOne({email: email});
    if(foundEmail === null){
      const newWhitelist = new Whitelist({email});
      try{
        const savedWhitelist = await newWhitelist.save();
         return res.status(201).json({
        success: true
      });
      }catch(err){
        console.log(err);
         return res.status(500).json({
      success: false,
      message: "internal server error"
    });
      }
    }else{
      return res.status(409).json({
        success: false,
        message: "email already exists"
      });
    }
  }catch(err){
    return res.status(500).json({
        success: false,
        message: "email already exists"
      });
  }
  
});

module.exports = router;