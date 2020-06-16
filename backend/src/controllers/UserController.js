const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongo = require('../database/mongo');
const User = require('../models/User');
const { validEmail, validPassword } = require('../utils/validate');

function validateFields(name, email, login, password) {
  if (name.length < 4) {
    return { status: "error", message: "Name must contain at least 5 characters" };
  }

  if (login.length < 5) {
    return { status: "error", message: "Login must contain at least 5 characters" };
  }

  if (!validEmail(email)) {
    return { status: "error", message: "Invalid email address" };
  }

  return { status: "success" };
}

module.exports = {
  async list(request, response) {
    let params = {
      model: User,
      fields: ["name", "email", "login"]
    };
    const findUsers = await mongo.list(params);

    if (findUsers.status !== "success") {
      return response.status(500).json({ message: findUsers.message });
    }
    else {
      return response.json(findUsers.data);
    }
  },

  async findById(request, response) {
    const { id } = request.params;

    let params = {
      model: User,
      where: { _id: id },
      fields: ["name", "email", "login"]
    };
    let findUser = await mongo.findOne(params);

    if (findUser.status !== "success") {
      return response.status(500).json({ message: findUser.message });
    }
    else {
      if (!findUser.data) {
        return response.status(400).json({ message: "User not found" });
      }
      
      return response.json(findUser.data);
    }
  },

  async signup(request, response) {
    const { name, email, login, password } = request.body;
    
    const validate = validateFields(name, email, login);

    if (validate.status !== "success") {
      return response.status(400).json({ message: validate.message });
    }

    if (!validPassword(password)) {
      return response.status(400).json({ message: "Password must contain at minimum 8 and maximum 15 characters and at least 1 special character, 1 number and 1 uppercase letter" });
    }

    let params = {
      model: User,
      where: { $or: [{email}, {login}] },
      fields: ["email", "login"]
    };
    let user = await mongo.findOne(params);

    if (user.status !== "success") {
      return response.status(500).json({ message: user.message });
    }
    else {
      user = user.data;
    }

    if (!user) {
      bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
          return response.status(500).json({ message: err });
        }
        else {
          let params = {
            model: User,
            body: {
              name,
              email,
              login,
              password: hash,
            }
          };
          
          let createUser = await mongo.create(params);
    
          if (createUser.status !== "success") {
            return response.status(500).json({ message: createUser.message });
          }
          else {
            return response.json({ id: createUser.data._id, message: "User successfully created" });
          }
        }
      })
    }
    else {
      let already_taken = email == user.email && login == user.login ? ["email", "login"] : email == user.email ? ["email"] : ["login"];
      
      return response.status(400).json({ message: "User already exists", already_taken });
    }
  },

  async login(request, response) {
    const { login, password, expires } = request.body;

    let params = {
      model: User,
      where: { login },
      fields: ["name", "email", "login", "password"]
    };
    let user = await mongo.findOne(params);

    if (user.status !== "success") {
      return response.status(500).json({ message: user.message });
    }
    else {
      user = user.data;
  
      if (!user) {
        return response.status(401).json({ message: "Auth failed" });
      }

      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          const token = jwt.sign(
            {
              id: user._id,
              name: user.name,
              login: user.login,
              email: user.email
            },
            process.env.JWT_KEY,
            {
              expiresIn: expires
            }
          );

          return response.json({ message: "Auth successful", token });
        }
        else {
          return response.status(401).json({ message: "Auth failed" });
        }
      });
    }
    
  },

  async update(request, response) {
    const { id } = request.params;

    let params = {
      model: User,
      where: { _id: id },
      fields: ["name", "email", "login"]
    };
    let findUser = await mongo.findOne(params);

    if (findUser.status !== "success") {
      return response.status(500).json({ message: findUser.message });
    }

    user = findUser.data;

    if (!user) {
      return response.status(400).json({ message: "User not found" });
    }

    let { name, email, login } = request.body;

    name = name ? name : user.name;
    email = email ? email : user.email;
    login = login ? login : user.login;

    const validate = validateFields(name, email, login);

    if (validate.status !== "success") {
      return response.status(400).json({ message: validate.message });
    }

    params = {
      model: User,
      where: { _id: { $ne: user._id }, $or: [{email}, {login}] },
      fields: ["email", "login"]
    };
    findUser = await mongo.findOne(params);

    if (findUser.status == "success") {
      if (findUser.data) {
        let already_taken = email == findUser.data.email && login == findUser.data.login ? ["email", "login"] : email == findUser.data.email ? ["email"] : ["login"];
    
        return response.status(400).json({ message: "Already in use", already_taken });
      }
    }
    else {
      return response.status(500).json({ message: findUser.message });
    }

    params = {
      model: User,
      filter: { _id: id },
      body: {
        name,
        email,
        login,
      }
    };
    let updateUser = await mongo.update(params);

    if (updateUser.status !== "success") {
      return response.status(500).json({ message: updateUser.message });
    }

    return response.json({ message: "User successfully updated" });
  },

  async updatePassword(request, response) {
    const { id } = request.params;
    const { password } = request.body;

    let params = {
      model: User,
      where: { _id: id },
      fields: ["_id"]
    };
    let findUser = await mongo.findOne(params);

    if (findUser.status !== "success") {
      return response.status(500).json({ message: findUser.message });
    }

    if (!findUser.data) {
      return response.status(400).json({ message: "User not found" });
    }

    if (!validPassword(password)) {
      return response.status(400).json({ message: "Password must contain at minimum 8 and maximum 15 characters and at least 1 special character, 1 number and 1 uppercase letter" });
    }

    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        return response.status(500).json({ message: err });
      }
      else {
        params = {
          model: User,
          filter: { _id: id },
          body: {
            password: hash
          }
        }
        let updatePassword = await mongo.update(params);
    
        if (updatePassword.status !== "success") {
          return response.status(500).json({ message: updatePassword.message });
        }
        else {
          return response.json({ message: "Password successfully updated" });
        }
      }
    })
  },

  async delete(request, response) {
    const { id } = request.params;

    let params = {
      model: User,
      where: { _id: id },
      fields: ["_id"]
    };
    let findUser = await mongo.findOne(params);

    if (findUser.status !== "success") {
      return response.status(500).json({ message: findUser.message });
    }

    user = findUser.data;

    if (!user) {
      return response.status(400).json({ message: "User not found" });
    }
      
    params = {
      model: User,
      filter: { _id: id }
    };
    let deleteUser = await mongo.delete(params);

    if (deleteUser.status !== "success") {
      return response.status(500).json({ message: deleteUser.message });
    }

    return response.json({ message: "User successfully deleted" });
  },
}