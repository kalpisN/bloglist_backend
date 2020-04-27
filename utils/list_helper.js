var _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, likes) => {
    return sum + likes
  }
  let likes = blogs.map(blog => blog.likes)
  return blogs.length === 0
    ? 0
    : likes.reduce(reducer, 0)

}

const favoriteBlog = (blogs) => {
  if (blogs.length !== 0) {
    let mostLikes
    let indexOfFavorite
    for (var i = 0; i < blogs.length; i++) {
      if (!mostLikes || blogs[i] > mostLikes) {
        mostLikes = blogs[i].likes
        indexOfFavorite = i
      }
      console.log(mostLikes)
    }
    let favoriteBlog = { title: blogs[indexOfFavorite].title, author: blogs[indexOfFavorite].author, likes: blogs[indexOfFavorite].likes }
    return favoriteBlog
  } else {
    return 'No blogs on the list'
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length !== 0) {
    const blog = _.head(_.orderBy(blogs, ['blogs'], ['desc']))
    console.log(blog)
    return { author: blog.author, blogs: blog.blogs }
  }
  return 'No blogs on the list'
}

const mostLikes = (blogs) => {
  if (blogs.length !== 0) {
    const blog = _.head(_.orderBy(blogs, ['likes'], 'desc'))
    console.log(blog)
    return { author: blog.author, likes: blog.likes }
  }
  return 'No blogs on the list'
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}