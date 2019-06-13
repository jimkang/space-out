var WebPlayer = require('../tasks/web-player');
var qs = require('qs');
var sb = require('standard-bail')();
var request = require('basic-browser-request');
var SpotifyResolve = require('spotify-resolve');
var WrapRedirect = require('../tasks/wrap-redirect');
var handleError = require('handle-error-web');
var playFlow = require('./play-flow');

const playerName = 'Space out web player';

function spotifyTokenFlow(routeDict, routeState) {
  var { access_token, state, seed } = routeDict;
  var gotPlayerReadyEvent = false;

  if (state) {
    var thawedDict = unpackRoute(state);
    thawedDict.access_token = access_token;
    routeState.overwriteRouteEntirely(thawedDict);
    return;
  }

  checkToken(access_token, sb(useToken, WrapRedirect(routeDict)));

  function useToken() {
    WebPlayer(
      {
        playerName,
        token: access_token,
        handleError: handleWebPlayerError,
        onPlayerWentOffline
      },
      useWebPlayer
    );
  }

  function useWebPlayer(error, spotifyPlayer) {
    if (error) {
      console.error(error, error.stack);
      handleError(
        new Error(
          "Spotify Token Flow to Mission Control: We can't initialize the Spotify web player. We'll have to go on ahead without it."
        )
      );
    }
    if (gotPlayerReadyEvent) {
      return;
    }

    gotPlayerReadyEvent = true;
    playFlow({ seed, spotifyPlayer, spotifyToken: access_token, routeState });
  }
}

function checkToken(spotifyToken, done) {
  SpotifyResolve({
    request,
    bearerToken: spotifyToken
  })('spotify:track:1IfFphfaKhVd4h6woepFpV', checkResponse);

  function checkResponse(error) {
    if (error) {
      done(error);
    } else {
      done();
    }
  }
}

function unpackRoute(encodedStateFromRedirect) {
  return qs.parse(decodeURIComponent(encodedStateFromRedirect));
}

function handleWebPlayerError(error) {
  // This error often happens when you ask the web player to pause,
  // but there's nothing playing. We don't need to surface that.
  if (error.message === 'Cannot perform operation; no list was loaded.') {
    console.error(error);
  } else {
    handleError(error);
  }
}

function onPlayerWentOffline({ device_id }) {
  handleError(
    new Error(
      `Spotify Token Flow to Mission Control: We've lost the Spotify web player for device id ${device_id}. We'll have to go on ahead without it.`
    )
  );
}

module.exports = spotifyTokenFlow;
