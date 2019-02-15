/** Imports **/
const express = require('express')
const feedRoutes = require('./feed')
const authRoutes = require('./auth')

const router = express.Router()
router.use('/feed', feedRoutes)
router.use('/auth', authRoutes)

module.exports = router
