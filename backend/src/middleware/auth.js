const jwt = require('jsonwebtoken');
const mongo = require('../database/mongo');
const bcrypt = require('bcrypt');
const { MongoID } = require('../utils/validate');

module.exports = async (request, response, next) => {
  const { authorization } = request.headers;

  try {
    const decoded = jwt.verify(authorization, process.env.JWT_KEY);
    
    // Verificar se o token existe no banco
    let findToken = await mongo.findToken(MongoID(decoded.id));

    if (findToken.status !== "success") {
      return response.status(401).json({ message: findToken.message });
    }

    bcrypt.compare(authorization, findToken.token, (err, res) => {
      if (res) {
        request.userData = decoded;
    
        next();
      }
      else {
        return response.status(401).json({ message: "Auth failed. Invalid token!" });
      }
    });
  }
  catch (err) {
    return response.status(401).json({ message: "Auth failed. Invalid token!" });
  }
};