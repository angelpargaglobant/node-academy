const yup = require('yup')
const { UrlRegex, DateRegex, SourcesEnum } = require('./consts')

let schema = yup
  .object()
  .shape({
    id: yup.string().length(36).required(),
    title: yup.string().max(255).required(),
    author: yup.string().max(100).required(),
    modifiedAt: yup
      .string()
      .required()
      .matches(DateRegex, 'Invalid date format')
      .test('date-time', 'invalid date format, it must be in the past', (date) => {
        const dNow = new Date()
        const modAt = new Date(date)
        return modAt < dNow
      }),
    publishedAt: yup
      .string()
      .notRequired()
      .matches(DateRegex, 'Invalid date format')
      .test('date-time', 'invalid date format, it must be in the past', (date) => {
        const dNow = new Date()
        const modAt = new Date(date)
        return modAt < dNow
      }),
    url: yup.string().url().matches(UrlRegex, 'Must be a url starting with https://'),
    keywords: yup.array().of(yup.string()).required().min(1).max(3),
    readMins: yup.number().required().integer().min(1).max(20),
    source: yup
      .string()
      .required()
      .test('source-valid', 'source must be one of the following values "ARTICLE, BLOG, TWEET, NEWSPAPER"', (source) =>
        SourcesEnum[source] ? true : false,
      ),
  })
  .test({
    name: 'url-null-validation',
    message: 'url can be empty or null just when publishedAt is null',
    test: function ({ url, publishedAt }) {
      if (!url || url?.length === 0) return !publishedAt
      return true
    },
  })
module.exports = { schema }
