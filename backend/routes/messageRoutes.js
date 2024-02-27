const router = require("express").Router()
const { sendMessage, allMessages } = require("../controllers/messageControllers");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/sendMessage",authMiddleware,sendMessage);
router.get("/allMessages/:chatId",authMiddleware,allMessages);

module.exports = router;