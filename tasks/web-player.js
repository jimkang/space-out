/* global Spotify */

function setUpWebPlayer(
  { playerName, token, handleError, onPlayerWentOffline, onStatusChange },
  done
) {
  var player;

  var script = document.createElement('script');
  script.src = 'https://sdk.scdn.co/spotify-player.js';
  document.body.appendChild(script);
  initWebPlayer();

  function initWebPlayer() {
    window.onSpotifyWebPlaybackSDKReady = onSDKReady;
  }

  function onSDKReady() {
    player = new Spotify.Player({
      name: playerName,
      getOAuthToken: cb => {
        cb(token);
      }
    });

    // Error handling
    player.addListener('initialization_error', handleError);
    player.addListener('authentication_error', handleError);
    player.addListener('account_error', handleError);
    player.addListener('playback_error', handleError);

    // Playback status updates
    if (onStatusChange) {
      player.addListener('player_state_changed', onStatusChange);
    }

    player.addListener('ready', onPlayerReady);
    if (onPlayerWentOffline) {
      player.addListener('not_ready', onPlayerWentOffline);
    }

    // Connect to the player!
    player.connect();
  }

  function onPlayerReady({ device_id }) {
    console.log('SDK player is ready with Device ID', device_id);
    done(null, {
      deviceId: device_id,
      sdkPlayer: player,
      setVolume,
      stop,
      next,
      getCurrentState
    });
  }

  function setVolume(volume, done) {
    player
      .setVolume(0.2)
      .then(() => done())
      .catch(done);
  }

  function stop(done) {
    player
      .pause()
      .then(() => done())
      .catch(done);
  }

  function next(done) {
    player
      .nextTrack()
      .then(() => done())
      .catch(done);
  }

  function getCurrentState(done) {
    player
      .getCurrentState()
      .then(state => done(null, state))
      .catch(done);
  }
}

module.exports = setUpWebPlayer;
