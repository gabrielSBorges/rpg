const { Router } = require('express');
const UserController = require('./controllers/UserController');
const CampaignController = require('./controllers/CampaignController');
const auth = require('./middleware/auth');

const routes = Router();

// Users
routes.post('/login', UserController.login);
routes.post('/signup', UserController.signup);
routes.put('/users', auth, UserController.update);
routes.put('/update-password', auth, UserController.updatePassword);
routes.delete('/users', auth, UserController.delete);
routes.get('/users/list', auth, UserController.list);
routes.get('/users/:id', auth, UserController.findById);

// Campaigns
routes.post('/campaigns', auth, CampaignController.create);
routes.put('/campaigns/:id', auth, CampaignController.update);
routes.put('/campaigns/add-players/:id', auth, CampaignController.addPlayers);
routes.get('/campaigns/master-player', auth, CampaignController.findMasterAndPlayerCampaigns);
routes.get('/campaigns/master', auth, CampaignController.findCampaignsAsMaster);
routes.get('/campaigns/player', auth, CampaignController.findCampaignsAsPlayer);
routes.delete('/campaigns/:id', auth, CampaignController.delete);

// Characters

module.exports = routes;