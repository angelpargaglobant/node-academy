const { schema } = require('./yupSchema')

const validate = async (file) => {
  return schema.isValid(file)
}

module.exports = { validate }
