const findArticle = () => {
  const data = await reader('./express/mock/db.json')
  const { id } = req.params
  const founded = data.find((item) => item.id === id)
  return founded
}
module.exports={findArticle}
