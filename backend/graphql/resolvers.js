const User = require('../model/User')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const Post = require('../model/Post')

module.exports = {
  hello() {
    return {
      text: 'Hello World!',
      views: 1234
    }
  },
  createUser: async ({ userInput }, req) => {
    const errors = []
    const email = userInput.email
    if(!validator.isEmail(userInput.email)) {
      errors.push({message: 'Email is invalid'})
    }
    if(validator.isEmpty(userInput.password) || !validator.isLength(userInput.password, { min: 5 })) {
      errors.push({ message: 'Password is too short'})
    }
    if(errors.length>0){
      const error = new Error('Invalid Input')
      error.data = errors
      errors.code = 422
      throw error
    }
    const existingUser = await User.findOne({email: userInput.email})
    if(existingUser) {
      const error = new Error('User already exists')
      throw error
    }
    const hashedPw = await bcrypt.hash(userInput.password, 12)
    const user = new User({
      email: userInput.email,
      name: userInput.name,
      password: hashedPw
    })
    const createUser = await User.save()
    return { ...createdUser._doc, _id: createdUser._id.toString()}
  },
  login: async ({email, password}) => {
    const user = await User.findOne({email: email})
    if(!user) {
      const error = new Error('User not found')
      error.code = 401
      throw error
    }
    const isEqual = await bcrypt.compare(password, user.password)
    if(!isEqual) {
      const error = new Error('Password is incorrect')
      error.code = 401
      throw error
    }
    const token = jwt.sign({
      userId: user._id.toString(),
      email: user.email
    }, 'supersecretpk', {expiresIn: '1h'})
    return { token: token, userId: user._id.toString()}
  },
  createPost: async ({ postInput }, req ) => {
    if(!req.isAuth) {
      const error = new Error('Not authenticated')
      error.code = 401
      throw error
    }
    const errors = []
    if(validator.isEmpty(postInput.title) || !validator.isLength(postInput.title, {min: 5})) {
      errors.push({message: 'Content is invalid'})
    }
    if(errors.length>0){
      const error = new Error('Invalid Input')
      error.data = errors
      errors.code = 422
      throw error
    }
    const user = await User.findById(req.userId)
    if(!user) {
      const error = new Error('Invalid user')
      error.code = 401
      throw error
    }
    const post = new Post({
      title: postInput.title,
      content: postInput.content,
      imageUrl: postInput.imageUrl,
      creator: user
    })
    const createdPost = await post.save()
    user.posts.push(createdPost)
    await user.save()
    return {...createdPost._doc, _id: createdPost._id.toString(), createdAt: createdPost.createdAt.toISOString(), updatedAt: createdPost.updatedAt.toISOString()}
  },
  posts: async ({page}, req) => {
    if(!req.isAuth) {
      const error = new Error('Not authenticated')
      error.code = 401
      throw error
    }
    if(!page) {
      page =1
    }
    const perPage = 2
    const totalPosts = await Post.find().countDocuments()
    const post = await Post.find()
      .sort({createdAt: -1})
      .skip((page-1) * perPage)
      .limit(perPage)
      .populate('creator')
    return {
      posts: post.map(p => {
        return {...p._doc, _id: p._id.toString(), createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString()}
      }), totalPosts: totalPosts}
    },
  post: async ({id}, req) => {
    if(!req.isAuth) {
      const error = new Error('Not authenticated')
      error.code = 401
      throw error
    }
    const post = await Post.findById(id).populate('creator')
    if(!post) {
      const error = new Error('No post found')
      error.code = 404
      throw error
    }
    return {
      ...post._doc,
      id: post._id.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    }
  },
  updatePost: async ({id, postInput}, req) => {
    if(!req.isAuth) {
      const error = new Error('Not authenticated')
      error.code = 401
      throw error
    }
    const post = await Post.findById(id).populate('creator')
    if(!post) {
      const error = new Error('No post found')
      error.code = 404
      throw error
    }
    if(post.creator._id.toString() !== req.userId.toString()) {
      const error = new Error('Not authorized!')
      error.code = 403
      throw error
    }
    const errors = []
    if(validator.isEmpty(postInput.title) || !validator.isLength(postInput.title, {min: 5})) {
      errors.push({message: 'Content is invalid'})
    }
    if(errors.length>0){
      const error = new Error('Invalid Input')
      error.data = errors
      errors.code = 422
      throw error
    }
    post.title = postInput.title
    post.content = postInput.content
    if(postInput.imageUrl !== 'undefined') {
      post.imageUrl = postInput.imageUrl
    }
    const updatedPost = await post.save()

    return {
      ...updatedPost._doc,
      _id: updatedPost._id.toString(),
      createdAt: updatedPost.createdAt.toISOSTring(),
      updatedAt: updatedPost.updatedAt.toISOString()
    }
  },
  deletePost: async ({id}, req) => {
    if(!req.isAuth) {
      const error = new Error('Not authenticated')
      error.code = 401
      throw error
    }
    const post = await Post.findById(id)
    if(!post) {
      const error = new Error('No post found')
      error.code = 404
      throw error
    }
    if(post.creator.toString() !== req.userId.toString()) {
      const error = new Error('Not authorized!')
      error.code = 403
      throw error
    }
    await Post.findByIdAndRemove(id)
    const user = await User.findById(req.userId)
    user.posts.pull(id)
    await user.save()
    return true
  }
}