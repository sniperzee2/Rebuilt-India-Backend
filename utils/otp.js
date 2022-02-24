const hashService = require('./hash')
require('dotenv').config()
const axios = require('axios')

exports.generateOtp = async (req, res) => {
    const otp = Math.floor(Math.random()*(9000)+1000);
    return otp
}

exports.sendOtp = async (phone, otp) => {
    try{
        return axios.get(`http://smsdealnow.com/api/pushsms?user=WELLKININSTA&authkey=92WSUhuCrjgzE&sender=WELKNI&mobile=${phone}&text=DO+NOT+SHARE+this+code+with+anyone+for+account+safety.+Your+REBUILT+ACCOUNT+LOGIN+verification+code+is%3A+${otp}+WELKNI&output=json&entityid=1701163741009212327&templateid=1707164552000953626`)
    }catch(err){
        console.log(err)
    }
}

exports.verifyOtp = async (data, hashedOtp) => {
    const Hashed = await hashService.hashOtp(data)
    console.log(hashedOtp)
    console.log(Hashed)
    return Hashed === hashedOtp
}