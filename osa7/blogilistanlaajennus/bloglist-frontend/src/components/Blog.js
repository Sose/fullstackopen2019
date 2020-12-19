import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlogLikes, removeBlog, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const [showAll, setShowAll] = useState(false)

  const onBlogTitleClick = () => {
    setShowAll(!showAll)
  }

  const onLikeClick = () => {
    updateBlogLikes(blog)
  }

  const onRemoveClick = async () => {
    removeBlog(blog)
  }

  const showDeleteButton = blog.user
    ? blog.user.username === user.username
    : false

  if (showAll) {
    return (
      <div style={blogStyle}>
        <div className="blogTitleAndAuthor" onClick={onBlogTitleClick}>
          {blog.title} by {blog.author}
        </div>
        <a href={blog.url}>{blog.url}</a>
        <div>
          {blog.likes} likes <button onClick={onLikeClick}>like</button>
        </div>
        {blog.user && <div>added by {blog.user.name}</div>}
        <div>
          {showDeleteButton && <button onClick={onRemoveClick}>remove</button>}
        </div>
      </div>
    )
  } else {
    return (
      <div className="blogTitleAndAuthor" onClick={onBlogTitleClick}>
        {blog.title} by {blog.author}
      </div>
    )
  }
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlogLikes: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
}

export default Blog
