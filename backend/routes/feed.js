const express = require('express')

const feedController = require('../controllers/feed')

const router = express.Router()

// Current URL: /api/feed

router
  .route('/posts')
  .get(feedController.getPosts)
  .post(feedController.createPost)

module.exports = router
