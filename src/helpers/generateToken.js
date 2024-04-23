import jwt from 'jsonwebtoken'

const generateToken = (id) => {

  const token = jwt.sign({ id }, process.env.KEYSECRET || 'defaultSecret,', {
    expiresIn: '365d'
  })
  return token
}

export default generateToken