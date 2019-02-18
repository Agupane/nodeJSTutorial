const { validationResult } = require('express-validator/check')
const Post = require('../models/post')
const fs = require('fs')
const path = require('path')
const User = require('../models/user')

const getPosts = async (req, res, next) => {
  console.log('returning posts')
  const currentPage = req.query.page || 1
  const perPage = 2
  try {
    let totalItems = await Post.find().countDocuments()
    let posts = await Post.find()
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
    res.status(200).json({
      message: 'Fetched posts successfully',
      posts: posts,
      totalItems: totalItems
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
    creator: req.userId
  })
  try {
    const result = await post.save()
    const user = await User.findById(req.userId)
    let creator = user
    user.posts.push(result)
    await user.save()
    // Create post in db
    res.json({
      message: 'Post created successfully!',
      post: post,
      creator: { _id: creator._id, name: creator.name }
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
    if (post.creator.toString() !== req.userId) {
      const error = new Error('Not authorized')
      error.statusCode = 403
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

const deletePost = async (req, res, next) => {
  const postId = req.params.postId
  try {
    let post = await Post.findById(postId)
    if (!post) {
      const error = new Error('Could not find post')
      error.statusCode = 404
      throw error
    }
    if (post.creator.toString() !== req.userId) {
      const error = new Error('Not authorized')
      error.statusCode = 403
      throw error
    }
    clearImage(post.imageUrl)
    await Post.findByIdAndRemove(postId)
    let user = await User.findById(req.userId)
    user.posts.pull(postId)
    await user.save()
    res.status(200).json({ message: 'Deleted post' })
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500
    }
    next(error)
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
  createPost,
  deletePost
}
