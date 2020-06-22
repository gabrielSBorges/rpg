const mongo = require('../database/mongo');
const RecordSheet = require('../models/RecordSheet');
const { isArray, isObject, isBool, MongoID, sameMongoId } = require('../utils/validate');

function validateHeader(header) {
  if (!header) {
    return { status: "error", message: `Field 'header' is required and must have at least one item` };
  }
  else if (!isArray(header)) {
    return { status: "error", message: `Field 'header' must be an array` };
  }
  else {
    for (let i in header) {
      if (!isObject(header[i])) {
        return { status: "error", message: `Item ${parseInt(i) + 1} from 'header' must be an object` };
      }
      else {
        let validate = validateFields(header[i]);

        if (validate.status !== "success") {
          return { status: "error", message: `[Item ${parseInt(i) + 1} from 'header']: ${validate.message}` };
        }
      }
    }
  }

  return { status: "success" };
}

function validateSections(sections) {
  if (!sections) {
    return { status: "error", message: `Field 'sections' is required and must have at least one item` };
  }
  else if (!isArray(sections)) {
    return { status: "error", message: `Field 'sections' must be an array` };
  }
  else {
    for (let i in sections) {
      let { name, show_name, fields } = sections[i];

      if (name === undefined) {
        return { status: "error", message: `[Item ${parseInt(i) + 1} from 'sections']: Field 'name' is required` };
      }

      if (!isBool(show_name)) {
        return { status: "error", message: `[Item ${parseInt(i) + 1} from 'sections']: Field 'show_name' must be a boolean.` };
      }

      if (!fields) {
        return { status: "error", message: `Field 'fields' is required and must have at least one item` };
      }
      if (!isArray(fields)) {
        return { status: "error", message: `Field 'fields' from 'sections' must be an array` };
      }
      else {
        for (let f in fields) {
          let validate = validateFields(fields[f], false);

          if (validate.status !== "success") {
            return { status: "error", message: `[Item ${parseInt(i) + 1} from 'sections'][Item ${parseInt(f) + 1} from 'fields']: ${validate.message}` };
          }
        }
      }
    }
  }

  return { status: "success" };
}

function validateLists(lists) {
  if (!lists) {
    return { status: "error", message: `Field 'lists' is required and must have at least one item` };
  }
  else if (!isArray(lists)) {
    return { status: "error", message: `Field 'lists' must be an array` };
  }
  else {
    for (let i in lists) {
      let { name, show_name, columns } = lists[i];

      if (name === undefined) {
        return { status: "error", message: `[Item ${parseInt(i) + 1} from 'lists']: Field 'name' is required` };
      }

      if (!columns) {
        return { status: "error", message: `[Item ${parseInt(i) + 1} from 'lists']: Field 'columns' is required and must have at least one item` };
      }
      if (!isArray(columns)) {
        return { status: "error", message: `[Item ${parseInt(i) + 1} from 'lists']: Field 'columns' from 'lists' must be an array` };
      }
      else {
        for (let c in columns) {
          if (!columns[c].name) {
            return { status: "error", message: `[Item ${parseInt(i) + 1} from 'lists'][Item ${parseInt(c) + 1} from 'columns']: Field 'name' is required.` };
          }

          if (!columns[c].type) {
            return { status: "error", message: `[Item ${parseInt(i) + 1} from 'lists'][Item ${parseInt(c) + 1} from 'columns']: Field 'type' is required.` };
          }
          else {
            let validTypes = ["string", "int"];

            if (!validTypes.includes(columns[c].type)) {
              return { status: "error", message: `[Item ${parseInt(i) + 1} from 'lists'][Item ${parseInt(c) + 1} from 'columns']: Type '${columns[c].type}' is invalid. Valid types: ${validTypes.join(", ")}` };
            }
          }
          
          if (columns[c].show_name == null && columns[c].show_name == undefined) {
            return { status: "error", message: `[Item ${parseInt(i) + 1} from 'lists'][Item ${parseInt(c) + 1} from 'columns']: Field 'show_name' is required.` };
          }

          if (!isBool(columns[c].show_name)) {
            return { status: "error", message: `[Item ${parseInt(i) + 1} from 'lists'][Item ${parseInt(c) + 1} from 'columns']: Field 'show_name' must be a boolean.` };
          }
        }
      }
    }
  }

  return { status: "success" };
}

function validateFields(fields) {
  const { type, name, description } = fields;

  const validTypes = ["string", "int", "float"];

  if (!validTypes.includes(type)) {
    return { status: "error", message: `Type '${type}' is invalid. Valid types: ${validTypes.join(", ")}` };
  }

  if (!name) {
    return { status: "error", message: `Field 'name' cannot be empty` };
  }

  if (!description) {
    return { status: "error", message: `Field 'description' cannot be empty` };
  }

  return { status: "success" }
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
    const { name, header, sections, lists, public } = request.body;
    
    // Validar nome
    if (!name) {
      return response.status(400).json({ message: `Name cannot be empty` });
    }

    let validate;

    // Validar header
    validate = validateHeader(header);
    if (validate.status !== 'success') {
      return response.status(400).json({ message: validate.message });
    }

    // Validar sections
    validate = validateSections(sections);
    if (validate.status !== 'success') {
      return response.status(400).json({ message: validate.message });
    }
    
    // Validar lists
    validate = validateLists(lists);
    if (validate.status !== 'success') {
      return response.status(400).json({ message: validate.message });
    }

    // Validar public
    if (!isBool(public)) {
      return response.status(400).json({ message: `Field 'public' must be a boolean` });
    }

    // Adicionar id do usuário no user_id
    let params = {
      model: RecordSheet,
      body: {
        name, 
        header, 
        sections,
        lists,
        public,
        user_id: MongoID(userData.id)
      }
    };
    let createRecordSheet = await mongo.create(params);

    if (createRecordSheet.status !== 'success') {
      return response.status(500).json({ message: createRecordSheet.message })
    }
    
    return response.json({ id: createRecordSheet.id, message: 'Record sheet successfully created'});
  },

  async update(request, response) {
    const { userData } = request;
    const { id } = request.params;
    const { name, header, sections, lists, public } = request.body;
    
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
      return response.status(400).json({ message: "Record sheet not found" })
    }

    // Verificar se a ficha é do usuário
    if (!sameMongoId(recordSheet.user_id, userData.id)) {
      return response.status(400).json({ message: "You can only update your own record sheets" });
    }

    // Validar nome
    if (!name) {
      return response.status(400).json({ message: `Name cannot be empty` });
    }

    let validate;

    // Validar header
    validate = validateHeader(header);
    if (validate.status !== 'success') {
      return response.status(400).json({ message: validate.message });
    }

    // Validar sections
    validate = validateSections(sections);
    if (validate.status !== 'success') {
      return response.status(400).json({ message: validate.message });
    }
    
    // Validar lists
    validate = validateLists(lists);
    if (validate.status !== 'success') {
      return response.status(400).json({ message: validate.message });
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
        header, 
        sections,
        lists,
        public
      }
    };
    let updateRecordSheet = await mongo.update(params);

    if (updateRecordSheet.status !== 'success') {
      return response.status(500).json({ message: updateRecordSheet.message })
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