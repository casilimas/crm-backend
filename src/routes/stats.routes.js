const express = require('express');
const router = express.Router();

const getUserStats = require('../controllers/stats/getUserStats');
const { protect, isAdminOrBoss } = require('../middleware/authMiddleware');


router.get('/user/:userId', protect, isAdminOrBoss, getUserStats);


router.get('/me', protect, async (req, res) => {
  req.params.userId = req.user.id; 
  return getUserStats(req, res);   
});

module.exports = router;
