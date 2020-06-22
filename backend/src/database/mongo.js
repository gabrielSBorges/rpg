module.exports = {
  async count(params) {
    const { model, where } = params;

    try {
      const count = await model.countDocuments(where);

      return { status: "success", data: count };
    }
    catch (err) {
      return { status: "error", message: err };
    }
  },
  
  async list(params) {
    const { model, where , fields } = params;

    try {
      const data = await model.find(where).select(fields ? fields.join(" ") : "-iat -exp -__v");
  
      return { status: "success", data };
    }
    catch (err) {
      return { status: "error", message: err };
    }
  },

  async findOne(params) {
    const { model, where, fields } = params;

    try {
      const data = await model.findOne(where).select(fields ? fields.join(" ") : "-iat -exp -__v");
  
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
    const { model, where, body } = params;

    try {
      await model.findOneAndUpdate(where, body);

      return { status: "success" };
    }
    catch (err) {
      return { status: "error", message: err.message };
    }
  },

  async delete(params) {
    const { model, where } = params;

    try {
      await model.findOneAndDelete(where);

      return { status: "success" };
    }
    catch (err) {
      return { status: "error", message: err.message };
    }
  }
}

