const express = require("express")
const router = require("./router")

const app = express()

const loggerMiddleware = (req, res, next) => {
  console.log('los headers son: ',loggerMiddleware, req.headers)
  next()
}
app.use("/api/v1/articles", router.articleRouter)

app.listen(8080, ()=>{
    console.log("app is running on 8080")
})