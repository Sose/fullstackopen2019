import React from 'react'
import PropTypes from 'prop-types'

import { useField } from '../hooks'

import blogService from '../services/blogs'

const AddBlogForm = ({ addNewBlog }) => {
  const title = useField('text')
  const author = useField('text')
  const url = useField('text')

  const handleBlogSubmit = async (e) => {
    e.preventDefault()
    console.log('submitting new blog', title, author, url)

    try {
      const newBlog = {
        title: title.value,
        author: author.value,
        url: url.value,
      }

      const response = await blogService.create(newBlog)
      addNewBlog(response)
    } catch (exception) {
      console.log('exception in handleBlogSubmit', exception)
    }
  }

  return (
    <form onSubmit={handleBlogSubmit}>
      <div>
        title
        <input {...title} reset={undefined} />
      </div>
      <div>
        author
        <input {...author} reset={undefined} />
      </div>
      <div>
        url
        <input {...url} reset={undefined} />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default AddBlogForm

AddBlogForm.propTypes = {
  addNewBlog: PropTypes.func.isRequired,
}
