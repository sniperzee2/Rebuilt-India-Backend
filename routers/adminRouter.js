const router = require('express').Router();
const {registerAdmin,loginWithEmailAdmin,forgotPassword,resetPassword,authPassAdmin,getAdminByToken} = require('../controllers/adminController');

router.post('/registerAdmin', registerAdmin);
router.post('/loginWithEmail', loginWithEmailAdmin);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);
router.get("/getUserByToken",authPassAdmin, getAdminByToken);

module.exports = router;
