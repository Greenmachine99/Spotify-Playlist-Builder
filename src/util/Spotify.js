let accessToken;
let clientID = 'XXXX';
let redirectURL = "http://localhost:3000";

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }

        // Check for Access Token Match
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);

            // Clearing Parameters, allowing to grab new AccessToken when it expires
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
        } else {
            const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURL}`;
            window.location = accessURL;
        }

    },

    async search(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, 
            { headers: {
            Authorization: `Bearer ${accessToken}`
            },
            method: 'GET'
        }).then(response => {
            return response.json();
        }
        ).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            } 
            console.log(jsonResponse.tracks);
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                Name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
                }));  
            })
    },

    async savePlaylist(playlistName, trackUris) {
        if (!playlistName || !trackUris.length) {
            return;
        }

        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}`};
        let userID;

        return fetch(`https://api.spotify.com/v1/me`, {headers: headers, method: 'GET'} 
        ).then(response => response.json()
        ).then(jsonResponse => {
            console.log(jsonResponse);
            userID = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, 
            {
                headers: headers, 
                method: "POST",
                body: JSON.stringify({name: playlistName})
            }).then(response => response.json()
            ).then(jsonResponse => {
                const playlistID = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, 
                {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({uris: trackUris})
                })
            })
        })
    }

}


export default Spotify;