const mongo = require('../database/mongo');
const Campaign = require('../models/Campaign');
const User = require('../models/User');
const { isArray, isMongoId, MongoID } = require('../utils/validate');

module.exports = {
  async findCampaignsAsMaster(request, response) {
    const { userData } = request;

    let params = {
      model: Campaign,
      where: {
        master_id: MongoID(userData.id)
      },
      fields: ["_id", "name"]
    };
    let listCampaigns = await mongo.list(params);

    if (listCampaigns.status !== 'success') {
      return response.status(500).json({ message: listCampaigns.message });
    }
    else {
      return response.json(listCampaigns.data);
    }
  },
  
  async findCampaignsAsPlayer(request, response) {
    const { userData } = request;

    let params = {
      model: Campaign,
      where: {
        'players.user_id': MongoID(userData.id)
      },
      fields: ["_id", "name"]
    };
    let listCampaigns = await mongo.list(params);

    if (listCampaigns.status !== 'success') {
      return response.status(500).json({ message: listCampaigns.message });
    }
    else {
      return response.json(listCampaigns.data);
    }
  },

  async findMasterAndPlayerCampaigns(request, response) {
    const { userData } = request;

    let params = {
      model: Campaign,
      where: {
        master_id: MongoID(userData.id)
      },
      fields: ["_id", "name"]
    };
    let listMasterCampaigns = await mongo.list(params);

    if (listMasterCampaigns.status !== 'success') {
      return response.status(500).json({ message: listMasterCampaigns.message });
    }

    params = {
      model: Campaign,
      where: {
        'players.user_id': MongoID(userData.id)
      },
      fields: ["_id", "name"]
    };
    let listPlayerCampaigns = await mongo.list(params);

    if (listPlayerCampaigns.status !== 'success') {
      return response.status(500).json({ message: listPlayerCampaigns.message });
    }

    let masterCampaigns = listMasterCampaigns.data;
    let playerCampaigns = listPlayerCampaigns.data;

    return response.json({ master: masterCampaigns, player: playerCampaigns });
  },

  async create(request, response) {
    const { userData } = request;
    const { name } = request.body;

    if (!name) {
      return response.status(400).json({ message: "Field 'name' can't be empty" });
    }

    let params = {
      model: Campaign,
      body: {
        name,
        master_id: MongoID(userData.id),
        masterData: {
          name: userData.name,
          email: userData.email
        }
      }
    };
    let createCampaign = await mongo.create(params);

    if (createCampaign.status !== 'success') {
      return response.status(500).json({ message: createCampaign.message });
    }
    else {
      return response.json({ id: createCampaign.id, message: "Campaign was successfully created" });
    }
  },

  async update(request, response) {
    const { id } = request.params;
    const { name } = request.body;

    let params = {
      model: Campaign,
      where: { _id: id },
    };
    let findCampaign = await mongo.findOne(params);

    if (findCampaign.status !== 'success') {
      return response.status(500).json({ message: findCampaign.message });
    }
    else {
      params = {
        model: Campaign,
        where: { _id: id },
        body: {
          name
        }
      };
      let updateCampaign = await mongo.update(params);

      if (updateCampaign.status !== 'success') {
        return response.status(500).json({ message: updateCampaign.message });
      }
      else {
        return response.json({ message: "Campaign was successfully updated" });
      }
    }
  },

  async addPlayer(request, response) {
    const { id } = request.params;
    const { users } = request.body;
    
    if (!isArray(users)) {
      return response.status(400).json({ message: 'Field users must be an array with at least one user ID' });
    }

    let users_ids = [];

    let params = {
      model: User,
      fields: ["_id"]
    };

    for (let id of users) {
      if (!isMongoId(id)) {
        return response.status(400).json({ message: `ID '${id.toString()}' is not a valid Mongo ID` });
      }
      
      params.where = { _id: id };
      let user = await mongo.findOne(params);

      if (user.status !== 'success') {
        return response.status(500).json({ message: user.message });
      }
      else {
        let user_id = user.data._id;

        users_ids.push(user_id);
      }
    }

    params = {
      model: Campaign,
      where: { _id: id },
      fields: ["players"]
    };
    let campaign = await mongo.findOne(params);

    if (campaign.status !== "success") {
      return response.status(500).json({ message: campaign.message });
    }
    else {
      campaign = campaign.data;

      let players_ids = [];

      for (let player of campaign.players) {
        players_ids.push(player.user_id.toString()); 
      }

      for (let user_id of users_ids) {
        if (!players_ids.includes(user_id.toString())) {
          campaign.players.push({ user_id });
        }
      }

      params = {
        model: Campaign,
        where: { _id: id },
        body: {
          players: campaign.players
        }
      };
      let addPlayer = await mongo.update(params);

      if (addPlayer.status !== 'success') {
        return response.status(500).json({ message: addPlayer.message });
      }
      else {
        return response.json({ message: "Players list was successfully updated" });
      }
    }
  },

  async delete(request, response) {
    const { id } = request.params;

    let params = {
      model: Campaign,
      where: { _id: id },
      fields: ["_id"]
    };
    let findCampaign = await mongo.findOne(params);

    if (findCampaign.status !== "success") {
      return response.status(500).json({ message: findCampaign.message});
    }
    else {
      params = {
        model: Campaign,
        where: { _id: id }
      };
      let deleteCampaign = await mongo.delete(params);

      if (deleteCampaign.status !== "success") {
        return response.status(500).json({ message: deleteCampaign.message });
      }
      else {
        return response.json({ message: "Campaign was successfully deleted" });
      }
    }
  },
}