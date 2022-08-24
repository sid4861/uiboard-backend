const aws = require("aws-sdk");

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

let uploadFile = async (file) => {

  return new Promise(function (resolve, reject) {
    let s3 = new aws.S3({ apiVersion: "v4" });

    var uploadParams = {
      ACL: "public-read",
      Bucket: process.env.AWS_BUCKET_IMAGE,
      Key: Date.now()+"-"+file.originalname,
      Body: file.buffer,
    };
    s3.upload(uploadParams, function (err, data) {
      if (err) {
        return reject({ "error": err });
      }
      // console.log(data)
      // console.log(`File uploaded successfully. ${data.Location}`);
      return resolve(data.Location);
    });
  });
};


module.exports = {uploadFile}