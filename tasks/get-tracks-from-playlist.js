var BodyMover = require('request-body-mover');
var pluck = require('lodash.pluck');
var request = require('basic-browser-request');

function getTracksFromPlaylist({ spotifyToken, uri }, done) {
  var uriParts = uri.split(':');
  var playlistId = uriParts[uriParts.length - 1];
  var reqOpts = {
    method: 'GET',
    json: true,
    url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    headers: {
      Authorization: `Bearer ${spotifyToken}`
    }
  };
  request(reqOpts, BodyMover(passTracks));

  function passTracks(error, body) {
    if (error) {
      done(error);
      return;
    }
    done(null, { uris: pluck(pluck(body.items, 'track'), 'uri') });
  }
}

module.exports = getTracksFromPlaylist;
