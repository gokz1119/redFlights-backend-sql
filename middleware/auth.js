const jwt = require('jsonwebtoken');

const secret = 'pneumonoultramicroscopicsilicovolcanoconiosis94'

function authenticate(req, res, next) {
  const token = req.header('auth');
  if(!token)
    return res.status(401).send("Invalid token");
  
  try {
    req.tokenDecoded = jwt.verify(token, secret);
    next();
  }
  catch(err) {
    res.status(400).send({msg: "Invalid token"});
  }
}

module.exports = authenticate;