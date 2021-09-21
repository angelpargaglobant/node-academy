const { readdir, readFile } = require('fs')
const { promisify } = require('util')

const dateRegex = /^\d{2}[./]\d{2}[./]\d{4}$/
const urlRegex = /^https:\/\//
const SourcesEnum = {
  ARTICLE:'ARTICLE', BLOG:'BLOG', TWEET:'TWEET', NEWSPAPER:'NEWSPAPER'
}
const validator = (file) => {
  const isIdValid = () => {
    return file && typeof file['id'] === 'string' && file['id']?.length <= 36
  }
  const isTitleValid = () => {
    return file && typeof file['title'] === 'string' && file['title']?.length <= 255
  }
  const isAuthorValid = () => {
    return file && typeof file['author'] === 'string' && file['author']?.length <= 100
  }
  const isModifiedAtValid = () => {
    if (!file['modifiedAt'] || typeof file['modifiedAt'] === null || !dateRegex.test(file['modifiedAt'])) {
      return false
    }
    const dNow = new Date()
    const modAt = new Date(file['modifiedAt'])
    return modAt < dNow
  }
  const isPublishedAtValid = () => {
    if (!file['publishedAt']) {
      return true
    }
    if (!dateRegex.test(file['publishedAt'])) {
      return false
    }
    const dNow = new Date()
    const modAt = new Date(file['publishedAt'])
    return modAt < dNow
  }
  const isURLValid = () => {
    if (!file['url']) return !file['publishedAt']
    return urlRegex.test(file['url'])
  }
  const isKeyWordValid = () => {
    if (!file['keywords'] || file['keywords'].length === 0 || file['keywords'].length > 3) return false
    return file['keywords'].reduce((prev, next) => {
      return typeof next === 'string' ? prev : false
    }, true)
  }
  const isReadMinsValid = () => {
    if (!file['readMins'] || typeof file['readMins'] !== 'number') return false
    return file['readMins'] >= 1 && file['readMins'] <= 20
  }
  const isSourceValid = () => {
    // TODO: Validar los posibles valores ARTICLE, BLOG, TWEET, NEWSPAPER.
    if (!file['source']) return false
    return SourcesEnum[file['source']] ? true : false
  }
  const isFileValid = ()=>{
    return isIdValid() &&
    isTitleValid() &&
    isAuthorValid() &&
    isModifiedAtValid() &&
    isPublishedAtValid() &&
    isURLValid() &&
    isKeyWordValid() &&
    isReadMinsValid() &&
    isSourceValid()
  }
  return {
    isIdValid,
    isTitleValid,
    isAuthorValid,
    isModifiedAtValid,
    isPublishedAtValid,
    isURLValid,
    isKeyWordValid,
    isReadMinsValid,
    isSourceValid,
    isFileValid
  }
}
const temp = {
  id: 'string',
  title: 'string',
  url: 'string',
  keywords: 'array',
  modifiedAt: 'string',
  publishedAt: 'string',
  author: 'string',
  readMins: 'number',
  source: 'string',
}
const validate = async (data) => {
  const file = JSON.parse(data)
  const { isFileValid } = validator(file)
  return isFileValid()
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
