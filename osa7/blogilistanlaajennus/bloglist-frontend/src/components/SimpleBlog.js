import React from 'react'

const SimpleBlog = ({ blog, onClick }) => (
  <div className="blog">
    <div className="blogTitleAndAuthor">
      {blog.title} {blog.author}
    </div>
    <div className="blogLikes">
      blog has {blog.likes} likes
      <button onClick={onClick}>like</button>
    </div>
  </div>
)

export default SimpleBlog
