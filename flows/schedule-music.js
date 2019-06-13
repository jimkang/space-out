var playCollection = require('../tasks/play-collection');
var getTracksFromPlaylist = require('../tasks/get-tracks-from-playlist');
var getTracksFromAlbum = require('../tasks/get-tracks-from-album');
var handleError = require('handle-error-web');
var queue = require('d3-queue').queue;

var ambientCollections = [
  'spotify:playlist:37i9dQZF1DX1n9whBbBKoL',
  'spotify:playlist:37i9dQZF1DX0i61tT0OnnK',
  'spotify:playlist:37i9dQZF1DX4wG1zZBw7hm',
  'spotify:album:5uT0LQPeZxTV914X5hP9s9'
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
  q.defer(spotifyPlayer.setVolume, 0.2);
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
