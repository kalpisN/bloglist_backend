const listHelper = require('../utils/list_helper')

const blogs = [
  {
    id: '5a422aa71b54a676234d17f8',
    title: 'Chocochili',
    author: 'Elina Innanen',
    url: 'www.chocochili.net',
    blogs: 658,
    likes: 1350
  },
  {
    id: '5a423ab71b55a676234d17f8',
    title: 'Maikin Mokomin',
    author: 'Maikki',
    url: 'blogspot.maikinmokomin.com',
    blogs: 432,
    likes: 1050
  },
  {
    id: '5b423ba71b54a676334d17f9',
    title: 'Hellapoliisi',
    author: 'Kati Jaakonen',
    url: 'www.hellapoliisi.net',
    blogs: 722,
    likes: 1150
  }
]

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {

  test('when array has many blogs', () => {
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(3550)
  })

  test('when array has only one blog', () => {
    const result = listHelper.totalLikes([{
      id: '5b423ba71b54a676334d17f9',
      title: 'Hellapoliisi',
      author: 'Kati Jaakonen',
      url: 'www.hellapoliisi.net',
      likes: 1150 }])
    expect(result).toBe(1150)
  })
  test('of empty array is zero', () => {
    expect(listHelper.totalLikes([])).toBe(0)
  })
})
describe('favorite blog', () => {
  const blog = {
    title: 'Chocochili',
    author: 'Elina Innanen',
    likes: 1350
  }
  test('when array has many blogs', () => {
    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual(blog)
  })

  test('when array has only one blog', () => {
    let result = listHelper.favoriteBlog([blog])
    expect(result).toEqual(blog)
  })

  test('when array is empty', () => {
    expect(listHelper.favoriteBlog([])).toBe('No blogs on the list')
  })
})

describe('most blogs', () => {
  const blog = {
    author: 'Kati Jaakonen',
    blogs: 722
  }

  test('when array has many blogs', () => {
    let result = listHelper.mostBlogs(blogs)
    expect(result).toEqual(blog)
  })
  test('when array has only one blog', () => {
    let result = listHelper.mostBlogs([blog])
    expect(result).toEqual(blog)
  })
  test('when array is empty', () => {
    expect(listHelper.mostBlogs([])).toBe('No blogs on the list')
  })
})

describe('most likes', () => {
  const blog = {
    author: 'Elina Innanen',
    likes: 1350
  }

  test('when array has many blogs', () => {
    let result = listHelper.mostLikes(blogs)
    expect(result).toEqual(blog)
  })
  test('when array has only one blog', () => {
    let result = listHelper.mostLikes([blog])
    expect(result).toEqual(blog)
  })
  test('when array is empty', () => {
    expect(listHelper.mostLikes([])).toBe('No blogs on the list')
  })
})