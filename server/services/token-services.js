const jwt = require("jsonwebtoken");
const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;

class TokenServices {
  /* ------- Generate Tokens Function ---------*/
  async generateTokens(payLoad) {
    return jwt.sign(payLoad, accessTokenSecret, {
      expiresIn: "30d",
    });
  }

  /* ------- Verify Access Token Function ---------*/
  async verifyAccessToken(accessToken) {
    return jwt.verify(accessToken, accessTokenSecret);
  }
}

module.exports = new TokenServices();
