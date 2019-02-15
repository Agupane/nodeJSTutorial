const express = require('express')
const { body } = require('express-validator/check')
const feedController = require('../controllers/feed')

const router = express.Router()

// Current URL: /api/feed

router
  .route('/posts')
  .get(feedController.getPosts)
  .post(
    [
      body('title')
        .trim()
        .isLength({ min: 5 }),
      body('content')
        .trim()
        .isLength({ min: 5 })
    ],
    feedController.createPost
  )
router.route('/posts/:postId').get(feedController.getPost)

module.exports = router
