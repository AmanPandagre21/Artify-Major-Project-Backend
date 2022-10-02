const bcrypt = require("bcrypt");

class PasswordServices {
  // Converting Paswword into hash password
  async generateHashPassword(password) {
    return bcrypt.hash(password, 10);
  }

  // comparing hash password and normal password
  async compareHashPassword(password, hashPassword) {
    return bcrypt.compare(password, hashPassword);
  }
}

module.exports = new PasswordServices();
