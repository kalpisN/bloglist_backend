const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const initialBlogs = [
  {
    title: 'Chocochili',
    author: 'Elina Innanen',
    url: 'www.chocochili.net',
    blogs: 658,
    likes: 1350
  },
  {
    title: 'Maikin Mokomin',
    author: 'Maikki',
    url: 'blogspot.maikinmokomin.com',
    blogs: 432,
    likes: 1050
  },
  {
    title: 'Hellapoliisi',
    author: 'Kati Jaakonen',
    url: 'www.hellapoliisi.net',
    blogs: 722,
    likes: 1150
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const initialUser = async () => {
  const passwordHash = await bcrypt.hash('sekret', 10)
  return new User({ username: 'root', passwordHash })
}

const token = async () => {
  const user = await User.findOne({ username: 'root' })

  const userForToken = {
    username: 'root',
    id: user._id
  }

  return jwt.sign(userForToken, process.env.SECRET)
}
module.exports = {
  initialBlogs, blogsInDb, usersInDb, token, initialUser
}