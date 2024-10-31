// controllers/spotifyController.js
const spotify = require("../services/spotify");

exports.getSpotifyGenres = async (req, res) => {
    try{

        const response = await spotify.getGenres();
        res.status(201).json(response);

    } catch (error) {
        console.error('Error getting the spotify genres:', error);
        // Send an appropriate error response
        res.status(500).json({
            message: 'An error occurred while getting spotify genres.',
            error: error.message,  //include error details
        });
    }
}

exports.getSpotifyArtistsByGenre = async (req, res) => {
    try{

        const limit = 20;
        const page = parseInt(req.query.page) || 1;
        const offset = limit * ( page > 0 ? (page - 1) : 0);
        const genre = encodeURI(req.query.genre) || "";
        const type = "artist"

        const response = await spotify.getArtistsByGenre(genre, type, limit, offset);
        res.status(201).json(response);

    } catch (error) {
        console.error('Error getting the spotify artists:', error);
        // Send an appropriate error response
        res.status(500).json({
            message: 'An error occurred while getting spotify artists.',
            error: error.message,  //include error details
        });
    }
}