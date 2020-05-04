const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')


blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs.map(u => u.toJSON()))
})

blogRouter.post('/', async (request, response) => {
  const body = request.body
  // eslint-disable-next-line no-undef
  if (!request.token || !request.token.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(request.token.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    blogs: body.blogs,
    likes: body.likes === undefined ? 0 : body.likes,
    user: user._id
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.json(savedBlog.toJSON)
})

blogRouter.delete('/:id', async (request, response) => {
  if (!request.token || !request.token.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findOne({ username: request.token.username })
  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    response.status(401).end()
  }
})

blogRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    blogs: body.blogs,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog.toJSON())

})


module.exports = blogRouter