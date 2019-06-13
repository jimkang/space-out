var request = require('basic-browser-request');
var BodyMover = require('request-body-mover');
var pluck = require('lodash.pluck');

function getTracksFromAlbum({ uri, spotifyToken }, done) {
  var uriParts = uri.split(':');
  var albumId = uriParts[uriParts.length - 1];
  var reqOpts = {
    method: 'GET',
    json: true,
    url: `https://api.spotify.com/v1/albums/${albumId}/tracks?limit=50`,
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
    done(null, { uris: pluck(body.items, 'uri') });
  }
}

module.exports = getTracksFromAlbum;
