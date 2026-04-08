const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_KEY;

function authMiddleware(req, res, next) {
    try{
        const token = req.headers.authorization;
        const decodedJWT = jwt.verify(token, SECRET_KEY);

        if(decodedJWT){
            req.userId = decodedJWT.id;
            next();
        }
        else {
            return res.status(403).json({
                message : "Incorrect Credentials"
            })
        }
    } catch(error) {
        console.log(error);
        res.status(500).json({ error: "Authentication failed" });
    }
}

module.exports = {
    authMiddleware,
    SECRET_KEY
}