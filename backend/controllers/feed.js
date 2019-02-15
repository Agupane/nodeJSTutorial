const { validationResult } = require('express-validator/check')
const Post = require('../models/post')
const fs = require('fs')
const path = require('path')

const getPosts = async (req, res, next) => {
  console.log('returning posts')
  try {
    let posts = await Post.find()
    res.status(200).json({
      message: 'Fetched posts successfully',
      posts: posts
    })
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

const createPost = async (req, res, next) => {
  console.log('creating posts')
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, data is incorrect')
    error.statusCode = 422
    throw error
  }
  const title = req.body.title
  const content = req.body.content
  const post = new Post({
    title: title,
    content: content,
    imageUrl: '/assets/images/index.jpeg',
    creator: {
      name: 'Test'
    }
  })
  try {
    const result = await post.save()
    // Create post in db
    res.json({
      message: 'Post created successfully!',
      post: result
    })
  } catch (error) {
    console.error(error)
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

const getPost = async (req, res, next) => {
  console.log('getting post with params ', req.params.postId)
  const postId = req.params.postId

  try {
    let post = await Post.findById(postId)
    if (!post) {
      const error = new Error('Could not find post')
      error.statusCode = 404
      throw error
    }
    res.status(200).json({ message: 'Post fetched', post })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

const updatePost = async (req, res, next) => {
  console.log('getting post with params ', req.params.postId)
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect')
    error.statusCode = 422
    throw error
  }
  const postId = req.params.postId
  const title = req.body.title
  const content = req.body.content
  let imageUrl = req.body.image
  if (req.file) {
    imageUrl = req.file.path
  }
  if (!imageUrl) {
    const error = new Error('No file picked')
    error.statusCode = 422
    throw error
  }
  try {
    let post = await Post.findById(postId)
    if (!post) {
      const error = new Error('Could not find post')
      error.statusCode = 404
      throw error
    }
    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl)
    }
    post.title = title
    post.imageUrl = imageUrl
    post.content = content
    let result = await post.save()
    post._id = result._id
    res.status(200).json({ message: 'Post fetched', post })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath)
  fs.unlink(filePath, err => console.error(err))
}

module.exports = {
  getPosts,
  getPost,
  updatePost,
  createPost
}
