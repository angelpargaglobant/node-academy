const express = require("express")
const router = require("./router")

const app = express()

const authMiddleware = (req, res, next) => {
  if (!req.headers['authorization']) {
    res.status(401).send("not autorzed")
    return
  }
  next()
}
const performanceMiddleware = (req, res, next) => {
  console.time()
  next()
  console.timeEnd()
}

app.use(express.json())
app.use(performanceMiddleware)

app.use('/api/v1/articles', authMiddleware,router.articleRouter)

app.listen(8080, ()=>{
    console.log("app is running on 8080")
})