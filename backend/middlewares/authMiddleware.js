import jwt from "jsonwebtoken"


export const authenticate = (req,res,next)=>{

    try{
            // step1 - we need to read header
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({message: "No token Provided"});
    }

    // step 2 - extracting token from header
    const token = authHeader.split(" ")[1]; //remainder - Bearer <token>
    if(!token){
        return res.status(401).json({message: "Invalid token format"});
    }

    // now verifying token - step 3
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // doubth full checking throw postman attaching decoded payload to req object for further use
    next();

} catch (error){
    res.status(401).json({message: "Unauthorized Access"});
}
};