var playCollection = require('../tasks/play-collection');
var getTracksFromPlaylist = require('../tasks/get-tracks-from-playlist');
var getTracksFromAlbum = require('../tasks/get-tracks-from-album');
var handleError = require('handle-error-web');
var queue = require('d3-queue').queue;

var ambientCollections = [
  'spotify:playlist:37i9dQZF1DX1n9whBbBKoL',
  'spotify:playlist:37i9dQZF1DX0i61tT0OnnK',
  'spotify:playlist:37i9dQZF1DX4wG1zZBw7hm',
  'spotify:album:5uT0LQPeZxTV914X5hP9s9',
  'spotify:album:27ftYHLeunzcSzb33Wk1hf',
  'spotify:album:2Kn0WVtKYv7bcE3EYk3wRA',
  'spotify:playlist:2xzvhh7pEpGPJOLSE3FcTo',
  'spotify:album:122nddDJoOZdq3KTM6E77I',
  'spotify:album:3zQQtu3a9Y7ZEDAKcftznw',
  'spotify:album:2HB2ul11B48chK3PV7S4KS'
  //'spotify:album:15YBAf362L60KpbrSjduRY',
  //'spotify:album:7M2EhhKnJYcmluPNzmB35N'
];

function scheduleMusic({ spotifyPlayer, spotifyToken, probable }) {
  var collection = probable.pick(ambientCollections);
  var getTracks = getTracksFromPlaylist;
  if (collection.startsWith('spotify:album:')) {
    getTracks = getTracksFromAlbum;
  }

  var q = queue(1);
  q.defer(spotifyPlayer.stop);
  // The SDK seems to default to 100% volume.
  q.defer(spotifyPlayer.setVolume, 0.1);
  q.defer(playCollection, {
    spotifyToken,
    uri: collection,
    deviceId: spotifyPlayer.deviceId,
    getTracks,
    shuffle: probable.shuffle
  });
  q.awaitAll(handleError);

  // TODO: Reschedule at end of play.
}

module.exports = scheduleMusic;
