const jwt = require('jsonwebtoken')
const ApiError = require('./APIError')

 const generateAccessToken = (payload, expiresIn) => {
    const jwtSecret = process.env.JWT_SECRET
    if(!jwtSecret){
        throw ApiError.internal('ENV missing')
    }

    return jwt.sign(payload, jwtSecret, {expiresIn})
}

const veriryToken = (token) => {
        const jwtSecret = process.env.JWT_SECRET
        if(!jwtSecret) throw ApiError.internal('ENV missing')

        return jwt.verify(token, jwtSecret);
}

module.exports = {
    generateAccessToken,
    veriryToken
}