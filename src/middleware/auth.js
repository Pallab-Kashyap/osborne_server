const { Device } = require('../models');
const jwt = require("jsonwebtoken");
const  asyncWrapper  = require('../utils/asyncWrapper');
const ApiError = require('../utils/APIError');

const auth = asyncWrapper(async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer")) {
    throw ApiError.unauthorized("No token provided");
  }

  const token = authorization.split(" ")[1];

  const jwtSecret = process.env.JWT_SECRET
  if(!jwtSecret) throw ApiError.internal('ENV missing')
  const { username, userId, deviceId } = jwt.verify(token, jwtSecret);

  if (!username || !userId || !deviceId) {
    throw ApiError.unauthorized("Invalid token");
  }

  const device = await Device.findOne({where: { device_id: deviceId}})

  if(!device){
    throw ApiError.unauthorized('Device not found, please try to login')
  }

  req.deviceToken = token;
  req.username = username;
  req.userId = userId
  req.deviceId = deviceId
  
  next();
});

module.exports = auth;
