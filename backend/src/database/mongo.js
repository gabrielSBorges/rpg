module.exports = {
  async list(params) {
    const { model, fields } = params;
    
    try {
      const data = await model.find().select(fields.join(" ") || "");
  
      return { status: "success", data };
    }
    catch (err) {
      return { status: "error", message: err };
    }
  },

  async findOne(params) {
    const { model, where, fields } = params;

    try {
      const data = await model.findOne(where).select(fields.join(" ") || "");
  
      return { status: "success", data };
    }
    catch (err) {
      return { status: "error", message: err.message };
    }
  },

  async create(params) {
    const { model, body } = params;

    try {
      const data = await model.create(body);

      return { status: "success", id: data._id };
    }
    catch (err) {
      return { status: "error", message: err.message };
    }
  },

  async update(params) {
    const { model, filter, body } = params;

    try {
      await model.findOneAndUpdate(filter, body);

      return { status: "success" };
    }
    catch (err) {
      return { status: "error", message: err.message };
    }
  },

  async delete(params) {
    const { model, filter } = params;

    try {
      await model.findOneAndDelete(filter);

      return { status: "success" };
    }
    catch (err) {
      return { status: "error", message: err.message };
    }
  }
}

