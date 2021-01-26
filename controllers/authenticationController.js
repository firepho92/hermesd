const jwt = ('jsonwebtoken')

const signin = (req, res) => {
  const { user } = req.body
  const token = jwt.sign(user, 'kolegia', {
    expiresIn: 60 * 60 * 24
  })
  res.status(200).send(token)
}

module.exports = {
  signin
}