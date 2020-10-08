#
# Post helpers
#
module PostHelpers
  def all_posts
    !data.website.post.nil? ? data.website.post.sort_by{ |id, post| post.post_date }.reverse : []
  end

  def stories
    all_posts.select{ |id, post| !post.tags.nil? && post.tags.include?("Story") }
  end
end