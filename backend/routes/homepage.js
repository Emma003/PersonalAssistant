const express = require('express');
const router = express.Router();
const { 
    getHomepageInfo
} = require('../controllers/homepageController.js');

//get homepage info (username + quote + author)
router.get('/', getHomepageInfo);

//export router
module.exports = router;