const { Router } = require('express')
const data = require('../mock/db.json')

const articlesRouter = Router()


articlesRouter.get('/', (req, res) => {
  res.status(200).json(data)
})

articlesRouter.get('/:id', (req, res) => {
  const { id } = req.params
  const founded = data.find((item) => item.id === id)
  if (!founded) {
    res.status(400).send('not found')
    return
  }
  res.status(200).send(founded)
  return
})

module.exports = articlesRouter
