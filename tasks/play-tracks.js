var request = require('basic-browser-request');
var BodyMover = require('request-body-mover');

function playTracks({ spotifyToken, uris, deviceId }, done) {
  let reqOpts = {
    method: 'PUT',
    json: true,
    url: 'https://api.spotify.com/v1/me/player/play?device_id=' + deviceId,
    headers: {
      Authorization: `Bearer ${spotifyToken}`
    }
  };
  if (uris) {
    reqOpts.body = { uris };
  }
  request(reqOpts, BodyMover(done));
}

module.exports = playTracks;
