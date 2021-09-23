const { readdir, readFile } = require('fs')
const { promisify } = require('util')
const yup = require('yup')

const dateRegex = /^\d{2}[./]\d{2}[./]\d{4}$/
const urlRegex = /^https:\/\//
const SourcesEnum = {
  ARTICLE: 'ARTICLE',
  BLOG: 'BLOG',
  TWEET: 'TWEET',
  NEWSPAPER: 'NEWSPAPER',
}

let schema = yup
  .object()
  .shape({
    id: yup.string().length(36).required(),  
    title: yup.string().max(255).required(),  
    author: yup.string().max(100).required(),  
    modifiedAt: yup
      .string()
      .required()
      .matches(dateRegex, 'Invalid date format')
      .test('date-time', 'invalid date format, it must be in the past', (date) => {
        const dNow = new Date()
        const modAt = new Date(date)
        return modAt < dNow
      }), 
    publishedAt: yup
      .string()
      .notRequired()
      .matches(dateRegex, 'Invalid date format')
      .test('date-time', 'invalid date format, it must be in the past', (date) => {
        const dNow = new Date()
        const modAt = new Date(date)
        return modAt < dNow
      }), 
    url: yup.string().url().matches(urlRegex, 'Must be a url starting with https://'),
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

const validate = async (data) => {
  const file = JSON.parse(data)
  return schema.isValid(file)
}

const promisifiedReadDir = promisify(readdir)
const promisifiedReadFile = promisify(readFile)

async function main() {
  try {
    const files = await promisifiedReadDir('./dataset', { encoding: 'utf-8' })
    for (let file of files) {
      const fileData = await promisifiedReadFile(`./dataset/${file}`, { encoding: 'utf-8' })
      const isValid = await validate(fileData)
      console.log(`${isValid} - ${file}`)
    }
  } catch (err) {
    console.log(err)
  }
}
main()
