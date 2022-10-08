const crypto = require("crypto");

class HashServices {
  /* ------- Generate hash Function ---------*/
  async generateHash(data) {
    return crypto
      .createHmac("sha256", process.env.SECRET_KEY)
      .update(data)
      .digest("hex");
  }
}

module.exports = new HashServices();
