const jwt = require('jsonwebtoken')
const config = require('../config/config')
const { secretPK } = config

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization')
  if (!authHeader) {
    const error = new Error('Not authenticated')
    error.statusCode = 401
    throw error
  }
  const token = authHeader.split(' ')[1]
  let decodedToken
  try {
    decodedToken = jwt.verify(token, secretPK)
  } catch (error) {
    err.statusCode = 500
    throw err
  }
  if (!decodedToken) {
    const error = new Error('Not authenticated')
    err.statusCode = 401
    throw error
  }
  req.userId = decodedToken.userId
  next()
}
