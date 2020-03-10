// ====================
// imports
// ====================
const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const multer = require('multer');

// ====================
// controller
// ====================
const matchesController = require('../controllers/matchesController');

// ====================
// requests
// ====================

//////////
// GET
//////////

// get all products
router.get('/', matchesController.getAllMatches);

// postman testing: get one Match
router.get('/:matchId', checkAuth, matchesController.getOneMatch);

//////////
// POST
//////////

// create new match
router.post('/', checkAuth, matchesController.createMatch);

// update existing match
router.post('/update', checkAuth, matchesController.updateMatch);

// delete
router.post('/delete', checkAuth, matchesController.deleteMatch);

// ====================
// exports
// ====================
module.exports = router;














