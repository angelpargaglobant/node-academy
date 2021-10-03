const { Router } = require('express')
const { v4: uuidv4 } = require('uuid')
const { reader } = require('../reader')
const { writeFile, updateArticle } = require('../write')
const { validate } = require('../validate')

// const data = require('../mock/db.json')

const articlesRouter = Router()

const findArticle = async (id) => {
  const data = await reader('./express/mock/db.json')
  const founded = data.find((item) => item.id === id)
  return founded
}

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

articlesRouter.post('/publish', async (req, res) => {
  const { title, url, keywords, readMins, source } = req.body
  console.log(title)
  if (!title) {
    res.status(400).send('title is missing')
    return
  }
  if (!url) {
    res.status(400).send('url is missing')
    return
  }
  if (!keywords) {
    res.status(400).send('keywords is missing')
    return
  }
  if (!readMins) {
    res.status(400).send('readMins is missing')
    return
  }
  if (!source) {
    res.status(400).send('source is missing')
    return
  }
  let newArticle = {
    ...req.body,
    id: uuidv4(),
  }
  const isValid = await validate(newArticle)
  if (!isValid) {
    res.status(400).send('bad request')
    return
  }
  try {
    newArticle = {
      ...newArticle,
      publishedAt: Date.now(),
      modifiedAt: Date.now(),
    }
    writeFile(newArticle)
    res.status(201).send(newArticle)
  } catch (err) {
    res.status(500).send(`internal server error: ${err}`)
  }
})

articlesRouter.patch('/publish/:id', async (req, res) => {
  const { id } = req.params
  if (!id) {
    res.status(400).send('bad request "id" is missing')
  }
  const data = await reader('./express/mock/db.json')
  const article = data.find((item) => item.id === id)

  if (!article) {
    res.status(400).send('article doesnt exist')
    return
  }

  const articles = data.map((item) => (item.id === id ? { ...article, ...req.body, modifiedAt: Date.now() } : item))

  try {
    updateArticle(articles)
    res.status(201).send(articles)
  } catch (err) {
    res.status(500).send(`internal server error: ${err}`)
  }
})

articlesRouter.put('/publish/:id', async (req, res) => {
  const { id } = req.params
  if (!id) {
    res.status(400).send('bad request "id" is missing')
  }
  const data = await reader('./express/mock/db.json')
  const article = data.find((item) => item.id === id)

  if (!article) {
    let newArticle = { id, ...req.body }
    try {
      newArticle = {
        ...newArticle,
        publishedAt: Date.now(),
        modifiedAt: Date.now(),
      }
      writeFile(newArticle)
      res.status(201).send(newArticle)
    } catch (err) {
      res.status(500).send(`internal server error: ${err}`)
    }
  }

  const articles = data.map((item) => (item.id === id ? { ...article, ...req.body, modifiedAt: Date.now() } : item))

  try {
    updateArticle(articles)
    res.status(201).send(articles)
  } catch (err) {
    res.status(500).send(`internal server error: ${err}`)
  }
})

articlesRouter.delete('/publish/:id', async (req, res) => {
  const { id } = req.params
  if (!id) {
    res.status(400).send('bad request "id" is missing')
  }
  const data = await reader('./express/mock/db.json')
  const articles = data.filter((item) => item.id !== id)

  try {
    updateArticle(articles)
    res.status(201).send(articles)
  } catch (err) {
    res.status(500).send(`internal server error: ${err}`)
  }
})

module.exports = articlesRouter
