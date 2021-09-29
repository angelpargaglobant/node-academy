const dbReader = require('./reader')
const http = require('http')

const serverHandler = require('./serverHandler.js')

const main = async () => {
  try {
    let db = await dbReader('./db.json')
    let parsedDb = JSON.parse(db)
    let handler = await serverHandler(parsedDb)
    const server = http.createServer(handler)
    server.listen(8080, () => console.log('Server is running on port 8080'))
  } catch (err) {
    console.log(err)
  }
}
main()