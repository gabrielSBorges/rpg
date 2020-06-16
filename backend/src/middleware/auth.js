const jwt = require('jsonwebtoken');

module.exports = (request, response, next) => {
  const { authorization } = request.headers;

  try {
    const decoded = jwt.verify(authorization, process.env.JWT_KEY);

    request.userData = decoded;

    next();
  }
  catch (err) {
    return response.status(401).json({ message: "Auth failed" });
  }
};