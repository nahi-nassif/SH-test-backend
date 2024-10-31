// services/spotify.js
const client_id = process.env.SPOTIFY_CLIENT_ID; 
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const authUrl = process.env.SPOTIFY_API_AUTH_URL;
const apiUrl = process.env.SPOTIFY_API_URL;

let accessToken = null;
let tokenExpiresAt = 0;

async function getToken() {
    const response = await fetch(authUrl, {
        method: 'POST',
        body: new URLSearchParams({
        'grant_type': 'client_credentials',
        }),
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
        },
    });

    if(response.status !== 200){  
        throw new Error("Failed to get Spotify Access Token")
    }

    const resp = await response.json();   

    accessToken = resp.access_token;
    tokenExpiresAt = Date.now() + resp.expires_in * 1000; // expires_in is in seconds

    return accessToken;
}

async function getAccessToken() {
    // Refresh the token if it's about to expire within 3 minutes
    const bufferTime = 3 * 60 * 1000; // 3 minutes in milliseconds
  
    if (!accessToken || Date.now() > (tokenExpiresAt - bufferTime)) {
      console.log("Requesting Spotify Auth Token")
      await getToken();
    }
    return accessToken;
}

exports.getGenres = async () => {
    
    const response = await fetch(apiUrl + "/recommendations/available-genre-seeds", {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + await getAccessToken() },
    });


    //In any case the Token was not authorized
    if(response.status === 401 || response.status === 403){
        const response2 = await fetch(apiUrl + "/recommendations/available-genre-seeds", {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + await getToken() },
        });

        return response2.json();
    }

    //In case of an error
    if(response.status !== 200){  
        throw new Error("Failed to get Spotify Genres");
    }

    const resp = await response.json();

    return resp?.genres || [];
}

exports.getArtistsByGenre = async (query = "",type = 'artist',limit = 20,offset = 0) => {

    const response = await fetch(`${apiUrl}/search?q=${query}&type=${type}&limit=${limit}&offset=${offset}`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + await getAccessToken() },
    });


    //In any case the Token was not authorized
    if(response.status === 401 || response.status === 403){
        const response2 = await fetch(`${apiUrl}/search?q=${query}&type=${type}&limit=${limit}&offset=${offset}`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + await getToken() },
        });

        return response2.json();
    }

    //In case of an error
    if(response.status !== 200){  
        throw new Error("Failed to get Spotify Genres");
    }

    const resp = await response.json();

    return resp.artists?.items || [];
}