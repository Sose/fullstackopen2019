const dummy = blogs => {
  return 1;
};

const totalLikes = blogs =>
  blogs.reduce((total, blog) => total + blog.likes, 0);

const favoriteBlog = blogs => {
  return blogs.reduce((currentBest, blog) => {
    if (!currentBest) return blog;

    if (currentBest.likes < blog.likes) return blog;
    else return currentBest;

  }, undefined);
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
