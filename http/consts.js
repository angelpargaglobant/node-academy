const DateRegex = /^\d{2}[./]\d{2}[./]\d{4}$/
const UrlRegex = /^https:\/\//
const SourcesEnum = {
  ARTICLE: 'ARTICLE',
  BLOG: 'BLOG',
  TWEET: 'TWEET',
  NEWSPAPER: 'NEWSPAPER',
}
module.exports = { DateRegex, UrlRegex, SourcesEnum }
