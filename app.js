var RouteState = require('route-state');
var handleError = require('handle-error-web');
var { version } = require('./package.json');
var spotifyTokenFlow = require('./flows/spotify-token-flow');
var playFlow = require('./flows/play-flow');
var askToLoginFlow = require('./flows/ask-to-log-in-flow');

var routeState = RouteState({
  followRoute,
  windowObject: window
});

(function go() {
  renderVersion();
  routeState.routeFromHash();
  window.onerror = reportTopLevelError;
})();

function followRoute(routeDict) {
  var { access_token, state, seed, skipMusic, firstAudioURL } = routeDict;
  if (!seed) {
    seedWithDate();
    return;
  }
  if (!skipMusic && (access_token || state)) {
    spotifyTokenFlow(routeDict, routeState);
    return;
  } else if (skipMusic === 'yes') {
    playFlow({ seed, routeState, firstAudioURL });
  } else {
    askToLoginFlow({ routeState, routeDict });
  }
}

function reportTopLevelError(msg, url, lineNo, columnNo, error) {
  handleError(error);
}

function seedWithDate() {
  routeState.addToRoute({ seed: new Date().toISOString() });
}

function renderVersion() {
  var versionInfo = document.getElementById('version-info');
  versionInfo.textContent = version;
}
