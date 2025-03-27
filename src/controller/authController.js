const { User, Device, UserToken, RemoteUserToken } = require('../models');
const jwt = require('jsonwebtoken');
const Buffer = require('buffer').Buffer;

const get_device_token = async (req, res) => {
  const { username, password, deviceId } = req.body;
  const credentials = `${username}:${password}`;
  const base64EncodedCredentials = Buffer.from(credentials).toString('base64');
  const authHeader = `Basic ${base64EncodedCredentials}`;

  try {
    const result = await fetch('https://www.osbornebooks.co.uk/api/get_auth_token', {
      method: 'get',
      headers: { "Authorization": authHeader }
    }).then(res => res.json());

    if (!result.token) {
      return res.send({ message: "wrong credentials" });
    }

    const auth_token = result.token;
    const expire = result.expired;
    const date = new Date(expire * 1000);
    const jwtSecret = 'aofeooieoeowjwoow';
    const deviceToken = jwt.sign({ username }, jwtSecret, { expiresIn: '7d' });

    let user = await User.findOne({ where: { username } });
    if (!user) {
      user = await User.create({ username });
    }

    await Device.create({
      id: deviceId,
      os_type: '12',
      register_time: date,
      username
    });

    await UserToken.create({
      value: deviceToken,
      username,
      time_created: date,
      time_expired: date,
      device_id: deviceId
    });

    await RemoteUserToken.create({
      value: auth_token,
      time_expired: date,
      username
    });

    return res.status(200).json({ deviceToken });

  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'something went wrong' });
  }
};

const logout = async (req, res) => {
  const { deviceToken, username } = req;

  try {
    const userDevice = await UserToken.findOne({
      where: { value: deviceToken },
      include: [
        { model: Device },
        { model: RemoteUserToken }
      ]
    });

    if (!userDevice) {
      return res.send({ message: 'device not found' });
    }

    await UserToken.destroy({ where: { value: deviceToken } });
    await Device.destroy({ where: { id: userDevice.Device.id } });
    await RemoteUserToken.destroy({ where: { id: userDevice.RemoteUserToken.id } });

    return res.json({ message: `${username} with device ${userDevice.Device.id} logout` });

  } catch (error) {
    console.log(error);
    return res.send({ message: 'something went wrong' });
  }
};

module.exports = {
  get_device_token,
  logout
};
