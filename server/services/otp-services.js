const crypto = require("crypto");
const { generateHash } = require("../services/hash-services");

class OTPServices {
  /* ------- Generate OTP Function ---------*/
  async generateOtp() {
    return crypto.randomInt(1000, 9999);
  }

  /* ------- Verify OTP Function ---------*/
  async verifyOtp(data, hashedOTP) {
    const hashedData = await generateHash(data);
    return hashedData === hashedOTP;
  }
}

module.exports = new OTPServices();
