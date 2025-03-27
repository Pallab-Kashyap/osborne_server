// const pool = require("../config/db");
// const { findAuthTokenQuery } = require("../dbQuery/user");
const { RemoteUserToken } = require('../models');
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  console.log("ent auth");
  const { authorization } = req.headers;

  if (authorization && authorization.startsWith("Bearer")) {
    try {
      let token = authorization.split(" ")[1];
      const jwtSecret = "aofeooieoeowjwoow";

      const { username } = jwt.verify(token, jwtSecret);

      if (username) {
        // const authToken = await pool.query(findAuthTokenQuery, [username]);
        const authToken = await RemoteUserToken.findOne({
          where: { username },
          order: [['createdAt', 'DESC']]
        });
        console.log(authToken.rows);
        if (authToken) {
          const exp = authToken.time_expired;
          const currentTime = new Date();
          req.authToken = authToken.value;
          req.deviceToken = token;
          req.username = username;

          if (exp < currentTime) {
            return res.send({ message: "auth_token expired" });
          }
        } else {
          return res.send({ message: "auth token not found" });
        }
      }

      console.log("ext auth");
      next();
    } catch (error) {
      console.log(error);
      res.send({ status: "failed", message: "not a valid user" });
    }
  } else {
    res.send({ status: "failed", message: "no token" });
  }
};

module.exports = auth;
