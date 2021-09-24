const { schema } = require('./yupSchema')

const validate = async (data) => {
  const file = JSON.parse(data)
  return schema.isValid(file)
}

module.exports = { validate }
