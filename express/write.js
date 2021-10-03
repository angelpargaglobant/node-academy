const { readFile } = require('fs')
const fs = require('fs')

const { promisify } = require('util')
const promisifiedReadFile = promisify(readFile)

async function writeFile(article) {
  try {
      const fileData = await promisifiedReadFile(`./express/mock/db.json`, { encoding: 'utf-8' })
      const articles = [...JSON.parse(fileData), article]
    fs.writeFile('./express/mock/db.json', JSON.stringify(articles), 'utf8', (err, data) => {
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
async function updateArticle(articles) {
  try {
    fs.writeFile('./express/mock/db.json', JSON.stringify(articles), 'utf8', (err, data) => {
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

module.exports = { writeFile, updateArticle }