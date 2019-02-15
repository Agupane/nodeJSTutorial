/** Imports **/
const express = require('express')
const feedRoutes = require('./feed')

const router = express.Router()
router.use('/feed', feedRoutes)

module.exports = router
