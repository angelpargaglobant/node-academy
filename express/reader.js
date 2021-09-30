const { readFile } = require('fs')
const { promisify } = require('util')

const promisifiedReadFile = promisify(readFile)

const reader = async (path) => {
  const db = await promisifiedReadFile(path, { encoding: 'utf-8' })
  return JSON.parse(db)
}

module.exports = {reader}