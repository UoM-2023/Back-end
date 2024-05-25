const jwt = require('jsonwebtoken');

exports.verifyToken = async (req,res,next) => {
    const token = req.cookies.token;
    console.log(token);

    if (token === undefined){
        console.log('Unothorized User');
        return res.status(401).json({message: "Access Denied! Unauthorized User"});
    } else {
        jwt.verify(token, process.env.SECRET_KEY, (err, authData)=>{
            if (err){
                console.log('Invalid token');
                return res.status(401).json({message: 'Invalid Token'});
            } else {
                console.log(authData.user.userRole);
                const role = authData.user.userRole;
                // More user roles to add
                if(role === "admin"){
 
                    next();
                } else{
                    return res.json({message: "Access Denied!"});
            }
        }
    })
}

}