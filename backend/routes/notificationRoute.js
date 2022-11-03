const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {accessNotification, updateNotification} = require('../controllers/notificationController');



const router = express.Router();


router.route('/:userId').get(accessNotification);
router.route('/').put(protect,updateNotification);



module.exports = router;



