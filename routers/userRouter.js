const router = require('express').Router();
const {SendOTP,VerifyOTPOnSignUp,loginWithEmail,loginWithPhone,forgotPassword,resetPassword,getUserByToken,authPass} = require('../controllers/authController');

router.post('/sendOTP', SendOTP);
router.post('/verifyOTPOnSignUp', VerifyOTPOnSignUp);
router.post('/loginWithEmail', loginWithEmail);
router.post('/loginWithPhone', loginWithPhone);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);
router.get("/getUserByToken",authPass, getUserByToken);

module.exports = router;
