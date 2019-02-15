const express = require('express')
const authController = require('../controllers/auth')
const { body } = require('express-validator/check')
const router = express.Router()
const User = require('../models/user')

// Current URL: /api/auth
router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .custom(async (value, { req }) => {
        let userDoc = await User.findOne({ email: value })
        if (userDoc) {
          return Promise.reject('Email address already exists!')
        }
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 }),
    body('name')
      .trim()
      .not()
      .isEmpty()
  ],
  authController.signUp
)

router.post('/login', authController.login)
module.exports = router
