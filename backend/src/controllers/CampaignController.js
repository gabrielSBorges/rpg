const mongo = require('../database/mongo');
const Campaign = require('../models/Campaign');
const RecordSheet = require('../models/RecordSheet');
const User = require('../models/User');
const { isArray, isMongoId, MongoID, sameMongoId } = require('../utils/validate');

module.exports = {
  // Busca campanhas que o usuário participa como mestre
  async findCampaignsAsMaster(request, response) {
    const { userData } = request;

    let params = {
      model: Campaign,
      where: {
        'master.user_id': MongoID(userData.id)
      },
      fields: ["_id", "name"]
    };
    let listCampaigns = await mongo.list(params);

    if (listCampaigns.status !== 'success') {
      return response.status(500).json({ message: listCampaigns.message });
    }

    return response.json(listCampaigns.data);
  },
  
  // Busca campanhas que usuário participa como jogador
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

    return response.json(listCampaigns.data);
  },

  // Busca todas as campanhas que o usuário esteja associado
  async findMasterAndPlayerCampaigns(request, response) {
    const { userData } = request;

    let params = {
      model: Campaign,
      where: {
        'master.user_id': MongoID(userData.id)
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
      return response.status(400).json({ message: "Field 'name' cannot be empty" });
    }

    let params = {
      model: Campaign,
      body: {
        name,
        master: {
          user_id: MongoID(userData.id),
          name: userData.name,
          email: userData.email
        }
      }
    };
    let createCampaign = await mongo.create(params);

    if (createCampaign.status !== 'success') {
      return response.status(500).json({ message: createCampaign.message });
    }

    return response.json({ id: createCampaign.id, message: "Campaign successfully created" });
  },

  async update(request, response) {
    const { userData } = request;
    const { id } = request.params;
    const { name } = request.body;

    let params = {
      model: Campaign,
      where: { _id: MongoID(id) },
      fields: ["master"],
    };
    let findCampaign = await mongo.findOne(params);

    if (findCampaign.status !== 'success') {
      return response.status(500).json({ message: findCampaign.message });
    }

    let campaign = findCampaign.data;

    if (!campaign) {
      return response.status(400).json({ message: "Campaign not found" });
    }

    if (!sameMongoId(campaign.master.user_id, userData.id)) {
      return response.status(400).json({ message: "You can only update your own campaigns" });
    }

    params = {
      model: Campaign,
      where: { _id: MongoID(id) },
      body: {
        name
      }
    };
    let updateCampaign = await mongo.update(params);

    if (updateCampaign.status !== 'success') {
      return response.status(500).json({ message: updateCampaign.message });
    }

    return response.json({ message: "Campaign was successfully updated" });
  },

  async addPlayers(request, response) {
    const { userData } = request;
    const { id } = request.params;
    const { users } = request.body;
    
    // Verifica se a campanha existe e se o usuário é o mestre dela
    if (!isMongoId(id)) {
      return response.status(400).json({ message: `ID '${id.toString()}' is not a valid Mongo ID` });
    }

    let params = {
      model: Campaign,
      where: { _id: MongoID(id) },
      fields: ["master", "players"]
    };
    let campaign = await mongo.findOne(params);

    if (campaign.status !== "success") {
      return response.status(500).json({ message: campaign.message });
    }

    campaign = campaign.data;

    if (!campaign) {
      return response.status(400).json({ message: "Campaign not found" });
    }

    if (!sameMongoId(campaign.master.user_id, userData.id)) {
      return response.status(400).json({ message: "You can only add players to your own campaigns" });
    }

    // Verifica se os ids passados são válidos e os adiciona em um array
    if (!isArray(users)) {
      return response.status(400).json({ message: 'Field users must be an array with at least one user ID' });
    }

    let users_ids = [];

    params = {
      model: User,
      fields: ["_id"]
    };

    for (let user_id of users) {
      if (!isMongoId(user_id)) {
        return response.status(400).json({ message: `ID '${user_id.toString()}' is not a valid Mongo ID` });
      }
      
      params.where = { _id: MongoID(user_id) };
      let user = await mongo.findOne(params);

      if (user.status !== 'success') {
        return response.status(500).json({ message: user.message });
      }
      else {
        user = user.data

        if (!user) {
          return response.status(400).json({ message: `User '${user_id}' not found` })
        }

        users_ids.push(user._id);
      }
    }

    // Verifica se o usuário já está no array de players, se não estiver ele é adicionado
    let players_ids = [];

    for (let player of campaign.players) {
      players_ids.push(player.user_id.toString()); 
    }

    for (let user_id of users_ids) {
      if (!players_ids.includes(user_id.toString())) {
        campaign.players.push({ user_id: MongoID(user_id) });
      }
    }

    params = {
      model: Campaign,
      where: { _id: MongoID(id) },
      body: {
        players: campaign.players
      }
    };
    let addPlayer = await mongo.update(params);

    if (addPlayer.status !== 'success') {
      return response.status(500).json({ message: addPlayer.message });
    }

    return response.json({ message: "Players list was successfully updated" });
  },

  async setRecordSheet(request, response) {
    const { userData } = request;
    const { id } = request.params;
    const { record_sheet_id } = request.body;
    
    // Verifica se a campanha existe e se o usuário é o mestre dela
    if (!isMongoId(id)) {
      return response.status(400).json({ message: `ID '${id.toString()}' is not a valid Mongo ID` });
    }

    let params = {
      model: Campaign,
      where: { _id: MongoID(id) },
      fields: ["master"]
    };
    let campaign = await mongo.findOne(params);

    if (campaign.status !== "success") {
      return response.status(500).json({ message: campaign.message });
    }

    campaign = campaign.data;

    if (!campaign) {
      return response.status(400).json({ message: "Campaign not found" });
    }

    if (!sameMongoId(campaign.master.user_id, userData.id)) {
      return response.status(400).json({ message: "You can only set record sheets for your own campaigns" });
    }

    // Verfica se a ficha existe
    if (!isMongoId(record_sheet_id)) {
      return response.status(400).json({ message: `ID '${record_sheet_id.toString()}' is not a valid Mongo ID` });
    }

    params = {
      model: RecordSheet,
      where: { _id: MongoID(record_sheet_id)}
    };
    let countRecordSheets = await mongo.count(params);

    if (countRecordSheets.status !== "success") {
      return response.status(500).json({ message: countRecordSheets.message });
    }

    if (countRecordSheets.data === 0) {
      return response.status(400).json({ message: `Record Sheet '${record_sheet_id}' not found` })
    }

    // Salva o id da ficha no registro da campanha:
    params = {
      model: Campaign,
      where: { _id: MongoID(id) },
      body: {
        record_sheet_id: MongoID(record_sheet_id)
      }
    };
    let setRecordSheet = await mongo.update(params);

    if (setRecordSheet.status !== 'success') {
      return response.status(500).json({ message: setRecordSheet.message });
    }

    return response.json({ message: "Campaign's record sheet was successfully updated" });
  },

  async delete(request, response) {
    const { userData } = request;
    const { id } = request.params;

    let params = {
      model: Campaign,
      where: { _id: Mongo(id) },
      fields: ["_id", "master"]
    };
    let campaign = await mongo.findOne(params);

    if (campaign.status !== "success") {
      return response.status(500).json({ message: campaign.message});
    }

    campaign = campaign.data;

    if (!campaign) {
      return response.status(400).json({ message: "Campaign not found" });
    }

    if (!sameMongoId(campaign.master.user_id, userData.id)) {
      return response.status(400).json({ message: "You can only delete your own campaigns" });
    }
    
    params = {
      model: Campaign,
      where: { _id: MongoID(id) }
    };
    let deleteCampaign = await mongo.delete(params);

    if (deleteCampaign.status !== "success") {
      return response.status(500).json({ message: deleteCampaign.message });
    }

    return response.json({ message: "Campaign was successfully deleted" });
  },
}