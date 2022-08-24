const express = require("express");
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() })
const { userAuth } = require('../middlewares/checkAuth.middleware.js');
const {uploadFile} = require('../utils/aws.js');
const Collection = require("../database/models/collection.model.js");
const Image = require("../database/models/image.model.js");
const Interaction = require("../database/models/interaction.model.js");



router.post("/", userAuth,async (req, res) => {
  
  try {
      const {name, description} = req.body;
    console.log({name, description});
      const newCollection = new Collection({name, description, userId: req.userId});
      await newCollection.save();
      return res.status(201).json({
        success: true
      });

    } catch (error) {
    console.log(error);
        return res.status(500).json({ success: false, msg: error.message })
    }
});


router.get("/data", userAuth, async (req, res) => {
  try{
      const collectionId = req.query.id;
      const images = await Image.find({collections: collectionId});
      const interactions = await Interaction.find({collections: collectionId});
      const data = [...images, ...interactions];

      return res.status(200).json({
        success: true,
        media:data
      });
    
  }catch(error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: error.message
    });
  }
});

router.get("/", userAuth, async (req, res) => {
  try{
    const collections = await Collection.find({userId: req.userId});
    return res.status(200).json({
      success: true,
      collections
    })
  }catch(error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
});


module.exports = router;