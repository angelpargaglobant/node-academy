const urlUtil = require('url')
const dbReader = require('./reader')

const serverHandler = async (db) => (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.writeHead(200)
  const { url } = req
  const queryString = urlUtil.parse(req.url, true).query
  switch (true) {
    case url === '/articles':
      res.write(JSON.stringify(db))
      break
    case url.startsWith('/articles?'):
      let { id } = urlUtil.parse(req.url, true).query
      if (typeof id === 'string') {
        try {
          const result = JSON.stringify(db.find((item) => item.id === id))
          res.write(result)
        } catch (err) {
          console.log(err)
          res.statusCode = 404
          res.write(`${res.statusCode}`)
        }
      } else {
        res.statusCode = 400
        res.write(`bad request: ${res.statusCode}`)
      }
      break
      default:
        res.statusCode = 404
        res.write(`not found: ${res.statusCode}`)

  }
  res.end()
}

module.exports = serverHandler
