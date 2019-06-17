var playCollection = require('../tasks/play-collection');
var getTracksFromPlaylist = require('../tasks/get-tracks-from-playlist');
var getTracksFromAlbum = require('../tasks/get-tracks-from-album');
var handleError = require('handle-error-web');
var queue = require('d3-queue').queue;
var registerSingleListener = require('../register-single-listener');
var SpotifyResolve = require('spotify-resolve');
var request = require('basic-browser-request');
var sb = require('standard-bail')();

var trackLink = document.getElementById('track-link');
var collectionLink = document.getElementById('collection-link');
var nextSong = document.getElementById('next-song');
var currentlyPlayingMusicSection = document.getElementById(
  'currently-playing-music'
);

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
  'spotify:album:2HB2ul11B48chK3PV7S4KS',
  //'spotify:album:15YBAf362L60KpbrSjduRY',
  //'spotify:album:7M2EhhKnJYcmluPNzmB35N'
  'spotify:album:6ROeoiTdZBO7N5C8gC2xix',
  'spotify:album:6NkuCdMz5tGmHbOXAWbtCW',
  'spotify:playlist:37i9dQZF1DXbIeCFU20wRm',
  'spotify:album:2W82HHqCOm2ZCl7Er7VCSC'
];

function scheduleMusic({ spotifyPlayer, spotifyToken, probable }) {
  registerSingleListener({
    element: nextSong,
    eventName: 'click',
    listener: playNext
  });
  var spResolve = SpotifyResolve({ bearerToken: spotifyToken, request });

  var collection = probable.pick(ambientCollections);
  var collectionName;

  var getTracks = getTracksFromPlaylist;
  if (collection.startsWith('spotify:album:')) {
    getTracks = getTracksFromAlbum;
  }

  var q = queue(1);
  q.defer(spotifyPlayer.stop);
  // The SDK seems to default to 100% volume.
  q.defer(spotifyPlayer.setVolume, 0.2);
  q.defer(registerPlayerListener);
  q.defer(resolveCollection, collection);
  q.defer(playCollection, {
    spotifyToken,
    uri: collection,
    deviceId: spotifyPlayer.deviceId,
    getTracks,
    shuffle: probable.shuffle
  });
  q.awaitAll(handleError);

  currentlyPlayingMusicSection.classList.remove('hidden');

  // TODO: Reschedule at end of play.
  function playNext() {
    spotifyPlayer.next(handleError);
  }

  function registerPlayerListener(done) {
    spotifyPlayer.sdkPlayer.addListener(
      'player_state_changed',
      onPlayerStateChanged
    );
    setTimeout(done, 0);
  }

  function onPlayerStateChanged({ track_window }) {
    var track = track_window.current_track;
    if (track) {
      trackLink.href = track.uri;
      trackLink.textContent = `${track.name} by ${track.artists[0].name}`;
    }
  }

  function resolveCollection(uri, done) {
    spResolve(uri, sb(saveCollectionDetails, handleError));

    function saveCollectionDetails(collectionObject) {
      collectionName = collectionObject.name;
      renderCollectionDetails();
      done();
    }
  }

  function renderCollectionDetails() {
    collectionLink.href = collection;
    collectionLink.textContent = collectionName;
  }
}

module.exports = scheduleMusic;
