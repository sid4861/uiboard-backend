const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')
        if (!token) {
            return res.status(403).json({ success: false, msg: `Missing authentication token in request` });
        }

        const decoded =  await jwt.verify(token, process.env.JWT_SECRET);


        if (!decoded) {
            return res.status(403).json({ success: false, msg: `Invalid authentication token in request` });
        }

        req.userId=decoded.userId;
        next();
    } catch (error) {
        console.error(`Error! ${error.message}`)
       return res.status(500).json({ success: false, msg: error.message })
    }
}

module.exports = {userAuth};