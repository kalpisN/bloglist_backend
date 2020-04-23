const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', (request, response) => {
    Blog.find({})
        .then(blogs => {
            response.json(blogs.map(blog => blog.toJSON()))
        })
})

blogRouter.post('/', (request, response) => {
    const blog = new Blog(request.body)

    blog
        .save()
        .then(result => {
            response.status(201).json(result)
        })

    /*         const body = request.body
    
            const blog = New Blog({
                    title: body.title,
                    author: body.author,
                    url: body.url,
                    likes: body.likes
            })
                .save()
                .then(result => {
                    response.status(201).json(result)
                }) */
})

module.exports = blogRouter