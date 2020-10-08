# Activate and configure extensions
# https://middlemanapp.com/advanced/configuration/#configuring-extensions

activate :autoprefixer do |prefix|
  prefix.browsers = "last 2 versions"
end

# Layouts
# https://middlemanapp.com/basics/layouts/

# Per-page layout changes
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false


activate :livereload


# With alternative layout
# page '/path/to/file.html', layout: 'other_layout'

# Proxy pages
# https://middlemanapp.com/advanced/dynamic-pages/

# proxy(
#   '/this-page-has-no-template.html',
#   '/template-file.html',
#   locals: {
#     which_fake_page: 'Rendering a fake page with a local variable'
#   },
# )

# Helpers
# Methods defined in the helpers block are available in templates
# https://middlemanapp.com/basics/helper-methods/

# helpers do
#   def some_helper
#     'Helping'
#   end
# end

# Build-specific configuration
# https://middlemanapp.com/advanced/configuration/#environment-specific-settings

# configure :build do
#   activate :minify_css
#   activate :minify_javascript
# end

# helpers
require "lib/post_helpers"
helpers PostHelpers



# contentful integration
activate :contentful do |f|
  # f.space         = { website: ENV['MD_CONTENTFUL_SPACE_ID'] }
  f.space         = { website: ENV['x1b93ldag9qk'] }
  # f.access_token  = ENV['MD_CONTENTFUL_API_KEY']
  f.access_token  = ENV['gNQgR-pS7UxdMHnrVaPbq4ldootVGlwO0qI1Ladnb40']

  f.cda_query     = { include: 1, order: 'sys.createdAt' }
  f.all_entries = true
  f.content_types = { 
    # book: 'book', 
    # video: 'video',
    # supporter: 'supporter',
    # contentBlock: 'contentBlock',
    # speaker: 'speaker',
    # event: 'event',
    post: 'post',
    # person: 'person',
    # value: 'value',
    # podcastEpisode: 'podcastEpisode',
    # announcement: 'announcement'
  }
  # f.use_preview_api = !ENV['MD_CONTENTFUL_USE_PREVIEW'].nil? && ENV['MD_CONTENTFUL_USE_PREVIEW'] == "true"
 f.use_preview_api = !ENV['eXjhKrdCuhRTbq-7p7iCV1jfbDRqbQcBsAmcXjUqxqQ'].nil? && ENV['eXjhKrdCuhRTbq-7p7iCV1jfbDRqbQcBsAmcXjUqxqQ'] == "true" 


end