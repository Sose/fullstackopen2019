// puuttuvat tehtävät: 5.16*, 5.17*

import React from 'react'
import { render, fireEvent } from 'react-testing-library'
import Blog from './Blog'

test('only shows title and author before clicking', async () => {
  const blog = {
    likes: 127,
    title: 'Mielenkiintoista',
    author: 'Matti Meikäläinen',
    url: 'http://google.com',
  }

  const component = render(<Blog blog={blog} />)

  expect(component.container).toHaveTextContent(
    `${blog.title} by ${blog.author}`
  )

  const blogTitleDiv = component.container.querySelector('.blogTitleAndAuthor')
  fireEvent.click(blogTitleDiv)
  expect(component.container).toHaveTextContent(
    'Mielenkiintoista by Matti Meikäläinenhttp://google.com127 likes like'
  )
})
