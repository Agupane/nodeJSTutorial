const { validationResult } = require('express-validator/check')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const { secretPK } = config

const signUp = async (req, res, next) => {
  console.log('SignUp')
  checkValidParams(req)
  const email = req.body.email
  const name = req.body.name
  const password = req.body.password
  try {
    let hashedPw = await bcrypt.hash(password, 12)
    const user = new User({
      email: email,
      password: hashedPw,
      name: name
    })
    let result = await user.save()
    res.status(201).json({ userId: result._id })
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500
    }
    next(error)
  }
}
const login = async (req, res, next) => {
  checkValidParams(req, next)
  console.log('valid params')
  const email = req.body.email
  const password = req.body.password
  try {
    let user = await User.findOne({ email: email })
    if (!user) {
      const error = new Error('A user with this email could not be found')
      error.statusCode = 404
      throw error
    }
    let hashedPw = await bcrypt.compare(password, user.password)
    if (!hashedPw) {
      const error = new Error('Wrong password!')
      error.statusCode = 401
      throw error
    }
    // generate token
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString()
      },
      secretPK,
      {
        expiresIn: '1h'
      }
    )
    res.status(201).json({ token: token, userId: user._id.toString() })
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500
    }
    next(error)
  }
}

const checkValidParams = (reqParams, next) => {
  const errors = validationResult(reqParams)
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, data is incorrect')
    error.statusCode = 422
    next(error)
  }
}

module.exports = {
  signUp,
  login
}
