const mongoose = require('mongoose');

module.exports = {
  isNumber(value) {
    if (Object.prototype.toString.call(value) == '[object Number]') {
      return true;
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
  
  validEmail(value) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(value);
  },

  validPassword(value) {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
    return re.test(value);
  },
}