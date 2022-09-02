const express = require("express");
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() })
const { userAuth } = require('../middlewares/checkAuth.middleware.js');
const {uploadFile} = require('../utils/aws.js');
const Interaction = require("../database/models/interaction.model.js");
const Collection = require("../database/models/collection.model.js");



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
    const allInteractions =  await Interaction.find({userId: req.userId});
    const interactions = await Interaction.find({userId: req.userId}).select({url:1, tags:1}).skip(req.query.page * 10)
      .limit(10);
    const noOfPages = Math.ceil(allInteractions.length / 10);
    return res.status(200).json({
      success: true,
      interactions,
      noOfPages
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
        const allInteractions =  await Interaction.find({userId: req.userId});
    const interactions = await Interaction.find({userId: req.userId, tags: req.query.filter}).select({url:1, tags:1}).skip(req.query.page * 10) .limit(10);
    const noOfPages = Math.ceil(allInteractions.length / 10);
    return res.status(200).json({
      success: true,
      interactions,
      noOfPages
    });
  }catch(error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: error.message
    });
  }
  
});

router.post("/add-to-collection", userAuth, async(req, res) => {
  try{
    const {collection, interactionId} = req.body;
    console.log({collection, interactionId});
    const foundCollection = await Collection.find({name: collection});
    console.log(foundCollection);
    await Interaction.findByIdAndUpdate(
        interactionId,
        {$addToSet: {"collections": foundCollection[0]._id}},
        {safe: true, upsert: true, new : true}
    );
    return res.status(200).json({
      success: true
    })
  }catch(error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: error.message
    })
  }
});



module.exports = router;