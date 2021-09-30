const { Router } = require('express')
const { v4: uuidv4 } = require('uuid')
const { reader } = require('../reader')
const { writeFile } = require('../write')
const { validate } = require('../validate')

// const data = require('../mock/db.json')

const articlesRouter = Router()


articlesRouter.get('/', async (req, res) => {
  const data = await reader('./express/mock/db.json')
  res.status(200).json(data)
})

articlesRouter.get('/:id', async (req, res) => {
  const data = await reader('./express/mock/db.json')
  const { id } = req.params
  const founded = data.find((item) => item.id === id)
  if (!founded) {
    res.status(400).send('not found')
    return
  }
  res.status(200).send(founded)
  return
})

articlesRouter.post('/publish', async (req, res)=>{
  const {title, url, keywords, readMins, source} = req.body
  console.log(title)
  if(!title){
    res.status(400).send('title is missing')
    return
  }
  if(!url){
    res.status(400).send('url is missing')
    return
  }
  if(!keywords){
    res.status(400).send('keywords is missing')
    return
  }
  if(!readMins){
    res.status(400).send('readMins is missing')
    return
  }
  if(!source){
    res.status(400).send('source is missing')
    return
  }
  const isValid = await validate(req.body)
  if(!isValid){
    res.status(400).send('bad request')
    return
  }
  const newArticle = {
    ...req.body,
    id:uuidv4(),
    publishedAt:Date.now(),
    modifiedAt:Date.now()
  }
  try{

    writeFile(newArticle)
    res.status(201).send(newArticle)
  }catch(err){
    res.status(500).send(`internal server error: ${err}`)
  }
})

module.exports = articlesRouter
