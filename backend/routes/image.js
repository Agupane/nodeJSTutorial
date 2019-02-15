const express = require('express')
const path = require('path')

const router = express.Router()

// Current URL: /api/images

router.use('/', express.static(path.join(__dirname, '/assets/images')))

module.exports = router
