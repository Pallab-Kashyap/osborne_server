const { User, Device, UserToken, RemoteUserToken } = require("../models");
const jwt = require("jsonwebtoken");
const Buffer = require("buffer").Buffer;
const  asyncWrapper  = require("../utils/asyncWrapper");
const ApiError = require("../utils/APIError");
const APIResponse = require("../utils/APIResponse");
const {  generateAccessToken } = require("../utils/generateToken");

const login = asyncWrapper(async (req, res) => {
  const { username, password, deviceId, os_type = 1 } = req.body;

  if (!username || !password || !deviceId) {
    throw ApiError.badRequest("Missing required fields");
  }

  const credentials = `${username}:${password}`;
  const base64EncodedCredentials = Buffer.from(credentials).toString("base64");
  const authHeader = `Basic ${base64EncodedCredentials}`;

  const osborneURL = process.env.OSBORNE_AUTH_TOKEN_API

  if(!osborneURL){
    throw ApiError.internal('ENV missing')
  }

  let result;

try {
     result = await fetch(
      osborneURL,
      {
        method: "get",
        headers: { Authorization: authHeader },
      }
    ).then((res) => res.json());
} catch (error) {
  throw ApiError.internal('Osborne server Error')
}

  if (!result.token) {
    throw ApiError.unauthorized("Invalid credentials");
  }

  let [user] = await User.findOrCreate({ where: { username } });

  const auth_token = result.token;
  const expire = result.expired;
  const date = new Date(expire * 1000);

  const deviceToken = generateAccessToken({ userId: user.id, username, deviceId }, "7d");

  const storeUserToken = async () => {
    const timestampNow = Date.now();
    const expiryDate = timestampNow + 7 * 24 * 60 * 60 * 1000;
    await UserToken.upsert({
      user_id: user.id,
      value: deviceToken,
      time_expired: expiryDate,
      device_id: deviceId,
    },{
      where: { user_id: user.id }
    });
  };

  try {
    await Promise.all([
      Device.upsert(
        {
          user_id: user.id,
          device_id: deviceId,
          os_type: os_type,
        },
        {
          where: { device_id: deviceId },
        }
      ),
      storeUserToken(),
      RemoteUserToken.upsert(
        {
          user_id: user.id,
          value: auth_token,
          time_expired: date,
        },
        {
          where: { user_id: user.id },
        }
      ),
    ]);
  } catch (error) {
    throw ApiError.internal("Error in storing data in local database");
  }

  return APIResponse.success(res, "Device token generated successfully", {
    deviceToken,
  });
});

const get_remote_token = asyncWrapper(async (req, res) => {

  const userId = req.userId

  const remoteAuthToken = await RemoteUserToken.findOne({
    where: { user_id: userId },
  });

  if (!remoteAuthToken) {
    throw ApiError.unauthorized("Authentication Token not found, please first");
  }

  const exp = authToken.time_expired;
  const currentTime = new Date();

  if (exp < currentTime) {
    throw ApiError.unauthorized("Authentication token expired");
  }

  return APIResponse(res, '', { remote_token: remoteAuthToken })
});

const logout = asyncWrapper(async (req, res) => {
  const { deviceToken, username, deviceId } = req;

  if (!deviceToken || !username) {
    throw ApiError.internal("Error in auth middleware");
  }

  const removeUserToken = async () => {
    const userToken = await UserToken.findOne({
      where: { value: deviceToken },
    });
    await userToken.destroy()
  } 
  
  const removeUserdevice = async () => {
    const userDevice = await Device.findOne({
      where: { device_id: deviceId},
    });
    await userDevice.destroy()
  } 

  await Promise.all([
    removeUserToken(),
    removeUserdevice(),
  ]);

  return APIResponse.success(
    res,
    `logged out successfully`
  );
});

module.exports = {
  login,
  get_remote_token,
  logout,
};
