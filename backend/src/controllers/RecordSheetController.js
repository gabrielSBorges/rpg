const mongo = require('../database/mongo');
const RecordSheet = require('../models/RecordSheet');
const { isArray, isObject, isEmpty, isBool, MongoID, sameMongoId } = require('../utils/validate');

function validateValues(object, type) {
  const { data_type, name, description, show_name } = object;
  
  // Validar data_type (int, float, string)
  let validDataTypes = ['int', 'float', 'string']
  if (!validDataTypes.includes(data_type)) {
    return { status: 'error', message: `Invalid value for field 'data_type'. Valid values: ${validDataTypes.join(', ')}` };
  }
  
  // Validar name
  if (isEmpty(name)) {
    return { status: 'error', message: "Field 'name' cannot be empty" };
  }

  // Validar show_name (true, false)
  if (!isBool(show_name)) {
    return { status: 'error', message: "Field 'show_name' must be boolean" };
  }
  
  // Validar description
  if (type == 'form') {
    if (isEmpty(description)) {
      return { status: 'error', message: "Field 'descrition' cannot be empty" };
    }
  }

  return { status: 'success' };
}

module.exports = {
  async getMyRecordSheets(request, response) {
    const { userData } = request;

    let params = {
      model: RecordSheet,
      where: {
        user_id: MongoID(userData.id)
      }
    };
    const findRecordSheets = await mongo.list(params);

    if (findRecordSheets.status !== 'success') {
      return response.status(500).json({ message: findRecordSheets.message });
    }

    return response.json(findRecordSheets.data);
  },

  async getPublicRecordSheets(request, response) {
    let params = {
      model: RecordSheet,
      where: { 
        public: true 
      }
    };
    const findRecordSheets = await mongo.list(params);

    if (findRecordSheets.status !== 'success') {
      return response.status(500).json({ message: findRecordSheets.message });
    }

    return response.json(findRecordSheets.data);
  },

  async create(request, response) {
    const { userData } = request;
    const { name, sections, public } = request.body;
    
    // Validar nome
    if (!name) {
      return response.status(400).json({ message: `Field 'name' cannot be empty` });
    }

    // Validar sections
    if (!isArray(sections)) {
      return response.status(400).json({ message: `Field 'sections' must be an array` });
    }

    if (isEmpty(sections)) {
      return response.status(400).json({ message: `Field 'sections' cannot be empty` });
    }

    // Para cada section
    for (let s in sections) {
      // Validar name
      if (!sections[s].name) {
        return response.status(400).json({ message: `[Item ${s} in sections] Field 'name' cannot be empty` });
      }

      // Validar type (form, list)
      validTypes = ["form", "list"];
      if (!validTypes.includes(sections[s].type)) {
        return response.status(400).json({ message: `[Item ${s} in sections] Invalid value for field 'type'. Valid values: ${validTypes.join(", ")}` });
      }

      // Validar show_name (true, false)
      if (!isBool(sections[s].show_name)) {
        return response.status(400).json({ message: `[Item ${s} in sections] Field 'show_name' must be boolean` });
      }

      // Se type == form
      if (sections[s].type == 'form') {
        // Para cada field:
        for (let f in sections[s].fields) {
          let field = sections[s].fields[f];

          let validate = validateValues(field, 'form');

          if (validate.status !== 'success') {
            return response.status(400).json(`[Item ${s} in sections][Item ${f} in fields] ${validate.message}`);
          }
        }
      }
      
      // Se type == list
      if (sections[s].type == "list") {
        // Para cada column:
        for (let c in sections[s].columns) {
          let column = sections[s].columns[c];
          
          let validate = validateValues(column, 'list');

          if (validate.status !== 'success') {
            return response.status(400).json(`[Item ${s} in sections][Item ${c} in columns] ${validate.message}`);
          }
        }  
      }
    }

    // Validar public
    if (!isBool(public)) {
      return response.status(400).json({ message: `Field 'public' must be boolean` });
    }

    // Adicionar id do usuário no user_id
    let params = {
      model: RecordSheet,
      body: {
        name,
        sections,
        public,
        user_id: MongoID(userData.id)
      }
    };
    let createRecordSheet = await mongo.create(params);

    if (createRecordSheet.status !== 'success') {
      return response.status(500).json({ message: createRecordSheet.message });
    }
    
    return response.json({ id: createRecordSheet.id, message: 'Record sheet successfully created'});
  },

  async update(request, response) {
    const { userData } = request;
    const { id } = request.params;
    const { name, sections, public } = request.body;
    
    // Verificar se a ficha existe
    let params = {
      model: RecordSheet,
      where: { _id: MongoID(id) },
      fields: ["user_id"]
    };
    let recordSheet = await mongo.findOne(params);

    if (recordSheet.status !== "success") {
      return response.status(500).json({ message: recordSheet.message });
    }

    recordSheet = recordSheet.data;

    if (!recordSheet) {
      return response.status(400).json({ message: "Record sheet not found" });
    }

    // Verificar se a ficha é do usuário
    if (!sameMongoId(recordSheet.user_id, userData.id)) {
      return response.status(400).json({ message: "You can only update your own record sheets" });
    }

    // Validar nome
    if (!name) {
      return response.status(400).json({ message: `Name cannot be empty` });
    }

    // Para cada section
    for (let s in sections) {
      // Validar name
      if (!sections[s].name) {
        return response.status(400).json({ message: `[Item ${s + 1} in sections] Field 'name' cannot be empty` });
      }

      // Validar type (form, list)
      validTypes = ["form", "list"];
      if (!validTypes.includes(sections[s].type)) {
        return response.status(400).json({ message: `[Item ${s + 1} in sections] Invalid value for field 'type'. Valid values: ${validTypes.join(", ")}` });
      }

      // Validar show_name (true, false)
      if (!isBool(sections[s].show_name)) {
        return response.status(400).json({ message: `[Item ${s + 1} in sections] Field 'show_name' must be boolean` });
      }

      // Se type == form
      if (sections[s].type == 'form') {
        // Para cada field:
        for (let f in sections[s].fields) {
          let field = sections[s].fields[f];

          let validate = validateValues(field, 'form')

          if (validate.status !== 'success') {
            return response.status(400).json(`[Item ${s + 1} in sections][Item ${f + 1} in fields] ${validate.message}`);
          }
        }
      }
      
      // Se type == list
      if (sections[s].type == "list") {
        // Para cada column:
        for (let c in sections[s].columns) {
          let column = sections[s].columns[c]
          
          let validate = validateValues(column, 'list')

          if (validate.status !== 'success') {
            return response.status(400).json(`[Item ${s + 1} in sections][Item ${c + 1} in columns] ${validate.message}`);
          }
        }  
      }
    }

    // Validar public
    if (!isBool(public)) {
      return response.status(400).json({ message: `Field 'public' must be a boolean` });
    }

    params = {
      model: RecordSheet,
      where: { _id: MongoID(id) },
      body: {
        name,
        sections,
        public
      }
    };
    let updateRecordSheet = await mongo.update(params);

    if (updateRecordSheet.status !== 'success') {
      return response.status(500).json({ message: updateRecordSheet.message });
    }
    
    return response.json({ id: updateRecordSheet.id, message: 'Record sheet successfully updated'});
  },

  async delete(request, response) {
    const { userData } = request;
    const { id } = request.params;

    let params = {
      model: RecordSheet,
      where: { _id: MongoID(id) },
      fields: ["user_id"]
    };
    let recordSheet = await mongo.findOne(params);

    if (recordSheet.status !== "success") {
      return response.status(500).json({ message: recordSheet.message});
    }

    recordSheet = recordSheet.data;

    if (!recordSheet) {
      return response.status(400).json({ message: "Record sheet not found" });
    }

    if (!sameMongoId(recordSheet.user_id, userData.id)) {
      return response.status(400).json({ message: "You can only delete your own record sheets" });
    }
    
    params = {
      model: RecordSheet,
      where: { _id: MongoID(id) }
    };
    let deleteRecordSheet = await mongo.delete(params);

    if (deleteRecordSheet.status !== "success") {
      return response.status(500).json({ message: deleteRecordSheet.message });
    }

    return response.json({ message: "Record sheet was successfully deleted" });
  },
}