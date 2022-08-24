const express = require("express");
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() })
const { userAuth } = require('../middlewares/checkAuth.middleware.js');
const {uploadFile} = require('../utils/aws.js');
const Interaction = require("../database/models/interaction.model.js");



router.post("/upload", userAuth,upload.single('image'),async (req, res) => {
  
  try {
      console.log(typeof req.body.tags);
      let image = await uploadFile(req.file);
      const newInteraction = new Interaction({url: image, userId: req.userId, tags: Array.from(req.body.tags)});
      await newInteraction.save();

      return res.status(201).json({
        success: true
      });

    } catch (error) {
    console.log(error);
        return res.status(500).json({ success: false, msg: error.message })
    }
});


router.get("/all", userAuth, async(req, res) => {

  try{
    const interactions = await Interaction.find({userId: req.userId}).select("url").skip(req.query.page * 20)
      .limit(20);
    return res.status(200).json({
      success: true,
      interactions
    });
  }catch(error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: error.message
    });
  }
  
});

router.get("/", userAuth, async(req, res) => {

  try{
    console.log(req.query.filter);
    const interactions = await Interaction.find({userId: req.userId, tags: req.query.filter}).select("url").skip(req.query.page * 20) .limit(20);
    return res.status(200).json({
      success: true,
      interactions
    });
  }catch(error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: error.message
    });
  }
  
});



module.exports = router;