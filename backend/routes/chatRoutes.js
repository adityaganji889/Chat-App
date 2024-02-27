const { allUsers, accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup, addNewAdminToGroup, removeExistingAdminFromGroup, LeaveFromGroup } = require("../controllers/chatControllers");
const authMiddleware = require("../middlewares/authMiddleware");

const router = require("express").Router();


router.get("/allUsers",authMiddleware,allUsers);
router.post("/accessChat",authMiddleware,accessChat);
router.get("/fetchChats",authMiddleware,fetchChats);
router.post("/createGroupChat",authMiddleware,createGroupChat);
router.put("/renameGroup",authMiddleware,renameGroup);
router.put("/addToGroup",authMiddleware,addToGroup);
router.put("/removeFromGroup",authMiddleware,removeFromGroup);
router.put("/addNewAdminToGroup",authMiddleware,addNewAdminToGroup);
router.put("/removeExistingAdminFromGroup",authMiddleware,removeExistingAdminFromGroup);
router.put("/leaveFromGroup",authMiddleware,LeaveFromGroup);

module.exports = router;