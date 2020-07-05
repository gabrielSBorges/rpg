const mongo = require('../database/mongo');
const { isEmpty, isString, isInteger, isFloat, MongoID } = require('../utils/validate');
const Character = require('../models/Character');
const Campaign = require('../models/Campaign');

function validateFieldValue(object) {
  const { data_type, name, required, value } = object;
  
  // Se for obrigatório
  if (required) {
    if (isEmpty(value)) {
      return { status: 'error', message: `Field '${name}' cannot be empty` };
    }
  }

  // Validar value
  switch (data_type) {
    case 'int':
      if (!isInteger(value) && !isEmpty(value)) {
        return { status: 'error', message: `Field '${name}' must be an integer` };
      }

      break;
    case 'float':
      if (!isFloat(value) && !isEmpty(value)) {
        return { status: 'error', message: `Field '${name}' must be a float` };
      }

      break;
    default:
      if (!isString(value) && !isEmpty(value)) {
        return { status: 'error', message: `Field '${name}' must be a string` };
      }

      break;
  }

  return { status: 'success' };
}

function validateColumnValues(column, value) {
  const { data_type } = column;

  if (isEmpty(value)) {
    return { status: 'error', message: `cannot be empty` };
  }

  switch (data_type) {
    case 'int':
      if (!isInteger(value)) {
        return { status: 'error', message: `must be an integer` };
      }

      break;
    case 'float':
      if (!isFloat(value)) {
        return { status: 'error', message: `must be a float` };
      }

      break;
    default:
      if (!isString(value)) {
        return { status: 'error', message: `must be a string` };
      }

      break;
  }
  
  return { status: 'success' };
}

module.exports = {
  async create(request, response) {
    const { userData } = request;
    const { sections, campaign_id } = request.body;

    // Validar campaign_id
    let params = {
      model: Campaign,
      where: { _id: MongoID(campaign_id)}
    };
    let findCampaign = await mongo.count(params)

    if (findCampaign.status !== "success") {
      return response.status(500).json({ message: findCampaign.message });
    }

    if (findCampaign.data === 0) {
      return response.status(400).json({ message: `Campaign '${campaign_id}' not found` })
    }

    // Verifica se o usuário faz parte dessa campanha
    params = {
      model: Campaign,
      where: {
        $or: [
          { 'master.user_id': MongoID(userData.id) },
          { 'players.user_id': MongoID(userData.id) }
        ]
      },
    };
    findCampaign = await mongo.count(params);

    if (findCampaign.status !== "success") {
      return response.status(500).json({ message: findCampaign.message });
    }

    if (findCampaign.data === 0) {
      return response.status(400).json({ message: `You must be a member of this campaing` })
    }

    // Para cada section
    for (let s in sections) {
      // Se type == form
      if (sections[s].type == 'form') {
        // Para cada field:
        for (let f in sections[s].fields) {
          let field = sections[s].fields[f];

          let validate = validateFieldValue(field);

          if (validate.status !== 'success') {
            return response.status(400).json({ message: `${validate.message}` });
          }
        }
      }
      
      // Se type == list
      if (sections[s].type == "list") {
        let values = sections[s].values;
        
        // Validar values
        if (!isEmpty(values)) {
          // Para cada value:
          for (let v in values) {
            for (let f in values[v]) {
              let fieldValue = values[v][f];
              let column = sections[s].columns[f];
              
              let validate = validateColumnValues(column, fieldValue);
  
              if (validate.status !== 'success') {
                return response.status(400).json({ message: `Field ${column.name} from list ${sections[s].name} ${validate.message}` });
              }
            }
          }  
        }
      }
    }

    params = {
      model: Character,
      body: {
        sections,
        campaign_id,
        user_id: MongoID(userData.user_id)
      }
    };
    let createCharacter = await mongo.create(params);

    if (createCharacter.status !== 'success') {
      return response.status(500).json({ message: createCharacter.message });
    }
    
    return response.json({ id: createCharacter.id, message: 'Character successfully created'});
  },
}