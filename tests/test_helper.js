const Blog = require('../models/blog')
const User = require('../models/user')

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

module.exports = {
  initialBlogs, blogsInDb, usersInDb
}