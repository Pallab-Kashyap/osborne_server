const jwt = require('jsonwebtoken')

 const generateAccessToken = (payload, expiresIn) => {
    const jwtSecret = process.env.JWT_SECRET
    if(!jwtSecret){
        throw ApiError.internal('ENV missing')
    }

    return jwt.sign(payload, jwtSecret, {expiresIn})
}

module.exports = {
    generateAccessToken
}