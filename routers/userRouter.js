const router = require('express').Router();
const {SendOTP,VerifyOTP,loginWithEmail,loginWithPhone,forgotPassword,resetPassword,getUserByToken,authPass,editUser} = require('../controllers/authController');

router.post('/sendOTP', SendOTP);
// router.post('/sendOTPOnLogin', SendOTPOnLogin);
router.post('/verifyOTP', VerifyOTP);
// router.post('/loginWithEmail', loginWithEmail);
// router.post('/loginWithPhone', loginWithPhone);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword", resetPassword);
router.get("/getUserByToken",authPass, getUserByToken);
router.put('/updateUser',authPass, editUser);

module.exports = router;
