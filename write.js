const { readdir, readFile } = require('fs')
const fs = require('fs')
const { validate } = require('./read')

const { promisify } = require('util')
const promisifiedReadFile = promisify(readFile)
const promisifiedReadDir = promisify(readdir)

async function main() {
  try {
    const files = await promisifiedReadDir('./dataset', { encoding: 'utf-8' })
    const articles = []
    for (let file of files) {
      const fileData = await promisifiedReadFile(`./dataset/${file}`, { encoding: 'utf-8' })
      const isValid = await validate(fileData)
      !isValid && console.log(`${isValid} - ${file}`)

      isValid && articles.push(JSON.parse(fileData))
    }
    fs.writeFile('message.json', JSON.stringify(articles), 'utf8', (err, data) => {
      if (err) {
        console.log(err)
      }
      if (data) {
        console.log(data)
      }
    })
  } catch (err) {
    console.log(err)
  }
}
main()
