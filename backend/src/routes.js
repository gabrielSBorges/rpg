const { Router } = require('express');
const UserController = require('./controllers/UserController');
const auth = require('./middleware/auth');

const routes = Router();

// Users
routes.post('/login', UserController.login);
routes.post('/signup', UserController.signup);
routes.put('/user/update/:id', auth, UserController.update);
routes.put('/user/update-password/:id', auth, UserController.updatePassword);
routes.delete('/user/delete/:id', auth, UserController.delete);
routes.get('/user/list', auth, UserController.list);
routes.get('/user/find/:id', auth, UserController.findById);

module.exports = routes