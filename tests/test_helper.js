const Blog = require('../models/blog')

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

/* const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
} */

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, /* nonExistingId,  */blogsInDb
}