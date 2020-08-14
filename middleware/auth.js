const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if(!token){
    return res.status(401).json({ msg: 'No token, auth denied' });
  }

  //verify if there is a jsonwebtoken
  try {
    //get the decoded payload
    //we provide a secret, and if the secret is wrong, then err is returned instead
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    //assign the decoded and verified user into req.user
    req.user = decoded.user;
    next();
  }catch(err){
    res.status(401).json({ msg: 'Token is not valid' });
  }
}
