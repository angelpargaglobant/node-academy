const http = require('http')

const requireListener = function (req, res) {
  res.writeHead(200)
  const { url } = req
  switch (true) {
    case url.includes('user'):
      res.write('user path')
      break
    case url.includes('product'):
      res.write('product path')
      break
    case url.includes('cart'):
      res.write('cart path')
      break
  }
  res.end()
}

const server = http.createServer(requireListener)
server.listen(8080)
