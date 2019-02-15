/** Imports **/
const express = require('express')
const feedRoutes = require('./feed')
const imageRoutes = require('./image')

const router = express.Router()
router.use('/feed', feedRoutes)
router.use('/images', imageRoutes)

module.exports = router
