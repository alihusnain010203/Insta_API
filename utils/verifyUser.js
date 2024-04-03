const jwt=require('jsonwebtoken');

const verifyUser=(req,res,next)=>{
    const token=req.headers.authorization||req.body.token;
    if(!token){
        res.status(401).json({success:false,data:"Please Provide Token"})
    }
    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
        req.user=decoded;
        next();
    } catch (error) {
        res.status(401).json({success:false,data:"Invalid Token"})
    }
}

module.exports=verifyUser;