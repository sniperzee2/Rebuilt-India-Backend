const crypto = require('crypto')

//Careting a hash for security
exports.hashOtp = async (data) => {
    return crypto
    .createHmac('sha256', process.env.HASH_SECRET)
    .update(data)
    .digest('hex');
}