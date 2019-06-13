var playTracks = require('./play-tracks');
var CollectCtor = require('collect-in-channel');
var waterfall = require('async-waterfall');
var curry = require('lodash.curry');

function playCollection(
  { spotifyToken, uri, deviceId, shuffle, getTracks },
  done
) {
  var channel = {
    spotifyToken,
    uri,
    deviceId
  };
  var Collect = CollectCtor({ channel });

  waterfall(
    [
      curry(getTracks)(channel),
      Collect({ props: [[getTrackURIs, 'uris']] }),
      playTracks
    ],
    done
  );

  function getTrackURIs({ uris }) {
    if (shuffle) {
      return shuffle(uris);
    }
    return uris;
  }
}

module.exports = playCollection;
