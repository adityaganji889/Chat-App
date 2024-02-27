const router = require("express").Router();
const {login, register, sendPasswordResetLink, resetPassword, verifyemail, getUserInfo, verifyEmailLink, updateProfile, updateUserEmail, updateUserPassword, getAllUsers, updateUserAdminStatus, deleteUser} = require("../controllers/userControllers")
const authMiddleware = require("../middlewares/authMiddleware")

router.post("/register",register);
router.post("/login",login);
router.post("/send-password-reset-link",sendPasswordResetLink);
router.post("/reset-password",resetPassword);
router.post("/verifyemail",verifyemail);
router.post("/verifyEmailLink",verifyEmailLink);
router.get("/get-user-info",authMiddleware,getUserInfo);
router.put("/update-user-info",authMiddleware,updateProfile);
router.put("/update-user-email",authMiddleware,updateUserEmail);
router.put("/update-user-password",authMiddleware,updateUserPassword);
router.get('/getAllUsers',authMiddleware,getAllUsers)
router.put('/updateUserAdminStatus/:id',authMiddleware,updateUserAdminStatus);
router.delete('/deleteUser/:id',authMiddleware,deleteUser);

module.exports = router;