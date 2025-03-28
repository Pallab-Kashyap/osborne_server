const { Device, User } = require("../models");
const asyncWrapper = require("../utils/asyncWrapper");
const APIError = require("../utils/APIError");

const deleteEarliestDevice = async (userId) => {
  const earliestDevice = await Device.findOne({
    where: { user_id: userId },
    order: [["register_time", "ASC"]],
  });

  if (!earliestDevice) {
    throw APIError.badRequest("Hit device limit but no device found");
  }
  await earliestDevice.destroy();
};

const deviceCount = asyncWrapper(async (req, res, next) => {
  const { username, deviceId } = req.body;
  if (!username || !deviceId) {
    throw APIError.badRequest("Username & deviceId are required fields");
  }

  const user = await User.findOne({ where: { username } });

  if (!user) {
    next();
    return
  }

  req.userId = user.id

  const devices = await Device.findAll({
    where: { user_id: user.id },
  });

  if (devices && devices.length >= 3) {
    await deleteEarliestDevice(user.id);
    next();
    return;
  } else {
    next();
    return;
  }
});

module.exports = {
  deviceCount,
};
