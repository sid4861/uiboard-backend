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


router.get("/data", async (req, res) => {
  try{
      const collectionId = req.query.id;
      const collection = await Collection.findById(collectionId);
      const images = await Image.find({collections: collectionId});
      const interactions = await Interaction.find({collections: collectionId});
      const data = [...images, ...interactions];

      return res.status(200).json({
        success: true,
        media:data,
        collection
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
    console.log(collections);
    const collectionsMediaCount = await Promise.all([...collections].map(async (collection) => {
      const collectionId = collection._id;
      const images = await Image.find({collections: collectionId});
      const interactions = await Interaction.find({collections: collectionId});
      const data = [...images, ...interactions];
      const newCollection = JSON.parse(JSON.stringify(collection));
      newCollection.mediaCount = data.length;
      return newCollection;
    }))
    return res.status(200).json({
      success: true,
      collection: collectionsMediaCount
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