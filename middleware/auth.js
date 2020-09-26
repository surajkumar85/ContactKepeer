const jwt =  require("jsonwebtoken");
const config = require("config");

module.exports = (req,res,next)=>{
    //get user token
    const token = req.header('x-auth-token');
    if(!token){
       return  res.status(401).json({msg : 'Invalid token authorization failed'})
    }
    try {
        const decode =  jwt.verify(token,config.get("jwtSecret"))
        req.user = decode.user;
        next();
    } catch (error) {
        res.status(401).json({msg : 'Invalid token authorization failed'})
    }
}