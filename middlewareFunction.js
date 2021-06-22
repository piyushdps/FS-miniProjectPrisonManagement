const loginCheckMiddleWare = (req,res,next) =>{

    if (!req.cookies.token || req.cookies.token !== 'encryptedstring'  ) return res.status(401).json({message:'Please Login '});

    console.log('Logged In ✔️');

    next();



}

module.exports = loginCheckMiddleWare