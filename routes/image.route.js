const express = require("express");
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() })
const { userAuth } = require('../middlewares/checkAuth.middleware.js');
const {uploadFile} = require('../utils/aws.js');
const Image = require("../database/models/image.model.js");
const Collection = require("../database/models/collection.model.js");

router.post("/upload", userAuth,upload.single('image'),async (req, res) => {
  
  try {
      console.log(typeof req.body.tags);
      let image = await uploadFile(req.file);
      const newImage = new Image({url: image, userId: req.userId, tags: Array.from(req.body.tags)});
      await newImage.save();

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
    const images = await Image.find({userId: req.userId}).select("url").skip(req.query.page * 20)
      .limit(20);
    return res.status(200).json({
      success: true,
      images
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
    const images = await Image.find({userId: req.userId, tags: req.query.filter}).select("url").skip(req.query.page * 20) .limit(20);
    return res.status(200).json({
      success: true,
      images
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
    const {collection, imageId} = req.body;
    console.log({collection, imageId});
    const foundCollection = await Collection.find({name: collection});
    console.log(foundCollection);
    await Image.findByIdAndUpdate(
        imageId,
        {$push: {"collections": foundCollection[0]._id}},
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