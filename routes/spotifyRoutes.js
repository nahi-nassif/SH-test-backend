// routes/spotifyRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/spotifyController');

//Usually this request contains user data
router.get('/genres', userController.getSpotifyGenres);
router.get('/artists', userController.getSpotifyArtistsByGenre);
module.exports = router;