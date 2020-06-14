const User = require('../models/User')

module.exports = {
    async index(request, response) {
      const users = await User.find()

      return response.json(users)
    },

    async store(request, response) {
      const { name, email, login, password } = request.body

      let user = await User.findOne({ email })

      if (!user) {
        user = await User.create({
          name,
          email,
          login,
          password,
        })
      }

      return response.json(user)
    },
}