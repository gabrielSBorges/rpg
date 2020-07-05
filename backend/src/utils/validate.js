const mongoose = require('mongoose');

module.exports = {
  isNumber(value) {
    if (Object.prototype.toString.call(value) == '[object Number]') {
      return true;
    }
  
    return false;
  },

  isString(value) {
    if (Object.prototype.toString.call(value) == '[object String]') {
      return true;
    }
  
    return false;
  },

  isInteger(value) {
    if (Number.isInteger(value)) {
      return true;
    }

    return false;
  },

  isFloat(value) {
    if (!Number.isInteger(value) && Object.prototype.toString.call(value) == '[object Number]') {
      return true;
    }

    return false;
  },

  isBool(value) {
    if (value !== null && value !== undefined) {
      if (Object.prototype.toString.call(value) == '[object Boolean]') {
        return true;
      }
    }

    return false;
  },

  isArray(value) {
    if (value) {
      if (Object.prototype.toString.call(value) == '[object Array]') {
        return true;
      }
    }
    
    return false;
  },

  isObject(value) {
    if (Object.prototype.toString.call(value) == '[object Object]') {
      return true;
    }
    
    return false;
  },

  isEmpty(value) {
    // Se for string
    if (Object.prototype.toString.call(value) == '[object String]') {
      value = value.replace(/\s/g,'')
      
      if (value === "") {
        return true
      }
    }

    // Se for array
    if (Object.prototype.toString.call(value) == '[object Array]') {
      if (value.length == 0) {
        return true
      }
    }

    // Se for objeto
    if (Object.prototype.toString.call(value) == '[object Object]') {
      if (Object.keys(value).length == 0) {
        return true
      }
    }

    // Se for null ou undefined
    if (Object.prototype.toString.call(value) == '[object Null]' || Object.prototype.toString.call(value) == '[object Undefined]') {
      return true
    }
    
    return false
  },

  isMongoId(value) {
    if (!value) {
      return false;
    }

    if (Object.prototype.toString.call(value) == '[object Number]') {
      return false;
    }

    if (mongoose.Types.ObjectId.isValid(value)) {
      return true;
    }

    return false;
  },

  sameMongoId(id_1, id_2) {
    if (id_1.toString() == id_2.toString()) {
      return true;
    }

    return false;
  },

  MongoID(value) {
    return mongoose.Types.ObjectId(value);
  },
  
  validEmail(value) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(value);
  },

  validPassword(value) {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
    return re.test(value);
  },
}