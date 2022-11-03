const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { accessChat } = require('../controllers/chatController');
const { fetchChats } = require('../controllers/chatController');
const { createGroupChat} = require('../controllers/chatController');
const { renameGroup} = require('../controllers/chatController');
const { addToGroup} = require('../controllers/chatController');
const { removeFromGroup} = require('../controllers/chatController');

const router = express.Router();

//only logged in user can acccess this
router.route('/').post(protect,accessChat)
// for fetching chats from the db
router.route('/').get(protect,fetchChats)
// //group creation
router.route('/group').post(protect,createGroupChat)
// //rename
router.route('/rename').put(protect,renameGroup)
// //remove from group
router.route('/groupremove').put(protect,removeFromGroup)
router.route('/groupadd').put(protect,addToGroup)   
 

module.exports = router