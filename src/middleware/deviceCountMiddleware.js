const { Device, UserToken, RemoteUserToken } = require('../models');
const jwt = require('jsonwebtoken');

const deleteEarliestDevice = async (username) => {
  try {
    const earliestDevice = await Device.findOne({
      where: { username },
      order: [['register_time', 'ASC']],
      include: [
        { model: UserToken },
        { model: RemoteUserToken }
      ]
    });

    if (!earliestDevice) {
      return res.send({ message: "hit device limit but no device found" });
    }

    await UserToken.destroy({
      where: { device_id: earliestDevice.id }
    });

    await RemoteUserToken.destroy({
      where: { id: earliestDevice.RemoteUserToken.id }
    });

    await earliestDevice.destroy();

  } catch (error) {
    throw error;
  }
};

const deviceCount = async (req, res, next) => {
  const { username, deviceId } = req.body;

  if (!username) return res.send({ message: "all fields required" });

  try {
    const devices = await Device.findAll({
      where: { username }
    });

    if (devices.length > 0) {
      let deviceFound = false;
      for (const device of devices) {
        if (device.id === deviceId) {
          deviceFound = true;
          const jwtSecret = "aofeooieoeowjwoow";
          const deviceToken = jwt.sign({ username }, jwtSecret, {
            expiresIn: "7d",
          });

          await UserToken.update(
            { value: deviceToken },
            { where: { 
              device_id: deviceId,
              username: username 
            }}
          );

          return res.send({ message: "success", deviceToken: deviceToken });
        }
      }

      if (!deviceFound) {
        if (devices.length >= 3) {
          await deleteEarliestDevice(username);
        }
        next();
        return;
      }
    } else {
      next();
      return;
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "internal server error" });
  }
};

module.exports = {
  deviceCount,
};
