const { Router } = require('express')
const UserController = require('./controllers/UserController')

const routes = Router()

// Users
routes.get('/users', UserController.list)
routes.get('/users/:id', UserController.findById)
routes.post('/users', UserController.store)
routes.put('/users/:id', UserController.update)
routes.put('/update-password/:id', UserController.updatePassword)
routes.delete('/users/:id', UserController.delete)

module.exports = routes