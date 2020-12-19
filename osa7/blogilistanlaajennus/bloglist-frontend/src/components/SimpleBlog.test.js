import React from 'react'
import { render, fireEvent } from 'react-testing-library'
import SimpleBlog from './SimpleBlog'

test('renders content', () => {
  const blog = {
    likes: 127,
    title: 'Mielenkiintoista',
    author: 'Matti Meikäläinen',
    url: 'http://google.com',
  }

  const component = render(<SimpleBlog blog={blog} />)

  const titleDiv = component.container.querySelector('.blogTitleAndAuthor')
  expect(titleDiv).toHaveTextContent('Mielenkiintoista Matti Meikäläinen')

  const likesDiv = component.container.querySelector('.blogLikes')
  expect(likesDiv).toHaveTextContent('blog has 127 likeslike')
})

test('clicking the button twice calls the event handler twice', async () => {
  const blog = {
    likes: 127,
    title: 'Mielenkiintoista',
    author: 'Matti Meikäläinen',
    url: 'http://google.com',
  }

  const mockHandler = jest.fn()

  const { getByText } = render(<SimpleBlog blog={blog} onClick={mockHandler} />)

  const button = getByText('like')
  fireEvent.click(button)
  fireEvent.click(button)

  expect(mockHandler.mock.calls.length).toBe(2)
})
