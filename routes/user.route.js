const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const User = require("../database/models/user.model.js");


router.post("/signup", async (req, res) => {

    try {
        
        const { email, password } = req.body;
        const salt = await bcrypt.genSalt(10)
        const hashed = await bcrypt.hash(password, salt);
        const newUser = await User.create({ email, password: hashed })
        return res.status(201).send({ success: true });

    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message })
    }
});

router.post("/login", async (req, res) => {
  try{
        const { email, password } = req.body;

        const user = await User.findOne({ email });
    
        if (!user) {
            return res.status(401).json({ success: false, msg: `Email not registred` })
            
        };

        const validPassword = await bcrypt.compare(req.body.password, user.password);

        if (!validPassword) {
            return res.status(401).json({ success: false, msg: "Invalid password" });
        }

         const token = await jwt.sign({
            userId:user._id,
           expiresIn: "1d"
        }, process.env.JWT_SECRET);
    
        return res.status(200).json({ success: true, token: token });
  } catch(error) {
    return res.status(500).json({success: false, msg: error.message})
  }
});
module.exports = router;