const crypto = require('crypto')

exports.hashOtp = async (data) => {
    return crypto
    .createHmac('sha256', process.env.HASH_SECRET)
    .update(data)
    .digest('hex');
}